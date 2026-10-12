"use client";

import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";

let sdkPromise;
function loadKakao(key) {
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const finish = () => window.kakao.maps.load(() => resolve(window.kakao));
      if (window.kakao?.maps) return finish();
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&libraries=services&autoload=false`;
      script.onload = () => window.kakao?.maps ? finish() : reject(new Error("SDK unavailable"));
      script.onerror = () => { script.remove(); reject(new Error("SDK load failed")); };
      document.head.appendChild(script);
    }).catch(error => { sdkPromise = undefined; throw error; });
  }
  return sdkPromise;
}

export default function KakaoMap({ address, venue }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [destination, setDestination] = useState(null);
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  
  useEffect(() => {
    if (!key) {
      console.error("카카오맵: 환경변수 키가 없습니다.");
      setStatus("error");
      return;
    }
    let cancelled = false;
    let observer;
    let marker;
    let map;
    const container = containerRef.current;
    setStatus("loading");
    setDestination(null);
    const timer = setTimeout(() => { if (!cancelled) setStatus("error"); }, 15000);
    loadKakao(key).then(kakao => {
      if (cancelled) return;
      new kakao.maps.services.Geocoder().addressSearch(address, (results, resultStatus) => {
        if (cancelled) return;
        clearTimeout(timer);
        if (resultStatus !== kakao.maps.services.Status.OK || !results.length) {
          setStatus("error"); return;
        }
        try {
          const { x, y } = results[0];
          const center = new kakao.maps.LatLng(Number(y), Number(x));
          map = new kakao.maps.Map(container, { center, level: 3 });
          marker = new kakao.maps.Marker({ map, position: center, title: venue });
          map.setZoomable(false);
          map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
          if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(() => { map.relayout(); map.setCenter(center); });
            observer.observe(container);
          }
          setDestination(`https://map.kakao.com/link/to/${encodeURIComponent(venue)},${y},${x}`);
          setStatus("ready");
        } catch { setStatus("error"); }
      });
    }).catch((error) => {
      console.error("카카오맵 로딩 실패:", error);
    
      if (!cancelled) {
        clearTimeout(timer);
        setStatus("error");
      }
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer?.disconnect();
      marker?.setMap(null);
      container?.replaceChildren();
    };
  }, [key, address, venue]);

  return (
    <div>
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#f6f2ee" }}>
        <div ref={containerRef} aria-label={`${venue} 위치 지도`} style={{ width: "100%", height: 300 }} />
        {status !== "ready" && (
          <p role="status" style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", margin: 0, padding: 24, textAlign: "center" }}>
            {status === "loading" ? "지도를 불러오는 중입니다." : "아래 카카오맵 버튼에서 위치를 확인해 주세요."}
          </p>
        )}
      </div>
      {destination && <a className="map-button" href={destination} target="_blank" rel="noreferrer">카카오맵 길찾기 <Icon name="external" /></a>}
    </div>
  );
}
