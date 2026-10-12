// Material 스타일의 24px SVG 아이콘. 외부 폰트 다운로드가 필요 없습니다.
export default function Icon({ name, size = 24 }) {
  const paths = {
    left: "m14.5 6-6 6 6 6",
    right: "m9.5 6 6 6-6 6",
    up: "M12 19V5m-6 6 6-6 6 6",
    external: "M7 17 17 7M7 7h10v10",
    close: "m6 6 12 12M18 6 6 18",
    down: "m6 9 6 6 6-6",
    zoom: "M11 8v6m-3-3h6m2 5 4 4",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>{name === "zoom" && <circle cx="11" cy="11" r="7" />}<path d={paths[name] || paths.right} /></svg>;
}
