import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자동 체크인 | 줄서",
  description: "줄서팀 GPS 자동 체크인 MVP",
};

export default function AutoCheckinLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
