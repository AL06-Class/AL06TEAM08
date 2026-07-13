import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import julseoLogo from "./assets/julseo-logo.png";

type Campaign = {
  id: number;
  title: string;
  brandName: string;
  category: string;
  region: string;
  platform: "blog" | "instagram" | "youtube";
  reward: string;
  dueDate: string;
  applicantCount: number;
  recruitmentCount: number;
  quietTimeSlot: string;
  reservationStatus: string;
  verificationMethod: string;
  reviewReminderPolicy: string;
  pricingHypothesis: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
};

type Category = {
  label: string;
  value: string;
  imageUrl: string;
};

type ViewMode = "home" | "ownerRegistration" | "reviewRecovery" | "todayOpen";

type OwnerCampaignForm = {
  storeName: string;
  ownerName: string;
  phone: string;
  category: string;
  region: string;
  quietTimeSlot: string;
  offer: string;
  recruitmentCount: string;
  reservationProvider: string;
  campaignGoal: string;
  matchingPreference: string;
  autoRegistrationEnabled: boolean;
};

type ReviewRecoveryStatus = "checkedIn" | "reminded" | "published" | "completed";

type ReviewRecoveryItem = {
  id: number;
  campaignId: number;
  reviewerName: string;
  platform: Campaign["platform"];
  status: ReviewRecoveryStatus;
  checkInAt: string;
  reviewDueDate: string;
  reminderCount: number;
  lastReminderAt: string;
  source: string;
};

type TodayOpenStatus = "open" | "closingSoon" | "scheduled";

type TodayOpenItem = {
  campaignId: number;
  openAt: string;
  remainingSlots: number;
  openStatus: TodayOpenStatus;
};

const heroBanners = [
  {
    title: "한산한 시간대를 실제 방문 후기로 채우세요",
    description: "예약 슬롯에 맞춰 체험단을 모집하고 방문 인증 후 후기를 회수합니다.",
    label: "오프라인 방문 특화",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "QR·GPS 체크인으로 노쇼를 줄이는 체험단",
    description: "계약서 패널티보다 먼저, 시스템으로 실제 방문 여부를 확인합니다.",
    label: "자동 방문 인증",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "체크인 후 후기 요청까지 자동으로",
    description: "방문이 확인된 체험단에게만 후기 링크와 리마인드를 발송합니다.",
    label: "후기 회수",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
  }
];

const mvpHighlights = [
  {
    step: "01",
    title: "예약 슬롯 등록",
    description: "평일 14~17시처럼 비는 시간대, 모집 인원, 제공 내역을 한 번에 등록합니다."
  },
  {
    step: "02",
    title: "QR·GPS 체크인",
    description: "선정된 체험단이 매장 QR을 스캔하고 위치를 확인해 실제 방문을 남깁니다."
  },
  {
    step: "03",
    title: "후기 자동 회수",
    description: "체크인 후에만 후기 요청과 리마인드가 발송되어 후기 누락을 줄입니다."
  }
];

const categories: Category[] = [
  {
    label: "오늘오픈",
    value: "전체",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "한산시간",
    value: "한산시간",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "맛집",
    value: "맛집",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "카페",
    value: "카페",
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "액티비티",
    value: "액티비티",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "문화",
    value: "문화",
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "성수팝업",
    value: "팝업",
    imageUrl:
      "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "광주파일럿",
    value: "광주",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "부천파일럿",
    value: "부천",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "운영가이드",
    value: "운영",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=120&q=80"
  }
];

