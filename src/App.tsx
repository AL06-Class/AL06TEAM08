import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import julseoLogo from "./assets/julseo-logo.png";

type Platform = "blog" | "instagram" | "youtube";
type ViewMode =
  | "home"
  | "campaigns"
  | "pilot"
  | "advertising"
  | "owner"
  | "review"
  | "today";

type Campaign = {
  id: number;
  title: string;
  store: string;
  category: string;
  region: string;
  platform: Platform;
  reward: string;
  quietTime: string;
  reservation: string;
  verification: string;
  reviewPolicy: string;
  applicants: number;
  capacity: number;
  due: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
};

type OwnerForm = {
  storeName: string;
  ownerName: string;
  phone: string;
  region: string;
  category: string;
  reservation: string;
  quietTime: string;
  capacity: string;
  offer: string;
  goal: string;
  autoRegistration: boolean;
  preference: string;
};

type ReviewStatus = "waiting" | "reminded" | "published" | "completed";
type TodayStatus = "open" | "closing" | "scheduled";

type ReviewItem = {
  id: number;
  campaignId: number;
  reviewer: string;
  status: ReviewStatus;
  checkinAt: string;
  due: string;
  reminders: number;
  channel: Platform;
};

type TodayOpen = {
  campaignId: number;
  openAt: string;
  slots: number;
  status: TodayStatus;
};

const platformLabels: Record<Platform, string> = {
  blog: "Blog",
  instagram: "IG",
  youtube: "YT"
};

const viewHash: Record<ViewMode, string> = {
  home: "#home",
  campaigns: "#campaigns",
  pilot: "#pilot",
  advertising: "#advertising",
  owner: "#owner-registration",
  review: "#review-recovery",
  today: "#today-open"
};

const navItems: Array<{ label: string; view: ViewMode }> = [
  { label: "홈", view: "home" },
  { label: "캠페인", view: "campaigns" },
  { label: "예약슬롯", view: "owner" },
  { label: "방문인증", view: "owner" },
  { label: "후기회수", view: "review" },
  { label: "오늘오픈", view: "today" },
  { label: "파일럿", view: "pilot" },
  { label: "광고문의", view: "advertising" }
];

