"use client";
import Icon from "./Icon";
import KakaoMap from "./KakaoMap";

import { useEffect, useMemo, useRef, useState } from "react";
const event = {
  childName: "박세아",
  date: "2026년 11월 1일 일요일 오후 5시",
  venue: "신라스테이 3층 카페",
  address: "부산 강서구 명지국제7로 38",
  father: "박준현",
  mother: "박나리",
};
const petals = [
  { left: "7%", delay: "-2s", duration: "12s", size: "23px" },
  { left: "16%", delay: "-8s", duration: "15s", size: "18px" },
  { left: "27%", delay: "-5s", duration: "13s", size: "27px" },
  { left: "39%", delay: "-11s", duration: "17s", size: "20px" },
  { left: "51%", delay: "-4s", duration: "14s", size: "22px" },
  { left: "62%", delay: "-9s", duration: "16s", size: "17px" },
  { left: "72%", delay: "-1s", duration: "13s", size: "26px" },
  { left: "83%", delay: "-7s", duration: "18s", size: "19px" },
  { left: "92%", delay: "-12s", duration: "15s", size: "22px" },
];

function Calendar() {
  const days = [
    ["1", "2", "3", "4", "5", "6", "7"],
    ["8", "9", "10", "11", "12", "13", "14"],
    ["15", "16", "17", "18", "19", "20", "21"],
    ["22", "23", "24", "25", "26", "27", "28"],
    ["29", "30", "1", "2", "3", "4", "5"],
  ];
  return (
    <div className="calendar" aria-label="2026년 11월 달력">
      <div className="calendar-month">
        <span>NOVEMBER</span>
        <strong>11</strong>
        <em>2026</em>
      </div>
      <div className="weekdays">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
          (day) => (
            <b key={day}>{day}</b>
          ),
        )}
      </div>
      {days.map((week, weekIndex) => (
        <div className="week" key={weekIndex}>
          {week.map((day, dayIndex) => {
            const muted = weekIndex === 4 && dayIndex >= 2;
            const selected = day === "1" && weekIndex === 0;
            return (
              <span
                className={`${selected ? "selected" : ""} ${
                  muted ? "muted" : ""
                }`}
                key={`${weekIndex}-${dayIndex}`}
              >
                {day}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
function Account({ account }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  async function copyAccount() {
    await navigator.clipboard.writeText(
      `${account.bank} ${account.number} ${account.owner}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className={`account ${open ? "is-open" : ""}`}>
      <button
        className="account-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{account.label}</span>
        <i aria-hidden="true"><Icon name="down" /></i>
      </button>
      {open && (
        <div className="account-detail">
          <p>
            <strong>{account.number}</strong>
            <span>
              {account.bank} · {account.owner}
            </span>
          </p>
          <button onClick={copyAccount}>
            {copied ? "복사 완료" : "복사"}
          </button>
        </div>
      )}
    </div>
  );
}
export default function Invitation({ galleryPhotos = [] }) {
  const [showTop, setShowTop] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const audioRef = useRef(null);
  const closeLightboxRef = useRef(null);
  const mapLink = useMemo(
    () =>
      `https://map.kakao.com/link/search/${encodeURIComponent(
        event.address,
      )}`,
    [],
  );
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal-section");
    // 모바일에서는 등장 애니메이션으로 인해 내용이 숨겨지는
    // 현상을 방지하기 위해 처음부터 표시합니다.
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(max-width: 768px)").matches
    ) {
      sections.forEach((section) => {
        section.classList.add("is-visible");
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -8% 0px",
      },
    );
    sections.forEach((section) => {
      observer.observe(section);
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = 0.35;
    return () => {
      audio.pause();
    };
  }, []);
  useEffect(() => {
    if (activePhoto === null) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeLightboxRef.current?.focus();
    const onKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        setActivePhoto(null);
      }
      if (keyboardEvent.key === "ArrowLeft") {
        setActivePhoto(
          (current) =>
            (current - 1 + galleryPhotos.length) %
            galleryPhotos.length,
        );
      }
      if (keyboardEvent.key === "ArrowRight") {
        setActivePhoto(
          (current) => (current + 1) % galleryPhotos.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activePhoto, galleryPhotos]);
  function movePhoto(direction) {
    setActivePhoto(
      (current) =>
        (current + direction + galleryPhotos.length) %
        galleryPhotos.length,
    );
  }
  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      setMusicError(false);
      await audio.play();
    } catch {
      setMusicError(true);
      setMusicOn(false);
    }
  }
  return (
    <main>
          <style>{`
      .lightbox .lightbox-arrow, .lightbox .lightbox-close {
        display: grid; place-items: center; width: 44px; height: 44px;
        padding: 0; border: 1px solid rgba(255,255,255,.35); border-radius: 50%;
        background: rgba(255,255,255,.92); color: #775665;
        box-shadow: 0 4px 18px rgba(0,0,0,.16); cursor: pointer;
      }
      .lightbox .lightbox-prev { left: 10px; }
      .lightbox .lightbox-next { right: 10px; }
      .top-button { display: grid; place-items: center; padding: 0; border-radius: 50%; }
      .map-button { display: flex; align-items: center; justify-content: center; gap: 8px; }
      .gallery-open:focus-visible, .lightbox button:focus-visible, .top-button:focus-visible { outline: 3px solid #d78aa8; outline-offset: 3px; }
      .gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
      .gallery-grid .gallery-item { margin: 0; grid-column: auto; grid-row: auto; aspect-ratio: 1; overflow: hidden; }
      .gallery-grid .gallery-open { display: block; width: 100%; height: 100%; padding: 0; border: 0; position: relative; }
      .gallery-grid .gallery-open img { display: block; width: 100%; height: 100%; object-fit: cover; }
      .lightbox-panel > img { max-width: 100%; max-height: 80dvh; object-fit: contain; }
      .invitation-shell .reveal-section {
        opacity: 1 !important;
        transform: none !important;
      }
    `}</style>
      <audio
        ref={audioRef}
        src="/bgm.mp3"
        loop
        preload="metadata"
        onPlay={() => {
          setMusicOn(true);
          setMusicError(false);
        }}
        onPause={() => setMusicOn(false)}
        onError={() => {
          setMusicOn(false);
          setMusicError(true);
        }}
      />
      <div className="petal-layer" aria-hidden="true">
        {petals.map((petal, index) => (
          <span
            className={`petal petal-${(index % 3) + 1}`}
            key={index}
            style={{
              "--petal-left": petal.left,
              "--petal-delay": petal.delay,
              "--petal-duration": petal.duration,
              "--petal-size": petal.size,
            }}
          >
            ❀
          </span>
        ))}
      </div>
      <article className="invitation-shell">
        <section className="hero reveal-section is-visible">
          <div className="hero-topline">
            <span>NO. 1101</span>
          </div>
          <p className="eyebrow">세아의 첫번째 생일</p>
          <div className="hero-photo">
            <img
              src="/12.jpeg"
              alt="한복을 입고 웃고 있는 아기의 돌사진"
            />
          </div>
          <h1>{event.childName}</h1>
          <p className="hero-copy">
            세아의 첫 돌잔치, 함께 축하해 주세요.
          </p>
          <div className="hero-event">
            <strong>{event.date}</strong>
            <span>{event.venue}</span>
          </div>
          <div className="parents">
            <span>아빠 {event.father}</span>
            <span>엄마 {event.mother}</span>
          </div>
        </section>
        <section className="section intro reveal-section">
          <p className="section-kicker">INVITATION</p>
          <h2>소중한 분들을 초대합니다</h2>
          <p>
            소중한 세아의 첫 생일을 맞이하여
            <br />
            가족과 함께 기쁨을 나누고자 합니다.
            <br />
            귀한 걸음 하시어 따뜻한 축복을 전해 주세요.
          </p>
        </section>
        <section className="section schedule reveal-section">
          <p className="section-kicker">THE DAY</p>
          <h2>돌잔치 안내</h2>
          <div className="event-card">
            <div>
              <span>DATE</span>
              <strong>2026. 11. 01 SUN</strong>
            </div>
            <div>
              <span>TIME</span>
              <strong>5:00 PM</strong>
            </div>
            <div>
              <span>PLACE</span>
              <strong>{event.venue}</strong>
            </div>
          </div>
          <Calendar />
        </section>
        <section className="section gallery reveal-section">
          <p className="section-kicker">GALLERY</p>
          <h2>세아의 빛나는 순간</h2>
          {galleryPhotos.length === 0 && <p>사진을 준비 중입니다.</p>}
        <div className="gallery-grid">
            {galleryPhotos.map((photo, index) => (
              <figure
                className="gallery-item"
                key={index}
              >
                <button
                  className="gallery-open"
                  onClick={() => setActivePhoto(index)}
                  aria-label={`세아 돌사진 ${index + 1} 크게 보기`}
                >
                  <img
                    src={photo}
                  loading="lazy"
                  decoding="async"
                    alt={`세아 돌사진 ${index + 1}`}
                  />
                  <span
                    className="gallery-zoom"
                    aria-hidden="true"
                  >
                    <Icon name="zoom" />
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </section>
        <section className="section location reveal-section">
          <p className="section-kicker">LOCATION</p>
          <h2>오시는 길</h2>
          <p className="location-name">
            <strong>{event.venue}</strong>
            <span>{event.address}</span>
          </p>
          <KakaoMap address={event.address} venue={event.venue} />
       
         
        </section>
        {/* <section className="section thanks reveal-section">
          <p className="section-kicker">WITH THANKS</p>
          <h2>마음 전하실 곳</h2>
          <p>
            멀리서도 축하의 마음을 전하고 싶으신 분들을 위해
            <br />
            계좌번호를 안내드립니다.
          </p>
          <div className="accounts">
            {accounts.map((account) => (
              <Account
                account={account}
                key={account.label}
              />
            ))}
          </div>
        </section> */}
        <footer>
          <span className="footer-mark">신라스테이</span>
          <small>COPYRIGHT © 2026 THE </small>
        </footer>
      </article>
      {activePhoto !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`세아 돌사진 ${
            activePhoto + 1
          } 크게 보기`}
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="lightbox-panel"
            onClick={(clickEvent) =>
              clickEvent.stopPropagation()
            }
          >
            <button
              ref={closeLightboxRef}
              className="lightbox-close"
              onClick={() => setActivePhoto(null)}
              aria-label="사진 닫기"
            >
              <Icon name="close" />
            </button>
            <img
              src={galleryPhotos[activePhoto]}
              alt={`확대된 세아 돌사진 ${
                activePhoto + 1
              }`}
            />
            <button
              className="lightbox-arrow lightbox-prev"
              onClick={() => movePhoto(-1)}
              aria-label="이전 사진"
            >
              <Icon name="left" />
            </button>
            <button
              className="lightbox-arrow lightbox-next"
              onClick={() => movePhoto(1)}
              aria-label="다음 사진"
            >
              <Icon name="right" />
            </button>
            <p className="lightbox-count">
              <strong>{activePhoto + 1}</strong> /{" "}
              {galleryPhotos.length}
            </p>
          </div>
        </div>
      )}
      <button
        className={`music-button ${
          musicOn ? "is-playing" : ""
        }`}
        onClick={toggleMusic}
        aria-label={
          musicOn ? "배경 음악 끄기" : "배경 음악 켜기"
        }
        aria-pressed={musicOn}
      >
        <span className="music-icon" aria-hidden="true">
          ♪
        </span>
        <span className="music-label">
          {musicOn ? "음악 끄기" : "음악 켜기"}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {musicError
          ? "배경 음악 파일을 불러오지 못했습니다."
          : musicOn
            ? "배경 음악이 재생 중입니다."
            : "배경 음악이 꺼졌습니다."}
      </span>
      <button
        className={`top-button ${
          showTop ? "visible" : ""
        }`}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        aria-label="맨 위로 이동"
      >
        <Icon name="up" />
      </button>
    </main>
  );
}