const campaigns: Campaign[] = [
  {
    id: 1,
    title: "성수 신상 브런치 카페 평일 오후 채우기",
    brandName: "오브서울",
    category: "카페",
    region: "서울 성동",
    platform: "blog",
    reward: "2인 브런치 세트 8만원",
    dueDate: "3일 남음",
    applicantCount: 128,
    recruitmentCount: 20,
    quietTimeSlot: "평일 14:00~17:00",
    reservationStatus: "네이버예약 연결됨",
    verificationMethod: "매장 QR + GPS 체크인",
    reviewReminderPolicy: "체크인 2시간 후 후기 링크 발송, 24시간 후 리마인드",
    pricingHypothesis: "방문 1건당 7천원 매칭 수수료",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=520&q=80",
    tags: ["한산 시간대", "방문형", "QR 인증"],
    featured: true
  },
  {
    id: 2,
    title: "광주 신상 파스타 매장 디너 전 방문 인증단",
    brandName: "그린테이블",
    category: "맛집",
    region: "광주 동명동",
    platform: "instagram",
    reward: "2인 식사권 7만원",
    dueDate: "1일 남음",
    applicantCount: 246,
    recruitmentCount: 18,
    quietTimeSlot: "평일 15:00~17:30",
    reservationStatus: "예약 슬롯 수동 등록",
    verificationMethod: "매장 QR 체크인",
    reviewReminderPolicy: "방문 당일 후기 가이드 발송, 다음날 오전 리마인드",
    pricingHypothesis: "월 5만원 구독 + 방문 성사 수수료",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=520&q=80",
    tags: ["광주 파일럿", "인스타그램", "노쇼 방지"]
  },
  {
    id: 3,
    title: "부천 실내 클라이밍 평일 낮 체험단",
    brandName: "무브클라임",
    category: "액티비티",
    region: "경기 부천",
    platform: "blog",
    reward: "체험권 2매 + 강습 1회",
    dueDate: "4일 남음",
    applicantCount: 94,
    recruitmentCount: 12,
    quietTimeSlot: "화·목 13:00~16:00",
    reservationStatus: "시간대별 정원 관리",
    verificationMethod: "QR 체크인 + 운영자 확인",
    reviewReminderPolicy: "체크인 후 사진 포함 후기 작성 요청",
    pricingHypothesis: "방문 1건당 1만원 매칭 수수료",
    imageUrl:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=520&q=80",
    tags: ["부천 파일럿", "액티비티", "방문 인증"],
    featured: true
  },
  {
    id: 4,
    title: "성수 팝업 쇼룸 오픈 주간 후기 확보",
    brandName: "스튜디오라인",
    category: "팝업",
    region: "서울 성동",
    platform: "youtube",
    reward: "쇼룸 굿즈 + 촬영 허가",
    dueDate: "6일 남음",
    applicantCount: 72,
    recruitmentCount: 15,
    quietTimeSlot: "오픈 주간 11:00~14:00",
    reservationStatus: "팝업 방문 슬롯 등록",
    verificationMethod: "현장 QR 체크인",
    reviewReminderPolicy: "쇼츠 업로드 링크 제출 리마인드",
    pricingHypothesis: "캠페인당 8만원 운영비",
    imageUrl:
      "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=520&q=80",
    tags: ["성수 팝업", "유튜브", "오픈 주간"]
  },
  {
    id: 5,
    title: "송파 디저트 카페 오픈런 이후 좌석 채우기",
    brandName: "슈가룸",
    category: "카페",
    region: "서울 송파",
    platform: "blog",
    reward: "디저트 세트 5만원",
    dueDate: "2일 남음",
    applicantCount: 188,
    recruitmentCount: 25,
    quietTimeSlot: "주말 16:00~18:00",
    reservationStatus: "예약 가능 슬롯 노출",
    verificationMethod: "QR·GPS 체크인",
    reviewReminderPolicy: "방문 다음날 리뷰 링크 미제출자 자동 리마인드",
    pricingHypothesis: "방문 1건당 5천원 매칭 수수료",
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=520&q=80",
    tags: ["카페", "후기 회수", "예약 슬롯"]
  },
  {
    id: 6,
    title: "독립서점 북토크 한산 회차 방문 리뷰",
    brandName: "페이지룸",
    category: "문화",
    region: "서울 마포",
    platform: "blog",
    reward: "도서 교환권 5만원",
    dueDate: "마감 임박",
    applicantCount: 61,
    recruitmentCount: 10,
    quietTimeSlot: "평일 19:00 북토크",
    reservationStatus: "회차별 정원 연결",
    verificationMethod: "현장 QR 체크인",
    reviewReminderPolicy: "행사 종료 후 1시간 뒤 후기 가이드 발송",
    pricingHypothesis: "캠페인당 6만원 운영비",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=520&q=80",
    tags: ["문화", "방문형", "후기 리마인드"]
  }
];

const filters = ["전체", "한산시간", "맛집", "카페", "액티비티", "문화"];
const platformLabels: Record<Campaign["platform"], string> = {
  blog: "Blog",
  instagram: "IG",
  youtube: "YT"
};

const ownerInitialForm: OwnerCampaignForm = {
  storeName: "",
  ownerName: "",
  phone: "",
  category: "카페",
  region: "",
  quietTimeSlot: "평일 14:00~17:00",
  offer: "",
  recruitmentCount: "10",
  reservationProvider: "네이버예약",
  campaignGoal: "한산 시간대 방문 후기 확보",
  matchingPreference: "방문 후기 성실도가 높은 블로거",
  autoRegistrationEnabled: true
};

