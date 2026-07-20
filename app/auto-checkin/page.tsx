"use client";

import {
  AlertTriangle,
  CalendarClock,
  Camera,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Crosshair,
  FileText,
  History,
  LocateFixed,
  MapPin,
  MessageSquare,
  Navigation,
  QrCode,
  ReceiptText,
  RefreshCw,
  Send,
  Settings2,
  ShieldCheck,
  Store,
  User,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { calculateDistanceMeters, isWithinReservationWindow } from "@/lib/checkin";

type Scenario = "near" | "far" | "noPermission" | "lowAccuracy" | "wrongTime";
type CheckinStatus = "ready" | "blocked" | "permission" | "accuracy" | "done";
type ReviewStatus = "none" | "pending" | "approved";

const storeLocation = { latitude: 37.5446, longitude: 127.0559 };
const settings = {
  radiusMeters: 100,
  startMinutesBefore: 30,
  endMinutesAfter: 30,
  maxGpsAccuracyMeters: 100,
};

const reservation = {
  userId: "user-yeeun",
  participantId: "user-yeeun",
  storeName: "오브서울 성수점",
  benefit: "2인 브런치 세트와 시그니처 음료",
  reservationDate: "2026-07-20",
  reservationTime: "14:00",
  address: "서울 성동구 연무장길 24",
  participantName: "위예은",
};

const scenarios: Record<Scenario, { label: string; now: string; location: typeof storeLocation; accuracy: number; permission: boolean }> = {
  near: { label: "매장 근처", now: "2026-07-20T13:48:00+09:00", location: { latitude: 37.54455, longitude: 127.05605 }, accuracy: 24, permission: true },
  far: { label: "반경 밖", now: "2026-07-20T13:48:00+09:00", location: { latitude: 37.5482, longitude: 127.0588 }, accuracy: 34, permission: true },
  noPermission: { label: "권한 거부", now: "2026-07-20T13:48:00+09:00", location: { latitude: 37.54455, longitude: 127.05605 }, accuracy: 24, permission: false },
  lowAccuracy: { label: "GPS 부정확", now: "2026-07-20T13:48:00+09:00", location: { latitude: 37.54455, longitude: 127.05605 }, accuracy: 156, permission: true },
  wrongTime: { label: "예약 시간 아님", now: "2026-07-20T11:12:00+09:00", location: { latitude: 37.54455, longitude: 127.05605 }, accuracy: 24, permission: true },
};

export default function AutoCheckinPage() {
  const [scenario, setScenario] = useState<Scenario>("near");
  const [agreed, setAgreed] = useState(true);
  const [qrRequired, setQrRequired] = useState(true);
  const [qrScanned, setQrScanned] = useState(false);
  const [checking, setChecking] = useState(false);
  const [completedAt, setCompletedAt] = useState("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("none");
  const [manualReason, setManualReason] = useState("위치 권한이 꺼져 있어 매장 내부 사진과 영수증으로 확인 요청합니다.");
  const current = scenarios[scenario];

  const distance = useMemo(() => calculateDistanceMeters(current.location, storeLocation), [current.location]);
  const inTime = isWithinReservationWindow({
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    now: current.now,
    settings,
  });

  const status: CheckinStatus = completedAt
    ? "done"
    : !current.permission
      ? "permission"
      : current.accuracy > settings.maxGpsAccuracyMeters
        ? "accuracy"
        : distance <= settings.radiusMeters && inTime && agreed && (!qrRequired || qrScanned)
          ? "ready"
          : "blocked";

  const statusCopy = {
    ready: {
      icon: <CheckCircle2 size={22} />,
      title: "체크인 가능",
      message: "현재 매장 근처에 있습니다. 자동 체크인이 가능합니다.",
    },
    blocked: {
      icon: <XCircle size={22} />,
      title: "체크인 불가",
      message: !agreed
        ? "위치 정보 이용 동의가 필요합니다."
        : qrRequired && !qrScanned && distance <= settings.radiusMeters && inTime
          ? "매장 QR을 스캔하면 체크인 버튼이 활성화됩니다."
          : inTime
            ? `현재 매장에서 ${distance}m 떨어져 있습니다. 반경 100m 안으로 이동해주세요.`
            : "예약 시간 전후 30분 안에만 체크인할 수 있습니다.",
    },
    permission: {
      icon: <MapPin size={22} />,
      title: "위치 권한 필요",
      message: "자동 체크인을 위해 위치 권한이 필요합니다.",
    },
    accuracy: {
      icon: <AlertTriangle size={22} />,
      title: "GPS 확인 필요",
      message: "현재 위치 정확도가 낮습니다. 창가나 건물 밖에서 다시 시도해주세요.",
    },
    done: {
      icon: <ShieldCheck size={22} />,
      title: "체크인 완료",
      message: "체크인이 저장되었습니다. 이제 체험을 시작하시면 됩니다.",
    },
  }[status];

  async function requestCheckin() {
    setChecking(true);
    const response = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...reservation,
        now: current.now,
        userLocation: current.location,
        storeLocation,
        gpsAccuracy: current.accuracy,
        alreadyCheckedIn: Boolean(completedAt),
        cancelled: false,
        selectedParticipant: true,
        locationPermissionGranted: current.permission,
        settings,
        qrRequired,
        qrScanned,
      }),
    });

    setChecking(false);

    if (response.ok) {
      setCompletedAt("13:49");
    }
  }

  function submitManualRequest() {
    setReviewStatus("pending");
  }

  function approveManualRequest() {
    setReviewStatus("approved");
    setCompletedAt("13:55");
  }

  return (
    <main>
      <SiteHeader active="자동체크인" notice="GPS 위치 확인 MVP가 추가되었습니다." />

      <section className="checkinShell">
        <div className="mobileCheckin">
          <header className="checkinHero">
            <div>
              <p className="eyebrow">줄서팀 자동 체크인</p>
              <h1>GPS 자동 체크인</h1>
              <p>직원 확인 없이 매장 근처에서 직접 체크인합니다.</p>
            </div>
            <span className={`checkinState ${status}`}>{statusCopy.icon}{statusCopy.title}</span>
          </header>

          <section className="trustStrip" aria-label="체크인 조건">
            <Condition checked={current.permission} label="위치 권한" />
            <Condition checked={inTime} label="예약 시간" />
            <Condition checked={distance <= settings.radiusMeters} label="100m 이내" />
            <Condition checked={current.accuracy <= settings.maxGpsAccuracyMeters} label="GPS 정확도" />
            <Condition checked={!qrRequired || qrScanned} label="QR 확인" />
          </section>

          <section className="visitCard">
            <div className="storePhoto">
              <span><Store size={30} /></span>
              <strong>{reservation.storeName}</strong>
            </div>
            <div className="visitInfo">
              <InfoRow icon={<User size={16} />} label="참여자" value={reservation.participantName} />
              <InfoRow icon={<FileText size={16} />} label="제공 서비스" value={reservation.benefit} />
              <InfoRow icon={<CalendarClock size={16} />} label="예약 날짜" value="2026년 7월 20일" />
              <InfoRow icon={<Clock3 size={16} />} label="예약 시간" value="14:00" />
              <InfoRow icon={<MapPin size={16} />} label="매장 주소" value={reservation.address} />
            </div>
          </section>

          <section className="mapCard">
            <div className="mockMap">
              <span className="mapRoad horizontal" /><span className="mapRoad vertical" />
              <span className="mapBlock blockOne" /><span className="mapBlock blockTwo" /><span className="mapBlock blockThree" />
              <span className="checkinRadius"><Store size={16} /></span>
              <span className="userDot" style={{ transform: `translate(${Math.min(distance / 3, 86)}px, ${distance > 100 ? 42 : -24}px)` }}><Navigation size={18} /></span>
              <span className="distancePill">매장과 {distance}m</span>
            </div>
            <div className="mapStats">
              <span><Crosshair size={15} /> 허용 반경 {settings.radiusMeters}m</span>
              <span><LocateFixed size={15} /> GPS 정확도 {current.accuracy}m</span>
            </div>
          </section>

          <section className="qrCheckCard">
            <div>
              <span><QrCode size={18} /></span>
              <div>
                <strong>GPS+QR 이중 확인</strong>
                <p>매장에 비치된 QR까지 확인하면 최종 체크인이 가능해집니다.</p>
              </div>
            </div>
            <label className="toggleLine">
              <input type="checkbox" checked={qrRequired} onChange={(event) => {
                setQrRequired(event.target.checked);
                setQrScanned(false);
                setCompletedAt("");
              }} />
              <span>QR 필수</span>
            </label>
            <button className={qrScanned ? "verifiedButton" : "secondaryButton"} onClick={() => setQrScanned(true)} disabled={!qrRequired}>
              <QrCode size={17} /> {qrScanned ? "QR 스캔 완료" : "매장 QR 스캔"}
            </button>
          </section>

          <section className={`decisionBox ${status}`}>
            {statusCopy.icon}
            <div>
              <strong>{statusCopy.title}</strong>
              <p>{statusCopy.message}</p>
            </div>
          </section>

          <div className="scenarioTabs" aria-label="테스트 상황">
            {(Object.keys(scenarios) as Scenario[]).map((key) => (
              <button key={key} className={scenario === key ? "active" : ""} onClick={() => {
                setScenario(key);
                setCompletedAt("");
              }}>
                {scenarios[key].label}
              </button>
            ))}
          </div>

          <section className="privacyBox">
            <label>
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span>자동 체크인을 위해 현재 위치를 1회 확인합니다. 위치 정보는 방문 확인 목적으로만 사용되며, 지속적으로 추적되지 않습니다.</span>
            </label>
          </section>

          {(status === "permission" || status === "accuracy" || reviewStatus !== "none") && (
            <section className="manualRequestCard">
              <div className="manualHeader">
                <span><Camera size={18} /></span>
                <div>
                  <strong>수동 체크인 요청</strong>
                  <p>사진, 영수증, 사장님 코드는 확인 대기로 저장됩니다.</p>
                </div>
              </div>
              <div className="evidenceGrid">
                <span><Camera size={16} /> 매장 내부 사진</span>
                <span><ReceiptText size={16} /> 영수증 사진</span>
                <span><ShieldCheck size={16} /> 사장님 코드 4821</span>
              </div>
              <textarea value={manualReason} onChange={(event) => setManualReason(event.target.value)} aria-label="수동 체크인 요청 사유" />
              <button className="secondaryButton" onClick={submitManualRequest} disabled={reviewStatus !== "none"}>
                <Send size={17} /> {reviewStatus === "none" ? "확인 요청 보내기" : "확인 대기 저장됨"}
              </button>
            </section>
          )}

          {status === "done" ? (
            <section className="completeBox">
              <CheckCircle2 size={38} />
              <strong>체크인 완료</strong>
              <p>{completedAt} · {reservation.storeName}</p>
              <button className="secondaryButton">체험 완료하기</button>
              <span>체험 후 리뷰 작성 요청이 안내됩니다.</span>
            </section>
          ) : (
            <div className="stickyAction">
              <button className="primaryButton bigCheckinButton" disabled={status !== "ready" || checking} onClick={requestCheckin}>
                {checking ? <RefreshCw className="spin" size={19} /> : <ShieldCheck size={20} />}
                현재 위치로 체크인하기
              </button>
              {(status === "permission" || status === "accuracy") && (
                <button className="secondaryButton manualButton" onClick={submitManualRequest}><Camera size={17} /> 수동 확인 요청</button>
              )}
            </div>
          )}
        </div>

        <aside className="ownerSnapshot">
          <div className="ownerTop">
            <h2>사장님 현황</h2>
            <button className="iconButton" aria-label="매장 설정"><Settings2 size={17} /></button>
          </div>
          <div className="ownerMetrics">
            <MiniMetric label="오늘 예약" value="8명" />
            <MiniMetric label="체크인 완료" value={completedAt ? "4명" : "3명"} />
            <MiniMetric label="미방문" value="4명" />
            <MiniMetric label="리뷰 완료" value="2명" />
          </div>
          <div className="ownerList">
            <OwnerRow name="위예은" status={completedAt ? "체크인 완료" : statusCopy.title} tone={status === "ready" || status === "done" ? "ok" : "warn"} />
            <OwnerRow name="김하늘" status="체크인 완료" tone="ok" />
            <OwnerRow name="박지민" status="방문 예정" tone="idle" />
            <OwnerRow name="최유나" status="위치 확인 실패" tone="danger" />
          </div>
          {reviewStatus !== "none" && (
            <div className="reviewQueue">
              <div>
                <strong>수동 요청 검토</strong>
                <p>위예은 · 위치 권한 제한 · 증빙 3개 제출</p>
              </div>
              {reviewStatus === "pending" ? (
                <button className="primaryButton" onClick={approveManualRequest}><CheckCircle2 size={17} /> 승인</button>
              ) : (
                <span className="approvedBadge"><CheckCircle2 size={16} /> 승인 완료</span>
              )}
            </div>
          )}
          <div className="securityPanel">
            <h3>부정 체크인 방지</h3>
            <SecurityRow label="서버 거리 재계산" state="정상" tone="ok" />
            <SecurityRow label="중복 체크인 차단" state={completedAt ? "차단 준비" : "대기"} tone="idle" />
            <SecurityRow label="GPS 정확도 기준" state={`${current.accuracy}m`} tone={current.accuracy > 100 ? "danger" : "ok"} />
            <SecurityRow label="위치 위조 의심" state={distance > 100 ? "검토" : "낮음"} tone={distance > 100 ? "warn" : "ok"} />
          </div>
          <div className="timelinePanel">
            <h3><History size={16} /> 알림·로그</h3>
            <LogRow text="방문 2시간 전 알림 발송 예정" />
            <LogRow text={qrScanned ? "매장 QR 스캔 완료" : "매장 QR 스캔 대기"} />
            <LogRow text={completedAt ? `${completedAt} 체크인 기록 저장` : "체크인 기록 저장 대기"} />
          </div>
          <div className="manualHelp">
            <CircleHelp size={17} />
            <p>권한 거부 시 사진, 영수증, 사장님 확인 코드로 수동 요청을 남길 수 있습니다.</p>
          </div>
          <div className="futureStack">
            <span><QrCode size={15} /> GPS+QR</span>
            <span><ReceiptText size={15} /> 수동 요청</span>
            <span><AlertTriangle size={15} /> 의심 기록</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="infoRow"><span>{icon}{label}</span><strong>{value}</strong></div>;
}

function Condition({ checked, label }: { checked: boolean; label: string }) {
  return <span className={checked ? "condition ok" : "condition wait"}>{checked ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{label}</span>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="miniMetric"><span>{label}</span><strong>{value}</strong></div>;
}

function OwnerRow({ name, status, tone }: { name: string; status: string; tone: "ok" | "warn" | "idle" | "danger" }) {
  return <div className="ownerRow"><strong>{name}</strong><span className={tone}>{status}</span></div>;
}

function SecurityRow({ label, state, tone }: { label: string; state: string; tone: "ok" | "warn" | "idle" | "danger" }) {
  return <div className="securityRow"><span>{label}</span><strong className={tone}>{state}</strong></div>;
}

function LogRow({ text }: { text: string }) {
  return <div className="logRow"><MessageSquare size={14} /><span>{text}</span></div>;
}
