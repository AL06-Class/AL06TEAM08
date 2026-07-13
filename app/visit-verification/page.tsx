"use client";

import {
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Crosshair,
  LocateFixed,
  MapPin,
  QrCode,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Store,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

type VisitStatus = "scheduled" | "waiting" | "verified" | "review";

type Visit = {
  id: number;
  name: string;
  initial: string;
  time: string;
  campaign: string;
  status: VisitStatus;
  qr: boolean;
  gps: boolean;
  timeValid: boolean;
  distance: number;
  checkedAt?: string;
};

const initialVisits: Visit[] = [
  { id: 1, name: "김하늘", initial: "김", time: "14:00", campaign: "성수 신상 브런치 체험", status: "waiting", qr: true, gps: true, timeValid: true, distance: 18 },
  { id: 2, name: "이서준", initial: "이", time: "14:00", campaign: "성수 신상 브런치 체험", status: "verified", qr: true, gps: true, timeValid: true, distance: 9, checkedAt: "13:56" },
  { id: 3, name: "박지민", initial: "박", time: "15:30", campaign: "한산 시간 카페 체험", status: "scheduled", qr: false, gps: false, timeValid: false, distance: 0 },
  { id: 4, name: "최유나", initial: "최", time: "17:00", campaign: "성수 디너 체험", status: "review", qr: true, gps: false, timeValid: true, distance: 284 },
  { id: 5, name: "정민호", initial: "정", time: "18:30", campaign: "저녁 메뉴 체험", status: "verified", qr: true, gps: true, timeValid: true, distance: 22, checkedAt: "18:24" },
];

const statusLabels: Record<VisitStatus, string> = {
  scheduled: "방문 예정",
  waiting: "확인 대기",
  verified: "인증 완료",
  review: "확인 필요",
};

const filters = [
  { value: "all", label: "전체" },
  { value: "waiting", label: "확인 대기" },
  { value: "verified", label: "인증 완료" },
  { value: "review", label: "확인 필요" },
] as const;

export default function VisitVerificationPage() {
  const [visits, setVisits] = useState(initialVisits);
  const [selectedId, setSelectedId] = useState(1);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrVersion, setQrVersion] = useState(1);
  const [toast, setToast] = useState("");

  const filteredVisits = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return visits.filter((visit) => {
      const matchesFilter = filter === "all" || visit.status === filter;
      const matchesQuery = !normalized || visit.name.toLowerCase().includes(normalized) || visit.campaign.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, visits]);

  const selectedVisit = visits.find((visit) => visit.id === selectedId) ?? filteredVisits[0];
  const verifiedCount = visits.filter((visit) => visit.status === "verified").length;
  const waitingCount = visits.filter((visit) => visit.status === "waiting").length;
  const reviewCount = visits.filter((visit) => visit.status === "review").length;

  function refreshVisits() {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 800);
  }

  function updateStatus(status: VisitStatus) {
    if (!selectedVisit) return;
    setVisits((current) => current.map((visit) => visit.id === selectedVisit.id ? {
      ...visit,
      status,
      qr: status === "verified" ? true : visit.qr,
      gps: status === "verified" ? true : visit.gps,
      timeValid: status === "verified" ? true : visit.timeValid,
      checkedAt: status === "verified" ? "14:03" : visit.checkedAt,
    } : visit));
    setToast(status === "verified" ? `${selectedVisit.name} 님의 방문을 인증했습니다.` : `${selectedVisit.name} 님을 확인 필요로 전환했습니다.`);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <main>
      <SiteHeader active="방문인증" notice="QR 스캔과 GPS 위치가 모두 확인되면 방문 인증이 완료됩니다." />

      <section className="workspace pageWidth visitWorkspace">
        <div className="titleRow">
          <div>
            <p className="eyebrow">VISIT VERIFICATION</p>
            <h1>방문인증</h1>
            <p className="pageDescription">QR·GPS 체크인으로 체험단의 실제 방문을 확인합니다.</p>
          </div>
          <div className="titleActions">
            <button className="secondaryButton" onClick={refreshVisits} disabled={isRefreshing}>
              <RefreshCw size={17} className={isRefreshing ? "spin" : ""} />
              {isRefreshing ? "불러오는 중" : "새로고침"}
            </button>
            <button className="primaryButton" onClick={() => setQrOpen(true)}>
              <QrCode size={18} /> 매장 QR 열기
            </button>
          </div>
        </div>

        <div className="storeBar">
          <div className="storeIdentity">
            <span className="storeIcon"><Store size={20} /></span>
            <div>
              <strong>오브서울 성수점</strong>
              <span><MapPin size={13} /> 서울 성동구 연무장길 24</span>
            </div>
          </div>
          <button className="storeSelect">매장 변경 <ChevronDown size={16} /></button>
          <span className="syncBadge greenSync"><ShieldCheck size={14} /> GPS 인증 사용</span>
        </div>

        <div className="metrics" aria-label="방문인증 요약">
          <div className="metric">
            <span className="metricIcon blue"><Users size={20} /></span>
            <div><span>오늘 방문 예정</span><strong>{visits.length}<small>명</small></strong></div>
          </div>
          <div className="metric">
            <span className="metricIcon green"><UserCheck size={20} /></span>
            <div><span>인증 완료</span><strong>{verifiedCount}<small>명</small></strong></div>
          </div>
          <div className="metric">
            <span className="metricIcon amber"><Clock3 size={20} /></span>
            <div><span>확인 대기</span><strong>{waitingCount}<small>명</small></strong></div>
          </div>
          <div className="metric">
            <span className="metricIcon coral"><AlertTriangle size={20} /></span>
            <div><span>확인 필요</span><strong>{reviewCount}<small>명</small></strong></div>
          </div>
        </div>

        <div className="verificationFlow" aria-label="방문인증 진행 순서">
          <div className="flowIntro">
            <span><ShieldCheck size={18} /></span>
            <div><strong>자동 방문 인증</strong><small>예약 시간 전후 30분 · 매장 반경 100m</small></div>
          </div>
          <div className="flowStep done"><span>1</span><strong>QR 스캔</strong><Check size={15} /></div>
          <ChevronRight className="flowArrow" size={17} />
          <div className="flowStep done"><span>2</span><strong>GPS 확인</strong><Check size={15} /></div>
          <ChevronRight className="flowArrow" size={17} />
          <div className="flowStep active"><span>3</span><strong>방문시각 검증</strong><Clock3 size={15} /></div>
          <ChevronRight className="flowArrow" size={17} />
          <div className="flowStep"><span>4</span><strong>기록 저장</strong><CheckCircle2 size={15} /></div>
        </div>

        <div className="visitGrid">
          <section className="visitListPanel">
            <div className="visitListHeader">
              <div>
                <h2>오늘 방문자</h2>
                <p>2026년 7월 14일 · 총 {visits.length}명</p>
              </div>
              <label className="visitSearch">
                <Search size={16} />
                <input aria-label="방문자 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름 또는 캠페인 검색" />
              </label>
            </div>
            <div className="visitFilterTabs" aria-label="방문 상태 필터">
              {filters.map((item) => (
                <button key={item.value} className={filter === item.value ? "active" : ""} onClick={() => setFilter(item.value)}>
                  {item.label}
                  <span>{item.value === "all" ? visits.length : visits.filter((visit) => visit.status === item.value).length}</span>
                </button>
              ))}
            </div>
            <div className="visitList">
              {filteredVisits.map((visit) => (
                <button key={visit.id} className={selectedVisit?.id === visit.id ? "visitItem selected" : "visitItem"} onClick={() => setSelectedId(visit.id)}>
                  <span className={`avatar avatar${(visit.id % 4) + 1}`}>{visit.initial}</span>
                  <span className="visitIdentity"><strong>{visit.name}</strong><small>{visit.campaign}</small></span>
                  <span className="visitTime"><CalendarClock size={14} /> {visit.time}</span>
                  <span className={`visitStatus ${visit.status}`}>{statusLabels[visit.status]}</span>
                  <ChevronRight size={18} />
                </button>
              ))}
              {!filteredVisits.length && (
                <div className="visitEmpty"><Search size={26} /><strong>검색 결과가 없습니다</strong><span>다른 이름이나 상태를 선택해주세요.</span></div>
              )}
            </div>
          </section>

          <aside className="verificationPanel">
            {selectedVisit && (
              <>
                <div className="verificationHeader">
                  <div>
                    <span className={`visitStatus ${selectedVisit.status}`}>{statusLabels[selectedVisit.status]}</span>
                    <h2>{selectedVisit.name} 님</h2>
                    <p>{selectedVisit.time} 예약 · {selectedVisit.campaign}</p>
                  </div>
                  <button className="iconButton" aria-label="인증 정보 새로고침" onClick={refreshVisits}><RotateCcw size={17} /></button>
                </div>

                <div className="verificationSteps">
                  <h3>인증 진행 상태</h3>
                  <VerificationStep icon={<QrCode size={17} />} label="QR 코드 스캔" value={selectedVisit.qr ? "스캔 완료" : "대기 중"} complete={selectedVisit.qr} />
                  <VerificationStep icon={<LocateFixed size={17} />} label="GPS 위치 확인" value={selectedVisit.gps ? `매장과 ${selectedVisit.distance}m` : selectedVisit.distance ? `${selectedVisit.distance}m · 범위 밖` : "위치 대기"} complete={selectedVisit.gps} warning={selectedVisit.distance > 100} />
                  <VerificationStep icon={<Clock3 size={17} />} label="방문 시간 확인" value={selectedVisit.timeValid ? "예약 시간 내" : "확인 전"} complete={selectedVisit.timeValid} />
                  <VerificationStep icon={<ShieldCheck size={17} />} label="체크인 기록" value={selectedVisit.checkedAt ? `${selectedVisit.checkedAt} 저장` : "저장 대기"} complete={Boolean(selectedVisit.checkedAt)} />
                </div>

                <div className="locationSection">
                  <div className="sectionTitle"><h3>방문 위치</h3><span>허용 반경 100m</span></div>
                  <div className={selectedVisit.distance > 100 ? "locationMap warning" : "locationMap"}>
                    <span className="mapRoad horizontal" /><span className="mapRoad vertical" />
                    <span className="mapBlock blockOne" /><span className="mapBlock blockTwo" /><span className="mapBlock blockThree" />
                    <span className="storeRadius"><Store size={16} /></span>
                    <span className="visitorPin" style={{ transform: `translate(${Math.min(selectedVisit.distance / 3, 70)}px, ${selectedVisit.distance > 100 ? 28 : -18}px)` }}><MapPin size={18} /></span>
                    <span className="mapDistance">{selectedVisit.distance ? `${selectedVisit.distance}m` : "위치 대기"}</span>
                  </div>
                  <div className="coordinateRow"><span><Crosshair size={14} /> 위도 37.5446 · 경도 127.0559</span><strong className={selectedVisit.distance > 100 ? "dangerText" : "safeText"}>{selectedVisit.distance > 100 ? "허용 범위 밖" : "매장 범위 안"}</strong></div>
                </div>

                <div className="verificationActions">
                  {selectedVisit.status === "verified" ? (
                    <button className="verifiedButton" disabled><CheckCircle2 size={18} /> 방문 인증 완료</button>
                  ) : (
                    <button className="primaryButton" onClick={() => updateStatus("verified")}><UserCheck size={18} /> 방문 확인</button>
                  )}
                  <button className="secondaryButton flagButton" onClick={() => updateStatus("review")}><AlertTriangle size={17} /> 확인 필요</button>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      <button className="helpButton" aria-label="도움말"><CircleHelp size={22} /></button>

      {qrOpen && (
        <div className="modalBackdrop" role="presentation" onMouseDown={() => setQrOpen(false)}>
          <div className="modal qrModal" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modalHeader">
              <div><p className="eyebrow">STORE CHECK-IN</p><h2 id="qr-modal-title">매장 방문 QR</h2></div>
              <button className="iconButton" aria-label="닫기" onClick={() => setQrOpen(false)}><X size={20} /></button>
            </div>
            <div className="qrContent">
              <div className="qrVisual" aria-label={`오브서울 성수점 체크인 QR ${qrVersion}`}>
                <QrCode size={160} strokeWidth={1.7} />
                <span className="qrLogo">줄서</span>
              </div>
              <div><strong>오브서울 성수점</strong><span>체험단원이 QR을 스캔하면 GPS 확인이 시작됩니다.</span></div>
              <div className="qrMeta"><span><Smartphone size={14} /> 오늘 체크인 전용</span><span>버전 {qrVersion}</span></div>
              <button className="secondaryButton qrRenewButton" onClick={() => setQrVersion((version) => version + 1)}><RefreshCw size={16} /> 새 QR 발급</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status"><CheckCircle2 size={18} /> {toast}</div>}
    </main>
  );
}

type VerificationStepProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  complete: boolean;
  warning?: boolean;
};

function VerificationStep({ icon, label, value, complete, warning = false }: VerificationStepProps) {
  return (
    <div className={warning ? "verificationStep warning" : complete ? "verificationStep complete" : "verificationStep"}>
      <span className="stepIcon">{icon}</span>
      <div><strong>{label}</strong><span>{value}</span></div>
      {warning ? <AlertTriangle size={17} /> : complete ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}
    </div>
  );
}
