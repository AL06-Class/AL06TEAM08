import { useMemo, useState } from "react";
import "./App.css";

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
  imageUrl: string;
  tags: string[];
  featured?: boolean;
};

type Category = {
  label: string;
  value: string;
  imageUrl: string;
};

const heroBanners = [
  {
    title: "브랜드와 블로거를 빠르게 매칭",
    description: "조건에 맞는 체험단을 찾고 신청까지 한 번에 진행하세요.",
    label: "신규 캠페인",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "오늘 새로 열린 지역 체험단",
    description: "맛집, 공간, 클래스 체험을 지역별로 확인하세요.",
    label: "오늘오픈",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "성과 리포트까지 한 번에",
    description: "모집부터 리뷰 발행 확인까지 광고주가 쉽게 관리합니다.",
    label: "광고주 도구",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
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
    label: "높은보상",
    value: "프리미엄",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "맛집",
    value: "맛집",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "뷰티",
    value: "뷰티",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "여행",
    value: "여행",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "문화",
    value: "문화",
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "식품",
    value: "식품",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "생활",
    value: "생활",
    imageUrl:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "디지털",
    value: "디지털",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80"
  },
  {
    label: "커뮤니티",
    value: "커뮤니티",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=120&q=80"
  }
];

const campaigns: Campaign[] = [
  {
    id: 1,
    title: "성수 신상 브런치 카페 리뷰어 모집",
    brandName: "오브서울",
    category: "맛집",
    region: "서울 성동",
    platform: "blog",
    reward: "2인 식사권 8만원",
    dueDate: "3일 남음",
    applicantCount: 128,
    recruitmentCount: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=520&q=80",
    tags: ["네이버 블로그", "방문형", "사진 10장"]
  },
  {
    id: 2,
    title: "비건 스킨케어 2주 사용 후기 체험단",
    brandName: "그린랩",
    category: "뷰티",
    region: "배송",
    platform: "instagram",
    reward: "본품 3종 세트",
    dueDate: "1일 남음",
    applicantCount: 246,
    recruitmentCount: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=520&q=80",
    tags: ["인스타그램", "배송형", "릴스 우대"],
    featured: true
  },
  {
    id: 3,
    title: "부산 오션뷰 호텔 숙박 리뷰 캠페인",
    brandName: "마레호텔",
    category: "여행",
    region: "부산 해운대",
    platform: "blog",
    reward: "1박 숙박권",
    dueDate: "4일 남음",
    applicantCount: 94,
    recruitmentCount: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=520&q=80",
    tags: ["프리미엄", "방문형", "커플 가능"],
    featured: true
  },
  {
    id: 4,
    title: "홈오피스 모니터암 실사용 리뷰어",
    brandName: "데스크핏",
    category: "디지털",
    region: "배송",
    platform: "youtube",
    reward: "제품 제공 12만원 상당",
    dueDate: "6일 남음",
    applicantCount: 72,
    recruitmentCount: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=520&q=80",
    tags: ["유튜브", "쇼츠 가능", "IT"]
  },
  {
    id: 5,
    title: "프리미엄 수제 그래놀라 구매평단",
    brandName: "오트밀리",
    category: "식품",
    region: "배송",
    platform: "blog",
    reward: "제품 4종 제공",
    dueDate: "2일 남음",
    applicantCount: 188,
    recruitmentCount: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=520&q=80",
    tags: ["구매평", "배송형", "건강식"]
  },
  {
    id: 6,
    title: "독립서점 북토크 방문 리뷰 모집",
    brandName: "페이지룸",
    category: "문화",
    region: "서울 마포",
    platform: "blog",
    reward: "도서 교환권 5만원",
    dueDate: "마감 임박",
    applicantCount: 61,
    recruitmentCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=520&q=80",
    tags: ["문화", "방문형", "글감 제공"]
  }
];

const filters = ["전체", "맛집", "뷰티", "여행", "식품", "디지털"];
const platformLabels: Record<Campaign["platform"], string> = {
  blog: "Blog",
  instagram: "IG",
  youtube: "YT"
};

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  const visibleCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesFilter =
        selectedFilter === "전체" ||
        campaign.category === selectedFilter ||
        (selectedFilter === "프리미엄" && campaign.featured);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [campaign.title, campaign.brandName, campaign.category, campaign.region]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [query, selectedFilter]);

  const selectedCampaign =
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0];

  const handleApply = () => {
    setApplicationMessage(
      `${selectedCampaign.brandName} 캠페인 신청 준비가 완료되었습니다.`
    );
  };

  return (
    <main className="app">
      <div className="notice-bar">
        <span>공지사항</span>
        <strong>블로거 체험단 캠페인 심사 기준 업데이트 안내</strong>
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
          <a className="logo" href="#top" aria-label="BLOGLE 홈">
            BLOGLE
          </a>
          <label className="search-box">
            <span>검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="캠페인, 브랜드, 지역을 검색하세요."
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
            "지역",
            "기자단",
            "오늘오픈",
            "프리미엄",
            "유튜브",
            "구매평",
            "커뮤니티"
          ].map((item) => (
            <a key={item} href={`#${item}`}>
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

      <section className="category-strip" aria-label="빠른 카테고리">
        {categories.map((category) => (
          <button
            className={selectedFilter === category.value ? "is-selected" : ""}
            key={category.label}
            type="button"
            onClick={() => setSelectedFilter(category.value)}
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
              <p>블로거 모집</p>
              <h2>지금 신청 급상승 중인 캠페인</h2>
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
                <dt>제공 내역</dt>
                <dd>{selectedCampaign.reward}</dd>
              </div>
              <div>
                <dt>모집 인원</dt>
                <dd>{selectedCampaign.recruitmentCount}명</dd>
              </div>
              <div>
                <dt>마감</dt>
                <dd>{selectedCampaign.dueDate}</dd>
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
            <button className="secondary-action" type="button">
              광고주에게 문의하기
            </button>
            {applicationMessage ? (
              <p className="application-message" role="status">
                {applicationMessage}
              </p>
            ) : null}
          </div>
        </aside>
      </section>

      <aside className="floating-contact" aria-label="광고주 상담">
        <strong>광고주이신가요?</strong>
        <span>모집 조건과 리뷰어 매칭을 상담해드려요.</span>
      </aside>
    </main>
  );
}