const heroBanners = [
  {
    badge: "오프라인 방문 특화",
    title: "한산한 시간대를 실제 방문 후기로 채우세요",
    description: "예약 슬롯에 맞춰 체험단을 모집하고 방문 인증 후 후기를 회수합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    badge: "자동 방문 인증",
    title: "QR·GPS 체크인으로 노쇼를 줄이는 체험단",
    description: "계약서보다 먼저, 시스템으로 실제 방문 여부를 확인합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    badge: "후기 회수",
    title: "체크인 후 후기 요청까지 자동으로",
    description: "방문이 확인된 체험단에게만 후기 링크와 리마인드를 발송합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  }
];

const highlights = [
  {
    step: "01",
    title: "예약 슬롯 등록",
    description: "한산 시간대, 모집 인원, 제공 내역을 한 번에 등록합니다."
  },
  {
    step: "02",
    title: "QR·GPS 체크인",
    description: "선정된 체험단이 매장 QR을 스캔하고 위치를 확인해 방문을 남깁니다."
  },
  {
    step: "03",
    title: "후기 자동 회수",
    description: "체크인 후에만 후기 요청과 리마인드가 발송되어 누락을 줄입니다."
  }
];

const campaigns: Campaign[] = [
  {
    id: 1,
    title: "성수 신상 브런치 카페 평일 오후 채우기",
    store: "오브서울",
    category: "카페",
    region: "서울 성동구",
    platform: "blog",
    reward: "2인 브런치 세트 8만원",
    quietTime: "평일 14:00~17:00",
    reservation: "네이버예약 연결",
    verification: "매장 QR + GPS 체크인",
    reviewPolicy: "체크인 2시간 후 후기 링크 발송, 24시간 뒤 리마인드",
    applicants: 128,
    capacity: 20,
    due: "3일 남음",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
    tags: ["한산시간", "방문형", "QR인증"],
    featured: true
  },
  {
    id: 2,
    title: "광주 신상 파스타 매장 디너 전 방문 인증",
    store: "그린테이블",
    category: "맛집",
    region: "광주 동명동",
    platform: "instagram",
    reward: "2인 식사권 7만원",
    quietTime: "평일 15:00~17:30",
    reservation: "예약 슬롯 수동 등록",
    verification: "매장 QR 체크인",
    reviewPolicy: "방문 당일 후기 가이드 발송, 다음날 오전 리마인드",
    applicants: 246,
    capacity: 18,
    due: "1일 남음",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    tags: ["광주파일럿", "인스타그램", "노쇼방지"]
  },
  {
    id: 3,
    title: "부천 실내 클라이밍 평일 낮 체험단",
    store: "무브클라임",
    category: "액티비티",
    region: "경기 부천",
    platform: "blog",
    reward: "체험권 2매 + 강습 1회",
    quietTime: "화·목 13:00~16:00",
    reservation: "시간대별 정원 관리",
    verification: "QR 체크인 + 운영자 확인",
    reviewPolicy: "체크인 후 사진 포함 후기 작성 요청",
    applicants: 94,
    capacity: 12,
    due: "4일 남음",
    imageUrl:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
    tags: ["부천파일럿", "액티비티", "방문인증"],
    featured: true
  },
  {
    id: 4,
    title: "성수 팝업 의류 스토어 주간 후기 확보",
    store: "스튜디오라인",
    category: "문화",
    region: "서울 성수",
    platform: "youtube",
    reward: "의류 굿즈 + 촬영 허가",
    quietTime: "팝업 주간 11:00~14:00",
    reservation: "팝업 방문 슬롯 등록",
    verification: "현장 QR 체크인",
    reviewPolicy: "숏폼 업로드 링크 제출 리마인드",
    applicants: 72,
    capacity: 15,
    due: "6일 남음",
    imageUrl:
      "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=900&q=80",
    tags: ["성수팝업", "유튜브", "팝업주간"]
  },
  {
    id: 5,
    title: "송파 디저트 카페 주말 오후 좌석 채우기",
    store: "라구르",
    category: "카페",
    region: "서울 송파",
    platform: "blog",
    reward: "디저트 세트 5만원",
    quietTime: "주말 16:00~18:00",
    reservation: "예약 가능 슬롯 노출",
    verification: "QR·GPS 체크인",
    reviewPolicy: "방문 다음날 리뷰 링크 미제출자 자동 리마인드",
    applicants: 188,
    capacity: 25,
    due: "2일 남음",
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    tags: ["카페", "후기회수", "예약슬롯"]
  },
  {
    id: 6,
    title: "독립서점 북토크 한산 회차 방문 리뷰",
    store: "페이지룸",
    category: "문화",
    region: "서울 마포",
    platform: "blog",
    reward: "도서 교환권 5만원",
    quietTime: "평일 19:00 북토크",
    reservation: "회차별 정원 연결",
    verification: "현장 QR 체크인",
    reviewPolicy: "행사 종료 후 1시간 뒤 후기 가이드 발송",
    applicants: 61,
    capacity: 10,
    due: "마감 임박",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    tags: ["문화", "방문형", "후기리마인드"]
  }
];

const categories = [
  {
    label: "오늘오픈",
    value: "전체",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "한산시간",
    value: "한산시간",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "맛집",
    value: "맛집",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "카페",
    value: "카페",
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "액티비티",
    value: "액티비티",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "문화",
    value: "문화",
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "성수팝업",
    value: "성수",
    imageUrl:
      "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "광주파일럿",
    value: "광주",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "부천파일럿",
    value: "부천",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&q=80"
  },
  {
    label: "운영가이드",
    value: "가이드",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=160&q=80"
  }
];

const pilotAreas = [
  {
    label: "성수팝업",
    title: "성수의 신규 팝업 매장 집중 파일럿",
    description: "팝업, 브런치, 카페 매장을 중심으로 평일 오후 한산 시간대 방문 후기를 확보합니다.",
    metric: "오픈 3개월 내 매장 우선",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    tags: ["서울 성동구", "카페", "팝업"]
  },
  {
    label: "광주파일럿",
    title: "광주 동명동·양림동 맛집 방문 인증",
    description: "신규 식당의 디너 전 빈 시간대를 체험단 방문과 QR 체크인으로 채웁니다.",
    metric: "방문 인증 우선",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80",
    tags: ["광주", "맛집", "노쇼방지"]
  },
  {
    label: "부천파일럿",
    title: "부천 액티비티·문화 공간 체험단 운영",
    description: "실내 운동, 문화 공간, 클래스형 매장의 회차별 예약 슬롯을 체험단과 연결합니다.",
    metric: "회차형 슬롯",
    imageUrl:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
    tags: ["경기 부천", "액티비티", "문화"]
  }
];

const adProducts = [
  {
    title: "홈 히어로 배너",
    description: "홈 상단 3개 핵심 배너 중 하나로 노출해 신규 매장 캠페인을 강하게 알립니다.",
    price: "파일럿 협의"
  },
  {
    title: "카테고리 추천 슬롯",
    description: "오늘오픈, 한산시간, 맛집, 카페 등 카테고리 진입 지점에서 우선 노출합니다.",
    price: "월 구독형"
  },
  {
    title: "지역 파일럿 패키지",
    description: "성수·광주·부천 파일럿 지역에서 캠페인 등록, 방문 인증, 후기 회수를 묶어 운영합니다.",
    price: "캠페인 단위"
  }
];

const ownerInitialForm: OwnerForm = {
  storeName: "",
  ownerName: "",
  phone: "",
  region: "",
  category: "맛집",
  reservation: "네이버예약",
  quietTime: "평일 14:00~17:00",
  capacity: "10",
  offer: "",
  goal: "한산 시간대 방문 후기 확보",
  autoRegistration: true,
  preference: "방문 후기 성실도가 높은 블로거"
};

const ownerProcessSteps = [
  { label: "사장님 의뢰", detail: "매장 정보와 원하는 방문 시간대를 입력합니다.", tone: "owner" },
  { label: "매장 등록", detail: "지역, 카테고리, 제공 내역을 캠페인 초안으로 정리합니다.", tone: "external" },
  { label: "시간대 분석", detail: "한산 시간대와 예약 슬롯 기준으로 모집 조건을 추천합니다.", tone: "automation" },
  { label: "자동 등록", detail: "자동 등록을 켜면 조건에 맞는 캠페인 문안을 생성합니다.", tone: "automation" },
  { label: "추천 수신", detail: "규칙 기반 매칭으로 체험단 후보를 추천받습니다.", tone: "automation" },
  { label: "최종 선택", detail: "사장님이 방문자를 직접 확정합니다.", tone: "owner" },
  { label: "체크인 확인", detail: "QR·GPS로 실제 방문을 확인합니다.", tone: "external" },
  { label: "체험 완료", detail: "리마인드 발송 후 신뢰 후기를 회수합니다.", tone: "complete" }
] as const;

const reviewInitialItems: ReviewItem[] = [
  { id: 1, campaignId: 1, reviewer: "성수기록", status: "waiting", checkinAt: "07.13 14:22", due: "07.15 18:00", reminders: 0, channel: "blog" },
  { id: 2, campaignId: 1, reviewer: "오늘의테이블", status: "reminded", checkinAt: "07.12 15:08", due: "오늘 20:00", reminders: 1, channel: "instagram" },
  { id: 3, campaignId: 2, reviewer: "동명동산책", status: "published", checkinAt: "07.11 16:11", due: "07.13 18:00", reminders: 1, channel: "instagram" },
  { id: 4, campaignId: 3, reviewer: "주말클라이머", status: "completed", checkinAt: "07.10 13:46", due: "07.12 18:00", reminders: 0, channel: "blog" },
  { id: 5, campaignId: 5, reviewer: "디저트로그", status: "reminded", checkinAt: "07.12 16:34", due: "오늘 18:00", reminders: 2, channel: "blog" }
];

const reviewStatusLabels: Record<ReviewStatus, string> = {
  waiting: "후기 대기",
  reminded: "리마인드 발송",
  published: "발행 확인",
  completed: "회수 완료"
};

const todayOpenItems: TodayOpen[] = [
  { campaignId: 1, openAt: "09:00", slots: 4, status: "open" },
  { campaignId: 2, openAt: "10:30", slots: 2, status: "closing" },
  { campaignId: 3, openAt: "12:00", slots: 7, status: "open" },
  { campaignId: 4, openAt: "14:00", slots: 10, status: "scheduled" },
  { campaignId: 5, openAt: "15:30", slots: 3, status: "scheduled" },
  { campaignId: 6, openAt: "17:00", slots: 6, status: "scheduled" }
];

const todayStatusLabels: Record<TodayStatus, string> = {
  open: "지금 신청",
  closing: "마감 임박",
  scheduled: "오픈 예정"
};

const filters = ["전체", "한산시간", "맛집", "카페", "액티비티", "문화"];

function getViewFromHash(): ViewMode {
  if (typeof window === "undefined") return "home";
  const found = Object.entries(viewHash).find(([, hash]) => hash === window.location.hash);
  return found ? (found[0] as ViewMode) : "home";
}

function getCampaignById(id: number) {
  return campaigns.find((campaign) => campaign.id === id) ?? campaigns[0];
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(getViewFromHash);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [ownerForm, setOwnerForm] = useState(ownerInitialForm);
  const [ownerSubmitted, setOwnerSubmitted] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [reviewItems, setReviewItems] = useState(reviewInitialItems);
  const [reviewFilter, setReviewFilter] = useState<"전체" | ReviewStatus>("전체");
  const [todayFilter, setTodayFilter] = useState("전체");
  const [appliedTodayIds, setAppliedTodayIds] = useState<number[]>([]);

  useEffect(() => {
    const syncHash = () => setCurrentView(getViewFromHash());
    window.addEventListener("hashchange", syncHash);
    syncHash();
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const selectedCampaign = getCampaignById(selectedCampaignId);

  const visibleCampaigns = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesFilter =
        selectedFilter === "전체" ||
        campaign.category === selectedFilter ||
        campaign.region.includes(selectedFilter) ||
        campaign.tags.some((tag) => tag.includes(selectedFilter));
      const matchesQuery =
        keyword.length === 0 ||
        [campaign.title, campaign.store, campaign.category, campaign.region, campaign.quietTime]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesFilter && matchesQuery;
    });
  }, [query, selectedFilter]);

  const filteredReviews = useMemo(
    () =>
      reviewFilter === "전체"
        ? reviewItems
        : reviewItems.filter((item) => item.status === reviewFilter),
    [reviewFilter, reviewItems]
  );

  const todayCampaigns = useMemo(
    () =>
      todayOpenItems
        .map((item) => ({ ...item, campaign: getCampaignById(item.campaignId) }))
        .filter(({ campaign, status }) => {
          if (todayFilter === "전체") return true;
          if (todayFilter === "지금 신청") return status === "open";
          return campaign.category === todayFilter || campaign.region.includes(todayFilter);
        }),
    [todayFilter]
  );

  const navigateTo = (view: ViewMode) => {
    window.location.hash = viewHash[view];
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const handleCategorySelect = (label: string, value: string) => {
    if (label === "오늘오픈") {
      navigateTo("today");
      return;
    }
    if (label.includes("파일럿")) {
      navigateTo("pilot");
      return;
    }
    setSelectedFilter(value);
    navigateTo("campaigns");
  };

  const handleApply = () => {
    setApplicationMessage(`${selectedCampaign.store} 캠페인 신청이 임시 접수되었습니다.`);
  };

  const handleOwnerInputChange = (key: keyof OwnerForm, value: string | boolean) => {
    setOwnerForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleOwnerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOwnerSubmitted(true);
  };

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInquirySubmitted(true);
  };

  const advanceReview = (id: number) => {
    setReviewItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "waiting") return { ...item, status: "reminded", reminders: item.reminders + 1 };
        if (item.status === "reminded") return { ...item, status: "published" };
        if (item.status === "published") return { ...item, status: "completed" };
        return item;
      })
    );
  };

  const renderHeader = () => (
    <>
      <div className="notice-bar">
        <span>공지사항</span>
        <strong>제품 기획 워크시트 기준으로 QR 방문 인증 MVP가 반영되었습니다.</strong>
      </div>
      <header className="site-header">
        <div className="header-main">
          <button
            className="menu-button"
            type="button"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            메뉴
          </button>
          <button className="logo-button" type="button" onClick={() => navigateTo("home")}>
            <img className="logo-image" src={julseoLogo} alt="줄서" />
          </button>
          <label className="search-box">
            <span>검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="매장, 지역, 한산 시간대"
            />
          </label>
          <nav className="utility-nav" aria-label="사용자 메뉴">
            <a href="#login">로그인</a>
            <a href="#join">회원가입</a>
            <button type="button" onClick={() => navigateTo("advertising")}>
              광고문의
            </button>
          </nav>
        </div>
        <nav className={`primary-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="주요 메뉴">
          {navItems.map((item) => (
            <button
              className={currentView === item.view ? "is-active" : ""}
              key={item.label}
              type="button"
              onClick={() => navigateTo(item.view)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
    </>
  );

  const renderCampaigns = (compact = false) => (
    <section className="workbench" id="campaigns" aria-label="캠페인 목록과 상세">
      <div className="campaign-section">
        <div className="section-heading">
          <div>
            <p>오프라인 방문 인증 캠페인</p>
            <h2>한산 시간대를 채울 체험단 슬롯</h2>
          </div>
          <span>{visibleCampaigns.length}개 캠페인</span>
        </div>

        <div className="filter-row" aria-label="캠페인 필터">
          {filters.map((filter) => (
            <button
              className={selectedFilter === filter ? "is-active" : ""}
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="campaign-grid">
          {visibleCampaigns.map((campaign) => (
            <button
              className={`campaign-card ${selectedCampaign.id === campaign.id ? "is-current" : ""}`}
              key={campaign.id}
              type="button"
              onClick={() => {
                setSelectedCampaignId(campaign.id);
                setApplicationMessage("");
              }}
            >
              <span className="media-wrap">
                <img src={campaign.imageUrl} alt={`${campaign.title} 이미지`} />
                <b>{platformLabels[campaign.platform]}</b>
              </span>
              <span className="campaign-content">
                <strong>{campaign.title}</strong>
                <span>
                  {campaign.store} · {campaign.region}
                </span>
                <span>{campaign.quietTime}</span>
                <span className="campaign-meta">
                  <em>{campaign.due}</em>
                  신청 {campaign.applicants.toLocaleString()} / {campaign.capacity}명
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <aside className="detail-panel" aria-label="선택한 캠페인 상세">
        <div className="detail-image">
          <img src={selectedCampaign.imageUrl} alt={`${selectedCampaign.title} 대표 이미지`} />
          <span>{selectedCampaign.category}</span>
        </div>
        <div className="detail-body">
          <p>{selectedCampaign.store}</p>
          <h2>{selectedCampaign.title}</h2>
          <dl>
            <div>
              <dt>한산 시간</dt>
              <dd>{selectedCampaign.quietTime}</dd>
            </div>
            <div>
              <dt>예약 상태</dt>
              <dd>{selectedCampaign.reservation}</dd>
            </div>
            <div>
              <dt>방문 인증</dt>
              <dd>{selectedCampaign.verification}</dd>
            </div>
            <div>
              <dt>후기 회수</dt>
              <dd>{selectedCampaign.reviewPolicy}</dd>
            </div>
            <div>
              <dt>제공 내역</dt>
              <dd>{selectedCampaign.reward}</dd>
            </div>
          </dl>
          <div className="tag-list">
            {selectedCampaign.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <button className="primary-action" type="button" onClick={handleApply}>
            캠페인 신청하기
          </button>
          <button className="secondary-action" type="button" onClick={() => navigateTo("owner")}>
            매장 캠페인 등록 문의
          </button>
          {applicationMessage ? <p className="application-message">{applicationMessage}</p> : null}
        </div>
      </aside>
      {compact ? null : <div className="section-spacer" />}
    </section>
  );

  const renderHome = () => (
    <main className="app">
      {renderHeader()}
      <section className="hero-grid" id="home" aria-label="추천 캠페인">
        {heroBanners.map((banner) => (
          <article
            className="hero-card"
            key={banner.title}
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            <span>{banner.badge}</span>
            <h1>{banner.title}</h1>
            <p>{banner.description}</p>
          </article>
        ))}
      </section>

      <section className="mvp-summary" aria-label="MVP 핵심 기능">
        {highlights.map((item) => (
          <article key={item.step}>
            <span>{item.step}</span>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="category-strip" aria-label="빠른 카테고리">
        {categories.map((category) => (
          <button
            className={selectedFilter === category.value ? "is-selected" : ""}
            key={category.label}
            type="button"
            onClick={() => handleCategorySelect(category.label, category.value)}
          >
            <img src={category.imageUrl} alt="" />
            <span>{category.label}</span>
          </button>
        ))}
      </section>

      {renderCampaigns(true)}
      {renderPilotSection()}
      {renderAdvertisingSection()}
      {renderFloatingContact()}
    </main>
  );

  const renderPilotSection = () => (
    <section className="pilot-section" id="pilot" aria-label="파일럿 운영 지역">
      <div className="section-heading">
        <div>
          <p>지역 파일럿</p>
          <h2>성수·광주·부천에서 먼저 검증하는 방문 인증 체험단</h2>
        </div>
        <span>3개 지역 운영</span>
      </div>
      <div className="pilot-grid">
        {pilotAreas.map((pilot) => (
          <article className="pilot-card" key={pilot.label}>
            <img src={pilot.imageUrl} alt={`${pilot.label} 대표 이미지`} />
            <div className="pilot-content">
              <span>{pilot.label}</span>
              <h3>{pilot.title}</h3>
              <p>{pilot.description}</p>
              <strong>{pilot.metric}</strong>
              <div className="tag-list">
                {pilot.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderAdvertisingSection = () => (
    <section className="advertising-section" id="advertising" aria-label="광고 문의">
      <div className="advertising-copy">
        <p>광고문의</p>
        <h2>한산 시간대 방문과 실제 후기를 연결하는 광고 상품</h2>
        <span>
          줄서는 단순 노출 광고가 아니라 캠페인 등록, 예약 슬롯, QR·GPS 체크인,
          후기 회수까지 연결되는 방문 성과형 광고를 지향합니다.
        </span>
        <div className="ad-product-list">
          {adProducts.map((product) => (
            <article key={product.title}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <strong>{product.price}</strong>
            </article>
          ))}
        </div>
      </div>

      <form className="ad-inquiry-form" onSubmit={handleInquirySubmit}>
        <h3>광고·파일럿 문의하기</h3>
        <label className="form-field">
          <span>매장명</span>
          <input required type="text" placeholder="예: 오브서울 성수점" />
        </label>
        <label className="form-field">
          <span>담당자 연락처</span>
          <input required type="tel" placeholder="010-0000-0000" />
        </label>
        <label className="form-field">
          <span>관심 상품</span>
          <select defaultValue="지역 파일럿 패키지">
            {adProducts.map((product) => (
              <option key={product.title} value={product.title}>
                {product.title}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>문의 내용</span>
          <textarea required placeholder="예: 성수 신규 팝업 매장이라 평일 오후 방문 후기를 확보하고 싶어요." />
        </label>
        <button className="primary-action" type="submit">
          광고 문의 보내기
        </button>
        {inquirySubmitted ? (
          <p className="application-message">광고 문의가 임시 접수되었습니다. 실제 연동 전까지는 화면 확인용 메시지입니다.</p>
        ) : null}
      </form>
    </section>
  );

  const renderOwnerRegistration = () => (
    <main className="owner-page">
      {renderHeader()}
      <section className="owner-workspace" aria-label="사장님 캠페인 등록">
        <form className="owner-form" onSubmit={handleOwnerSubmit}>
          <div className="owner-form-heading">
            <p>01 사장님 의뢰</p>
            <h1>매장과 모집 조건을 입력하세요</h1>
            <span>제출 후에는 시간대 분석, 자동 등록, AI 매칭 후보 추천 순서로 이어집니다.</span>
          </div>

          <fieldset className="form-section">
            <legend>매장 등록</legend>
            <div className="field-grid">
              <label className="form-field">
                <span>매장명</span>
                <input required value={ownerForm.storeName} onChange={(event) => handleOwnerInputChange("storeName", event.target.value)} placeholder="예: 오브서울 성수점" />
              </label>
              <label className="form-field">
                <span>사장님 성함</span>
                <input required value={ownerForm.ownerName} onChange={(event) => handleOwnerInputChange("ownerName", event.target.value)} placeholder="예: 김줄서" />
              </label>
              <label className="form-field">
                <span>연락처</span>
                <input required value={ownerForm.phone} onChange={(event) => handleOwnerInputChange("phone", event.target.value)} placeholder="010-0000-0000" />
              </label>
              <label className="form-field">
                <span>지역</span>
                <input required value={ownerForm.region} onChange={(event) => handleOwnerInputChange("region", event.target.value)} placeholder="예: 서울 성동구" />
              </label>
              <label className="form-field">
                <span>카테고리</span>
                <select value={ownerForm.category} onChange={(event) => handleOwnerInputChange("category", event.target.value)}>
                  {["맛집", "카페", "액티비티", "문화"].map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>예약 연동</span>
                <select value={ownerForm.reservation} onChange={(event) => handleOwnerInputChange("reservation", event.target.value)}>
                  {["네이버예약", "캐치테이블", "수동 슬롯", "추후 연동"].map((reservation) => (
                    <option key={reservation} value={reservation}>{reservation}</option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>캠페인 알림과 자동 등록</legend>
            <div className="field-grid">
              <label className="form-field">
                <span>한산 시간대</span>
                <input required value={ownerForm.quietTime} onChange={(event) => handleOwnerInputChange("quietTime", event.target.value)} placeholder="예: 평일 14:00~17:00" />
              </label>
              <label className="form-field">
                <span>모집 인원</span>
                <input required min="1" type="number" value={ownerForm.capacity} onChange={(event) => handleOwnerInputChange("capacity", event.target.value)} />
              </label>
              <label className="form-field field-wide">
                <span>제공 내역</span>
                <input required value={ownerForm.offer} onChange={(event) => handleOwnerInputChange("offer", event.target.value)} placeholder="예: 2인 식사권 7만원 / 음료 2잔 + 디저트" />
              </label>
              <label className="form-field field-wide">
                <span>캠페인 목표</span>
                <textarea required value={ownerForm.goal} onChange={(event) => handleOwnerInputChange("goal", event.target.value)} />
              </label>
            </div>
            <label className="toggle-field">
              <input type="checkbox" checked={ownerForm.autoRegistration} onChange={(event) => handleOwnerInputChange("autoRegistration", event.target.checked)} />
              <span>
                <strong>시간대 분석 후 자동 등록 사용</strong>
                <small>조건을 기준으로 캠페인 문안과 슬롯을 자동으로 구성합니다.</small>
              </span>
            </label>
          </fieldset>

          <fieldset className="form-section">
            <legend>AI 매칭과 노쇼 방지</legend>
            <label className="form-field field-wide">
              <span>선호 체험단 기준</span>
              <textarea value={ownerForm.preference} onChange={(event) => handleOwnerInputChange("preference", event.target.value)} />
            </label>
            <div className="verification-strip">
              <span>추천 수신</span>
              <span>최종 선택</span>
              <span>QR·GPS 체크인</span>
              <span>리마인드 발송</span>
              <span>신뢰 후기</span>
            </div>
          </fieldset>

          <button className="primary-action owner-submit" type="submit">
            체험단 모집 등록하기
          </button>
          {ownerSubmitted ? (
            <div className="registration-result">
              <strong>{ownerForm.storeName || "신규 매장"} 캠페인 등록 초안이 생성되었습니다.</strong>
              <p>다음 단계는 시간대 분석, 자동 등록, 추천 수신, 최종 선택, 체크인 확인입니다.</p>
            </div>
          ) : null}
        </form>

        <aside className="owner-process" aria-label="실제 체험단 프로세스">
          <div className="process-heading">
            <p>실제 체험단 프로세스</p>
            <h2>체험단 매칭 플랫폼 대시보드</h2>
            <span>사장님이 등록 중인 단계가 전체 흐름 중 어디인지 보여줍니다.</span>
          </div>
          <div className="process-lane">
            {ownerProcessSteps.map((step, index) => (
              <article className={`process-step is-${step.tone}`} key={step.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="process-legend">
            <span className="legend-automation">자동화 필요</span>
            <span className="legend-owner">사장님 결정</span>
            <span className="legend-external">외부 연동</span>
            <span className="legend-complete">완료</span>
          </div>
        </aside>
      </section>
    </main>
  );

  const renderReviewRecovery = () => {
    const completed = reviewItems.filter((item) => item.status === "completed").length;
    const pending = reviewItems.filter((item) => item.status !== "completed").length;
    const reminded = reviewItems.reduce((total, item) => total + item.reminders, 0);

    return (
      <main className="review-page">
        {renderHeader()}
        <section className="dashboard-shell">
          <div className="dashboard-intro">
            <div>
              <p>후기회수 대시보드</p>
              <h1>체크인 이후 후기 요청, 리마인드, 발행 확인을 한 화면에서 관리합니다.</h1>
              <span>방문 인증이 완료된 체험단만 후기 회수 큐에 들어옵니다.</span>
            </div>
            <div className="review-flow">
              <span className="is-done">체크인완료</span>
              <span className="is-done">후기요청</span>
              <span>리마인드</span>
              <span>회수완료</span>
            </div>
          </div>
          <div className="metric-grid">
            <article><span>회수 완료</span><strong>{completed}</strong><small>신뢰 후기 확보</small></article>
            <article><span>진행 중</span><strong>{pending}</strong><small>대기 또는 확인 필요</small></article>
            <article><span>리마인드</span><strong>{reminded}</strong><small>자동 발송 누적</small></article>
            <article className="is-success"><span>노쇼 제외</span><strong>100%</strong><small>체크인 기반 큐</small></article>
          </div>
          <section className="review-queue">
            <div className="queue-heading">
              <div>
                <p>후기 회수 큐</p>
                <h2>체크인 완료 체험단</h2>
              </div>
              <span>{filteredReviews.length}건 표시</span>
            </div>
            <div className="filter-row">
              {(["전체", "waiting", "reminded", "published", "completed"] as Array<"전체" | ReviewStatus>).map((filter) => (
                <button className={reviewFilter === filter ? "is-active" : ""} key={filter} type="button" onClick={() => setReviewFilter(filter)}>
                  {filter === "전체" ? "전체" : reviewStatusLabels[filter]}
                </button>
              ))}
            </div>
            <div className="table-wrap">
              <table className="review-table">
                <thead>
                  <tr>
                    <th>체험단</th>
                    <th>캠페인</th>
                    <th>체크인</th>
                    <th>후기 마감</th>
                    <th>상태</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((item) => {
                    const campaign = getCampaignById(item.campaignId);
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="reviewer-cell">
                            <span>{platformLabels[item.channel]}</span>
                            <div>
                              <strong>{item.reviewer}</strong>
                              <small>{item.reminders}회 리마인드</small>
                            </div>
                          </div>
                        </td>
                        <td>{campaign.title}</td>
                        <td>{item.checkinAt}</td>
                        <td>{item.due}</td>
                        <td><span className={`review-status is-${item.status}`}>{reviewStatusLabels[item.status]}</span></td>
                        <td>
                          {item.status === "completed" ? (
                            <span className="done-label">완료</span>
                          ) : (
                            <button className="table-action" type="button" onClick={() => advanceReview(item.id)}>
                              다음 단계
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    );
  };

  const renderTodayOpen = () => {
    const spotlight = todayCampaigns[0] ?? { ...todayOpenItems[0], campaign: campaigns[0] };

    return (
      <main className="today-page">
        {renderHeader()}
        <section className="dashboard-shell">
          <div className="dashboard-intro">
            <div>
              <p>오늘오픈</p>
              <h1>오늘 열리는 체험단 슬롯을 시간대별로 확인하고 바로 신청합니다.</h1>
              <span>오픈 상태, 남은 슬롯, 방문 인증 방식을 한 번에 비교할 수 있습니다.</span>
            </div>
            <div className="today-summary">
              <div><span>오늘 슬롯</span><strong>{todayOpenItems.length}</strong></div>
              <div><span>신청 가능</span><strong>{todayOpenItems.filter((item) => item.status !== "scheduled").length}</strong></div>
              <div><span>남은 자리</span><strong>{todayOpenItems.reduce((sum, item) => sum + item.slots, 0)}</strong></div>
            </div>
          </div>

          <article className="today-spotlight">
            <div className="today-spotlight-media">
              <img src={spotlight.campaign.imageUrl} alt={`${spotlight.campaign.title} 대표 이미지`} />
              <span>{todayStatusLabels[spotlight.status]}</span>
            </div>
            <div className="today-spotlight-copy">
              <p>{spotlight.campaign.store}</p>
              <h2>{spotlight.campaign.title}</h2>
              <span>{spotlight.campaign.region} · {spotlight.campaign.category}</span>
              <dl>
                <div><dt>오픈</dt><dd>{spotlight.openAt}</dd></div>
                <div><dt>남은 슬롯</dt><dd>{spotlight.slots}명</dd></div>
                <div><dt>방문 인증</dt><dd>{spotlight.campaign.verification}</dd></div>
                <div><dt>제공 내역</dt><dd>{spotlight.campaign.reward}</dd></div>
              </dl>
              <button
                className="primary-action"
                type="button"
                disabled={appliedTodayIds.includes(spotlight.campaignId)}
                onClick={() => setAppliedTodayIds((ids) => [...ids, spotlight.campaignId])}
              >
                {appliedTodayIds.includes(spotlight.campaignId) ? "신청 완료" : "오늘 슬롯 신청하기"}
              </button>
            </div>
          </article>

          <section className="today-list">
            <div className="queue-heading">
              <div>
                <p>시간대별 오픈</p>
                <h2>오늘 가능한 캠페인</h2>
              </div>
              <span>{todayCampaigns.length}개 표시</span>
            </div>
            <div className="filter-row">
              {["전체", "지금 신청", "카페", "맛집", "액티비티", "문화"].map((filter) => (
                <button className={todayFilter === filter ? "is-active" : ""} key={filter} type="button" onClick={() => setTodayFilter(filter)}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="today-campaign-grid">
              {todayCampaigns.map(({ campaign, openAt, slots, status }) => (
                <article className="today-campaign-card" key={`${campaign.id}-${openAt}`}>
                  <div className="today-card-media">
                    <img src={campaign.imageUrl} alt={`${campaign.title} 이미지`} />
                    <span className={`today-status is-${status}`}>{todayStatusLabels[status]}</span>
                    <strong>{openAt}</strong>
                  </div>
                  <div className="today-card-body">
                    <p>{campaign.store}</p>
                    <h3>{campaign.title}</h3>
                    <div className="today-card-facts">
                      <span><b>지역</b>{campaign.region}</span>
                      <span><b>인증</b>{campaign.verification}</span>
                      <span><b>후기</b>{campaign.reviewPolicy}</span>
                    </div>
                    <div className="today-card-footer">
                      <span><strong>{slots}</strong>자리</span>
                      <button
                        type="button"
                        disabled={appliedTodayIds.includes(campaign.id) || status === "scheduled"}
                        onClick={() => setAppliedTodayIds((ids) => [...ids, campaign.id])}
                      >
                        {appliedTodayIds.includes(campaign.id) ? "완료" : status === "scheduled" ? "예정" : "신청"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    );
  };

  const renderFloatingContact = () => (
    <button
      className="floating-contact"
      type="button"
      aria-label="사장님 체험단 모집 등록하기"
      onClick={() => navigateTo("owner")}
    >
      <span className="floating-contact-icon" aria-hidden="true">
        <img src={julseoLogo} alt="" />
      </span>
      <span className="floating-contact-copy">
        <strong>사장님이신가요?</strong>
        <span>한산 시간대 예약 슬롯과 QR 체크인 캠페인을 직접 등록해보세요.</span>
        <em>모집 등록하기</em>
      </span>
    </button>
  );

  if (currentView === "owner") return renderOwnerRegistration();
  if (currentView === "review") return renderReviewRecovery();
  if (currentView === "today") return renderTodayOpen();

  return (
    <main className="app">
      {renderHeader()}
      {currentView === "home" ? (
        <>
          {renderHome().props.children.slice(1)}
        </>
      ) : currentView === "campaigns" ? (
        renderCampaigns()
      ) : currentView === "pilot" ? (
        renderPilotSection()
      ) : (
        renderAdvertisingSection()
      )}
      {renderFloatingContact()}
    </main>
  );
}
