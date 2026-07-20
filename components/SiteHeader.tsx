"use client";

import { Bell, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SiteHeaderProps = {
  active: "예약슬롯" | "방문인증" | "자동체크인";
  notice: string;
};

const navItems = [
  { label: "홈", href: "#" },
  { label: "캠페인", href: "#" },
  { label: "예약슬롯", href: "/" },
  { label: "방문인증", href: "/visit-verification" },
  { label: "자동체크인", href: "/auto-checkin" },
  { label: "후기회수", href: "#" },
  { label: "오늘오픈", href: "#" },
  { label: "파일럿", href: "#" },
  { label: "광고문의", href: "#" },
] as const;

export function SiteHeader({ active, notice }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="notice">공지사항&nbsp;&nbsp; {notice}</div>
      <header className="siteHeader">
        <div className="headerMain pageWidth">
          <Link className="logo" href="/" aria-label="줄서 홈">
            <span>줄서</span>
            <span className="logoMark"><i /><i /></span>
          </Link>
          <div className="searchBox">
            <Search size={17} aria-hidden="true" />
            <input aria-label="검색" placeholder="매장, 지역, 한산 시간대" />
          </div>
          <div className="headerActions">
            <button className="iconButton" aria-label="알림"><Bell size={19} /></button>
            <button className="textButton">로그인</button>
            <button className="textButton">회원가입</button>
            <button className="inquiryButton">광고문의</button>
          </div>
          <button className="mobileMenuButton" aria-label="메뉴" onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav className={mobileMenuOpen ? "mainNav mobileOpen" : "mainNav"} aria-label="주요 메뉴">
          <div className="pageWidth navInner">
            {navItems.map((item) => (
              <Link key={item.label} className={item.label === active ? "active" : ""} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