const ownerProcessSteps = [
  {
    label: "사장님 의뢰",
    detail: "매장 정보와 원하는 방문 시간대를 입력합니다.",
    tone: "owner"
  },
  {
    label: "매장 등록",
    detail: "지역, 카테고리, 제공 내역을 캠페인 초안으로 정리합니다.",
    tone: "external"
  },
  {
    label: "시간대 분석",
    detail: "한산 시간대와 예약 슬롯 기준으로 모집 조건을 추천합니다.",
    tone: "automation"
  },
  {
    label: "자동 등록",
    detail: "자동 등록을 켜면 조건에 맞는 캠페인 문안을 생성합니다.",
    tone: "automation"
  },
  {
    label: "추천 수신",
    detail: "AI 매칭으로 체험단 후보를 추천받습니다.",
    tone: "automation"
  },
  {
    label: "최종 선택",
    detail: "사장님이 방문자를 직접 확정합니다.",
    tone: "owner"
  },
  {
    label: "체크인 확인",
    detail: "QR·GPS로 실제 방문을 확인합니다.",
    tone: "external"
  },
  {
    label: "체험 완료",
    detail: "리마인드 발송 후 신뢰 후기를 회수합니다.",
    tone: "complete"
  }
] as const;

const reviewRecoveryInitialItems: ReviewRecoveryItem[] = [
  {
    id: 1,
    campaignId: 1,
    reviewerName: "성수기록",
    platform: "blog",
    status: "checkedIn",
    checkInAt: "07.13 14:22",
    reviewDueDate: "07.15 18:00",
    reminderCount: 0,
    lastReminderAt: "-",
    source: "QR + GPS"
  },
  {
    id: 2,
    campaignId: 1,
    reviewerName: "오늘의테이블",
    platform: "instagram",
    status: "reminded",
    checkInAt: "07.12 15:08",
    reviewDueDate: "오늘 20:00",
    reminderCount: 1,
    lastReminderAt: "오늘 10:30",
    source: "QR + GPS"
  },
  {
    id: 3,
    campaignId: 2,
    reviewerName: "동명동산책",
    platform: "instagram",
    status: "published",
    checkInAt: "07.11 16:11",
    reviewDueDate: "07.13 18:00",
    reminderCount: 1,
    lastReminderAt: "07.12 09:00",
    source: "매장 QR"
  },
  {
    id: 4,
    campaignId: 3,
    reviewerName: "주말클라이머",
    platform: "blog",
    status: "completed",
    checkInAt: "07.10 13:46",
    reviewDueDate: "07.12 18:00",
    reminderCount: 0,
    lastReminderAt: "-",
    source: "QR + 운영자 확인"
  },
  {
    id: 5,
    campaignId: 5,
    reviewerName: "디저트로그",
    platform: "blog",
    status: "reminded",
    checkInAt: "07.12 16:34",
    reviewDueDate: "오늘 18:00",
    reminderCount: 2,
    lastReminderAt: "오늘 09:15",
    source: "QR + GPS"
  }
];

const reviewStatusLabels: Record<ReviewRecoveryStatus, string> = {
  checkedIn: "후기 대기",
  reminded: "리마인드 발송",
  published: "발행 확인",
  completed: "회수 완료"
};

const reviewFilters: Array<{ label: string; value: "all" | ReviewRecoveryStatus }> = [
  { label: "전체", value: "all" },
  { label: "후기 대기", value: "checkedIn" },
  { label: "리마인드 발송", value: "reminded" },
  { label: "발행 확인", value: "published" },
  { label: "회수 완료", value: "completed" }
];

const todayOpenItems: TodayOpenItem[] = [
  { campaignId: 1, openAt: "09:00", remainingSlots: 4, openStatus: "open" },
  { campaignId: 2, openAt: "10:30", remainingSlots: 2, openStatus: "closingSoon" },
  { campaignId: 3, openAt: "12:00", remainingSlots: 7, openStatus: "open" },
  { campaignId: 4, openAt: "14:00", remainingSlots: 10, openStatus: "scheduled" },
  { campaignId: 5, openAt: "15:30", remainingSlots: 3, openStatus: "scheduled" },
  { campaignId: 6, openAt: "17:00", remainingSlots: 6, openStatus: "scheduled" }
];

const todayOpenStatusLabels: Record<TodayOpenStatus, string> = {
  open: "지금 신청",
  closingSoon: "마감 임박",
  scheduled: "오픈 예정"
};

const todayOpenFilters = ["전체", "지금 신청", "카페", "맛집", "액티비티", "문화"];

