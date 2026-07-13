import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "방문인증 | 줄서",
  description: "QR과 GPS를 이용한 줄서 방문인증 관리",
};

export default function VisitVerificationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
