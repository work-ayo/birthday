import "./globals.css";

export const metadata = {
  title: "세아의 첫 번째 생일",
  description: "소중한 첫돌을 함께 축하해 주세요.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