const getViewFromHash = (): ViewMode => {
  if (typeof window === "undefined") return "home";
  if (window.location.hash === "#owner-registration") return "ownerRegistration";
  if (window.location.hash === "#review-recovery") return "reviewRecovery";
  if (window.location.hash === "#today-open") return "todayOpen";
  return "home";
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(getViewFromHash);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [ownerForm, setOwnerForm] = useState<OwnerCampaignForm>(ownerInitialForm);
  const [submittedOwnerCampaign, setSubmittedOwnerCampaign] =
    useState<OwnerCampaignForm | null>(null);
  const [reviewItems, setReviewItems] = useState(reviewRecoveryInitialItems);
  const [reviewFilter, setReviewFilter] =
    useState<"all" | ReviewRecoveryStatus>("all");
  const [todayOpenFilter, setTodayOpenFilter] = useState("전체");
  const [appliedTodayCampaignIds, setAppliedTodayCampaignIds] = useState<number[]>([]);

  const visibleCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesFilter =
        selectedFilter === "전체" ||
        campaign.category === selectedFilter ||
        campaign.region.includes(selectedFilter) ||
        campaign.tags.includes(selectedFilter) ||
        (selectedFilter === "한산시간" && campaign.quietTimeSlot.length > 0) ||
        (selectedFilter === "운영" && campaign.verificationMethod.length > 0);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          campaign.title,
          campaign.brandName,
          campaign.category,
          campaign.region,
          campaign.quietTimeSlot,
          campaign.verificationMethod
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [query, selectedFilter]);

  const selectedCampaign =
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0];

  const visibleReviewItems = reviewItems.filter(
    (item) => reviewFilter === "all" || item.status === reviewFilter
  );

  const reviewSummary = {
    checkedIn: reviewItems.length,
    waiting: reviewItems.filter((item) => item.status === "checkedIn").length,
    reminded: reviewItems.filter((item) => item.status === "reminded").length,
    recovered: reviewItems.filter(
      (item) => item.status === "published" || item.status === "completed"
    ).length
  };


  const visibleTodayOpenItems = todayOpenItems
    .map((item) => ({
      ...item,
      campaign: campaigns.find((campaign) => campaign.id === item.campaignId)!
    }))
    .filter((item) =>
      todayOpenFilter === "전체"
        ? true
        : todayOpenFilter === "지금 신청"
          ? item.openStatus !== "scheduled"
          : item.campaign.category === todayOpenFilter
    );

  const todayOpenSummary = {
    total: todayOpenItems.length,
    available: todayOpenItems.filter((item) => item.openStatus !== "scheduled").length,
    remaining: todayOpenItems.reduce((sum, item) => sum + item.remainingSlots, 0)
  };
  useEffect(() => {
    const handleHashChange = () => setCurrentView(getViewFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const openOwnerRegistration = () => {
    setCurrentView("ownerRegistration");
    setSubmittedOwnerCampaign(null);
    window.location.hash = "owner-registration";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const openReviewRecovery = () => {
    setCurrentView("reviewRecovery");
    setIsMenuOpen(false);
    window.location.hash = "review-recovery";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openTodayOpen = () => {
    setCurrentView("todayOpen");
    setIsMenuOpen(false);
    window.location.hash = "today-open";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setCurrentView("home");
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOwnerInputChange = <Field extends keyof OwnerCampaignForm>(
    field: Field,
    value: OwnerCampaignForm[Field]
  ) => {
    setOwnerForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleOwnerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedOwnerCampaign(ownerForm);
  };

  const handleApply = () => {
    setApplicationMessage(
      `${selectedCampaign.brandName} 캠페인 신청 준비가 완료되었습니다.`
    );
  };

  const sendReviewReminder = (reviewId: number) => {
    setReviewItems((current) =>
      current.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              status: "reminded",
              reminderCount: item.reminderCount + 1,
              lastReminderAt: "방금 전"
            }
          : item
      )
    );
  };

  const completeReviewRecovery = (reviewId: number) => {
    setReviewItems((current) =>
      current.map((item) =>
        item.id === reviewId ? { ...item, status: "completed" } : item
      )
    );
  };

  const applyTodayCampaign = (campaignId: number) => {
    setAppliedTodayCampaignIds((current) =>
      current.includes(campaignId) ? current : [...current, campaignId]
    );
  };

  if (currentView === "todayOpen") {
    const featuredTodayItem = todayOpenItems[0];
    const featuredTodayCampaign = campaigns.find(
      (campaign) => campaign.id === featuredTodayItem.campaignId
    )!;

    return (
      <main className="app today-page">
        <div className="notice-bar today-notice">
          <span>오늘오픈</span>
          <strong>오늘 공개되는 방문 인증 체험단 캠페인을 시간순으로 확인하세요.</strong>
        </div>

        <header className="today-header">
          <button className="owner-logo-button" type="button" onClick={goHome}>
            <img className="logo-image" src={julseoLogo} alt="줄서" />
          </button>
          <div className="today-header-copy">
            <p>매일 새 캠페인</p>
            <h1>오늘오픈</h1>
          </div>
          <button className="secondary-action today-home-button" type="button" onClick={goHome}>
            메인으로 돌아가기
          </button>
        </header>

        <section className="today-workspace" aria-label="오늘오픈 캠페인">
          <div className="today-intro">
            <div>
              <p>2026년 7월 13일</p>
              <h2>오늘 새로 열린 체험단을 가장 먼저 만나보세요</h2>
              <span>방문 시간과 남은 자리를 확인하고 바로 신청할 수 있습니다.</span>
            </div>
            <div className="today-summary" aria-label="오늘오픈 요약">
              <div><span>오늘 공개</span><strong>{todayOpenSummary.total}</strong></div>
              <div><span>지금 신청</span><strong>{todayOpenSummary.available}</strong></div>
              <div><span>남은 자리</span><strong>{todayOpenSummary.remaining}</strong></div>
            </div>
          </div>

          <article className="today-spotlight">
            <div className="today-spotlight-media">
              <img src={featuredTodayCampaign.imageUrl} alt={`${featuredTodayCampaign.title} 대표 이미지`} />
              <span>09:00 OPEN</span>
            </div>
            <div className="today-spotlight-copy">
              <p>오늘의 첫 번째 캠페인</p>
              <h2>{featuredTodayCampaign.title}</h2>
              <span>{featuredTodayCampaign.brandName} · {featuredTodayCampaign.region}</span>
              <dl>
                <div><dt>방문 시간</dt><dd>{featuredTodayCampaign.quietTimeSlot}</dd></div>
                <div><dt>방문 인증</dt><dd>{featuredTodayCampaign.verificationMethod}</dd></div>
                <div><dt>제공 내역</dt><dd>{featuredTodayCampaign.reward}</dd></div>
              </dl>
              <button
                className="primary-action today-featured-action"
                type="button"
                onClick={() => applyTodayCampaign(featuredTodayCampaign.id)}
                disabled={appliedTodayCampaignIds.includes(featuredTodayCampaign.id)}
              >
                {appliedTodayCampaignIds.includes(featuredTodayCampaign.id)
                  ? "신청 완료"
                  : `남은 ${featuredTodayItem.remainingSlots}자리 바로 신청`}
              </button>
            </div>
          </article>

          <section className="today-list" aria-label="오늘 공개 캠페인 목록">
            <div className="today-list-heading">
              <div>
                <p>시간순 공개</p>
                <h2>오늘의 캠페인</h2>
              </div>
              <span>{visibleTodayOpenItems.length}개 캠페인</span>
            </div>

            <div className="today-filter-row" aria-label="오늘오픈 필터">
              {todayOpenFilters.map((filter) => (
                <button
                  className={todayOpenFilter === filter ? "is-active" : ""}
                  key={filter}
                  type="button"
                  onClick={() => setTodayOpenFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="today-campaign-grid">
              {visibleTodayOpenItems.map((item) => {
                const isApplied = appliedTodayCampaignIds.includes(item.campaign.id);
                const isScheduled = item.openStatus === "scheduled";

                return (
                  <article className="today-campaign-card" key={item.campaignId}>
                    <div className="today-card-media">
                      <img src={item.campaign.imageUrl} alt={`${item.campaign.title} 이미지`} />
                      <span className={`today-status is-${item.openStatus}`}>
                        {todayOpenStatusLabels[item.openStatus]}
                      </span>
                      <strong>{item.openAt}</strong>
                    </div>
                    <div className="today-card-body">
                      <p>{item.campaign.brandName} · {item.campaign.region}</p>
                      <h3>{item.campaign.title}</h3>
                      <div className="today-card-facts">
                        <span><b>방문</b>{item.campaign.quietTimeSlot}</span>
                        <span><b>인증</b>{item.campaign.verificationMethod}</span>
                        <span><b>혜택</b>{item.campaign.reward}</span>
                      </div>
                      <div className="today-card-footer">
                        <span><strong>{item.remainingSlots}</strong>자리 남음</span>
                        <button
                          type="button"
                          disabled={isScheduled || isApplied}
                          onClick={() => applyTodayCampaign(item.campaignId)}
                        >
                          {isApplied ? "신청 완료" : isScheduled ? `${item.openAt} 오픈` : "바로 신청"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {visibleTodayOpenItems.length === 0 ? (
              <div className="today-empty" role="status">
                <strong>선택한 조건의 오늘오픈 캠페인이 없습니다.</strong>
                <span>다른 카테고리를 선택해보세요.</span>
              </div>
            ) : null}
          </section>
        </section>
      </main>
    );
  }

  if (currentView === "reviewRecovery") {
    return (
      <main className="app review-page">
        <div className="notice-bar review-notice">
          <span>후기회수</span>
          <strong>방문 인증된 체험단만 후기 요청과 리마인드를 관리합니다.</strong>
        </div>

        <header className="review-header">
          <button className="owner-logo-button" type="button" onClick={goHome}>
            <img className="logo-image" src={julseoLogo} alt="줄서" />
          </button>
          <div className="review-header-copy">
            <p>방문 이후 운영</p>
            <h1>후기회수 관리</h1>
          </div>
          <button className="secondary-action review-home-button" type="button" onClick={goHome}>
            메인으로 돌아가기
          </button>
        </header>

        <section className="review-workspace" aria-label="후기회수 관리 화면">
          <div className="review-intro">
            <div>
              <p>오늘의 후기 운영</p>
              <h2>방문은 확인됐고, 이제 신뢰 후기를 회수할 차례입니다</h2>
              <span>체크인 이후 후기 요청부터 발행 확인까지 한곳에서 관리하세요.</span>
            </div>
            <div className="review-flow" aria-label="후기회수 진행 단계">
              <span className="is-done">방문 인증</span>
              <span>후기 요청</span>
              <span>리마인드</span>
              <span>발행 확인</span>
            </div>
          </div>

          <div className="review-summary" aria-label="후기회수 요약">
            <article>
              <span>방문 인증</span>
              <strong>{reviewSummary.checkedIn}</strong>
              <small>후기 대상 체험단</small>
            </article>
            <article>
              <span>후기 대기</span>
              <strong>{reviewSummary.waiting}</strong>
              <small>첫 요청이 필요해요</small>
            </article>
            <article>
              <span>리마인드 중</span>
              <strong>{reviewSummary.reminded}</strong>
              <small>마감 전 확인 중</small>
            </article>
            <article className="is-success">
              <span>회수 성과</span>
              <strong>{reviewSummary.recovered}</strong>
              <small>발행 또는 완료</small>
            </article>
          </div>

          <section className="review-queue" aria-label="후기회수 대상 목록">
            <div className="review-queue-heading">
              <div>
                <p>후기회수 목록</p>
                <h2>체험단별 진행 상태</h2>
              </div>
              <span>{visibleReviewItems.length}명 표시</span>
            </div>

            <div className="review-filter-row" aria-label="후기 상태 필터">
              {reviewFilters.map((filter) => (
                <button
                  className={reviewFilter === filter.value ? "is-active" : ""}
                  key={filter.value}
                  type="button"
                  onClick={() => setReviewFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="review-table-wrap">
              <table className="review-table">
                <thead>
                  <tr>
                    <th>체험단 / 캠페인</th>
                    <th>방문 인증</th>
                    <th>후기 마감</th>
                    <th>리마인드</th>
                    <th>상태</th>
                    <th><span className="sr-only">관리</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleReviewItems.map((item) => {
                    const campaign = campaigns.find((entry) => entry.id === item.campaignId);
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="reviewer-cell">
                            <span>{platformLabels[item.platform]}</span>
                            <div>
                              <strong>{item.reviewerName}</strong>
                              <small>{campaign?.brandName} · {campaign?.title}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{item.checkInAt}</strong>
                          <small>{item.source}</small>
                        </td>
                        <td><strong>{item.reviewDueDate}</strong></td>
                        <td>
                          <strong>{item.reminderCount}회</strong>
                          <small>{item.lastReminderAt}</small>
                        </td>
                        <td>
                          <span className={`review-status is-${item.status}`}>
                            {reviewStatusLabels[item.status]}
                          </span>
                        </td>
                        <td>
                          {item.status === "published" ? (
                            <button
                              className="review-action is-complete"
                              type="button"
                              onClick={() => completeReviewRecovery(item.id)}
                            >
                              회수 완료
                            </button>
                          ) : item.status === "completed" ? (
                            <span className="review-action-done">완료됨</span>
                          ) : (
                            <button
                              className="review-action"
                              type="button"
                              onClick={() => sendReviewReminder(item.id)}
                            >
                              {item.status === "checkedIn" ? "후기 요청" : "다시 알림"}
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
  }

  if (currentView === "ownerRegistration") {

  const sendReviewReminder = (reviewId: number) => {
    setReviewItems((current) =>
      current.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              status: "reminded",
              reminderCount: item.reminderCount + 1,
              lastReminderAt: "방금 전"
            }
          : item
      )
    );
  };

  const completeReviewRecovery = (reviewId: number) => {
    setReviewItems((current) =>
      current.map((item) =>
        item.id === reviewId ? { ...item, status: "completed" } : item
      )
    );
  };
    return (
      <main className="app owner-page">
        <div className="notice-bar owner-notice">
          <span>사장님 등록</span>
          <strong>매장 등록부터 자동 등록, AI 추천, QR 체크인까지 한 화면에서 설계합니다.</strong>
        </div>

        <header className="owner-header">
          <button className="owner-logo-button" type="button" onClick={goHome}>
            <img className="logo-image" src={julseoLogo} alt="줄서" />
          </button>
          <div>
            <p>체험단 모집 SaaS</p>
            <h1>사장님 체험단 모집 등록</h1>
          </div>
          <button className="secondary-action owner-home-button" type="button" onClick={goHome}>
            메인으로 돌아가기
          </button>
        </header>

        <section className="owner-workspace" aria-label="사장님 체험단 모집 등록 화면">
          <form className="owner-form" onSubmit={handleOwnerSubmit}>
            <div className="owner-form-heading">
              <p>01 사장님 의뢰</p>
              <h2>매장과 모집 조건을 입력하세요</h2>
              <span>제출 후에는 시간대 분석, 자동 등록, AI 매칭 후보 추천 순서로 이어집니다.</span>
            </div>

            <fieldset className="form-section">
              <legend>매장 등록</legend>
              <div className="field-grid">
                <label className="form-field">
                  <span>매장명</span>
                  <input
                    required
                    type="text"
                    value={ownerForm.storeName}
                    onChange={(event) => handleOwnerInputChange("storeName", event.target.value)}
                    placeholder="예: 오브서울 성수점"
                  />
                </label>
                <label className="form-field">
                  <span>사장님 성함</span>
                  <input
                    required
                    type="text"
                    value={ownerForm.ownerName}
                    onChange={(event) => handleOwnerInputChange("ownerName", event.target.value)}
                    placeholder="예: 김줄서"
                  />
                </label>
                <label className="form-field">
                  <span>연락처</span>
                  <input
                    required
                    type="tel"
                    value={ownerForm.phone}
                    onChange={(event) => handleOwnerInputChange("phone", event.target.value)}
                    placeholder="010-0000-0000"
                  />
                </label>
                <label className="form-field">
                  <span>지역</span>
                  <input
                    required
                    type="text"
                    value={ownerForm.region}
                    onChange={(event) => handleOwnerInputChange("region", event.target.value)}
                    placeholder="예: 서울 성동구"
                  />
                </label>
                <label className="form-field">
                  <span>카테고리</span>
                  <select
                    value={ownerForm.category}
                    onChange={(event) => handleOwnerInputChange("category", event.target.value)}
                  >
                    {["카페", "맛집", "액티비티", "문화", "팝업", "뷰티"].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span>예약 연동</span>
                  <select
                    value={ownerForm.reservationProvider}
                    onChange={(event) =>
                      handleOwnerInputChange("reservationProvider", event.target.value)
                    }
                  >
                    {["네이버예약", "캐치테이블", "수동 슬롯", "추후 연동"].map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
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
                  <input
                    required
                    type="text"
                    value={ownerForm.quietTimeSlot}
                    onChange={(event) =>
                      handleOwnerInputChange("quietTimeSlot", event.target.value)
                    }
                    placeholder="예: 평일 14:00~17:00"
                  />
                </label>
                <label className="form-field">
                  <span>모집 인원</span>
                  <input
                    required
                    min="1"
                    type="number"
                    value={ownerForm.recruitmentCount}
                    onChange={(event) =>
                      handleOwnerInputChange("recruitmentCount", event.target.value)
                    }
                  />
                </label>
                <label className="form-field field-wide">
                  <span>제공 내역</span>
                  <input
                    required
                    type="text"
                    value={ownerForm.offer}
                    onChange={(event) => handleOwnerInputChange("offer", event.target.value)}
                    placeholder="예: 2인 식사권 7만원 / 음료 2잔 + 디저트"
                  />
                </label>
                <label className="form-field field-wide">
                  <span>캠페인 목표</span>
                  <textarea
                    required
                    value={ownerForm.campaignGoal}
                    onChange={(event) =>
                      handleOwnerInputChange("campaignGoal", event.target.value)
                    }
                    placeholder="예: 평일 오후 빈 좌석을 채우고 네이버 블로그 후기를 확보하고 싶어요."
                  />
                </label>
              </div>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={ownerForm.autoRegistrationEnabled}
                  onChange={(event) =>
                    handleOwnerInputChange("autoRegistrationEnabled", event.target.checked)
                  }
                />
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
                <textarea
                  value={ownerForm.matchingPreference}
                  onChange={(event) =>
                    handleOwnerInputChange("matchingPreference", event.target.value)
                  }
                  placeholder="예: 방문 약속을 잘 지키고 사진 후기가 깔끔한 블로거"
                />
              </label>
              <div className="verification-strip" aria-label="등록 후 검증 프로세스">
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

            {submittedOwnerCampaign ? (
              <div className="registration-result" role="status">
                <strong>
                  {submittedOwnerCampaign.storeName || "신규 매장"} 캠페인 등록 초안이 생성되었습니다.
                </strong>
                <p>
                  다음 단계는 시간대 분석, 자동 등록, AI 추천 수신, 사장님 최종 선택,
                  QR 체크인 확인 순서입니다.
                </p>
              </div>
            ) : null}
          </form>

          <aside className="owner-process" aria-label="실제 체험단 프로세스">
            <div className="process-heading">
              <p>실제 체험단 프로세스</p>
              <h2>체험단 매칭 플랫폼 대시보드</h2>
              <span>첨부해주신 흐름을 사장님이 등록 중 바로 이해할 수 있게 정리했습니다.</span>
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
            <div className="process-legend" aria-label="프로세스 색상 설명">
              <span className="legend-automation">자동화 필요</span>
              <span className="legend-owner">사장님 결정</span>
              <span className="legend-external">외부 연동</span>
              <span className="legend-complete">완료</span>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
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
          <a className="logo" href="#top" aria-label="줄서 홈">
            <img className="logo-image" src={julseoLogo} alt="줄서" />
          </a>
          <label className="search-box">
            <span>검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="매장, 지역, 한산 시간대, 인증 방식을 검색하세요."
            />
          </label>
          <nav className="utility-nav" aria-label="사용자 메뉴">
            <a href="#login">로그인</a>
            <a href="#join">회원가입</a>
            <a href="#advertiser">광고문의</a>
          </nav>
        </div>

        <nav
          className={`primary-nav ${isMenuOpen ? "is-open" : ""}`}
          aria-label="주요 메뉴"
        >
          {[
            "홈",
            "캠페인",
            "예약슬롯",
            "방문인증",
            "후기회수",
            "오늘오픈",
            "파일럿",
            "광고문의"
          ].map((item) => (
            <a
              className={
                item === "후기회수"
                  ? "review-nav-link"
                  : item === "오늘오픈"
                    ? "today-nav-link"
                    : ""
              }
              key={item}
              href={
                item === "후기회수" ? "#review-recovery" : item === "오늘오픈" ? "#today-open" : `#${item}`
              }
              onClick={
                item === "후기회수" ? openReviewRecovery : item === "오늘오픈" ? openTodayOpen : undefined
              }
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero-grid" id="top" aria-label="추천 캠페인">
        {heroBanners.map((banner) => (
          <article
            className="hero-card"
            key={banner.title}
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            <span>{banner.label}</span>
            <h1>{banner.title}</h1>
            <p>{banner.description}</p>
          </article>
        ))}
      </section>

      <section className="mvp-summary" aria-label="MVP 핵심 기능">
        {mvpHighlights.map((item) => (
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
            onClick={() => {
              if (category.label === "오늘오픈") openTodayOpen();
              else setSelectedFilter(category.value);
            }}
          >
            <img src={category.imageUrl} alt="" />
            <span>{category.label}</span>
          </button>
        ))}
      </section>

      <section className="workbench" aria-label="캠페인 목록과 상세">
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
                className={`campaign-card ${
                  selectedCampaign.id === campaign.id ? "is-current" : ""
                }`}
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
                    {campaign.brandName} · {campaign.region}
                  </span>
                  <span>{campaign.quietTimeSlot}</span>
                  <span className="campaign-meta">
                    <em>{campaign.dueDate}</em>
                    신청 {campaign.applicantCount.toLocaleString()} /{" "}
                    {campaign.recruitmentCount}명
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside className="detail-panel" aria-label="선택한 캠페인 상세">
          <div className="detail-image">
            <img
              src={selectedCampaign.imageUrl}
              alt={`${selectedCampaign.title} 대표 이미지`}
            />
            <span>{selectedCampaign.category}</span>
          </div>
          <div className="detail-body">
            <p>{selectedCampaign.brandName}</p>
            <h2>{selectedCampaign.title}</h2>
            <dl>
              <div>
                <dt>한산 시간</dt>
                <dd>{selectedCampaign.quietTimeSlot}</dd>
              </div>
              <div>
                <dt>예약 상태</dt>
                <dd>{selectedCampaign.reservationStatus}</dd>
              </div>
              <div>
                <dt>방문 인증</dt>
                <dd>{selectedCampaign.verificationMethod}</dd>
              </div>
              <div>
                <dt>후기 회수</dt>
                <dd>{selectedCampaign.reviewReminderPolicy}</dd>
              </div>
              <div>
                <dt>제공 내역</dt>
                <dd>{selectedCampaign.reward}</dd>
              </div>
              <div>
                <dt>가격 가설</dt>
                <dd>{selectedCampaign.pricingHypothesis}</dd>
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
            <button className="secondary-action" type="button" onClick={openOwnerRegistration}>
              매장 캠페인 등록 문의
            </button>
            {applicationMessage ? (
              <p className="application-message" role="status">
                {applicationMessage}
              </p>
            ) : null}
          </div>
        </aside>
      </section>

      <button
        className="floating-contact"
        type="button"
        aria-label="사장님 체험단 모집 등록하기"
        onClick={openOwnerRegistration}
      >
        <span className="floating-contact-icon" aria-hidden="true">
          <img src={julseoLogo} alt="" />
        </span>
        <span className="floating-contact-copy">
          <strong>사장님이신가요?</strong>
          <span>한산 시간대·예약 슬롯·QR 체크인 캠페인을 직접 등록해보세요.</span>
          <em>모집 등록하기</em>
        </span>
      </button>
    </main>
  );
}
