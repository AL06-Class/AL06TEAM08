import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "예약슬롯 | 줄서",
  description: "줄서 한산 시간대 예약슬롯 관리",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
