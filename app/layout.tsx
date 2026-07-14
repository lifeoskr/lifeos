import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life OS — 기억은 AI가, 실행은 내가",
  description: "통화와 대화에서 중요한 약속과 다음 행동을 연결하는 개인형 AI 운영체제",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
