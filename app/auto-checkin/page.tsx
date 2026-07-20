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
  LocateFixed,
  MapPin,
  Navigation,
  QrCode,
  ReceiptText,
  RefreshCw,
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
  const [checking, setChecking] = useState(false);
  const [completedAt, setCompletedAt] = useState("");
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
        : distance <= settings.radiusMeters && inTime && agreed
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
      message: inTime ? `현재 매장에서 ${distance}m 떨어져 있습니다. 반경 100m 안으로 이동해주세요.` : "예약 시간 전후 30분 안에만 체크인할 수 있습니다.",
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
      }),
    });

    setChecking(false);

    if (response.ok) {
      setCompletedAt("13:49");
    }
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
                <button className="secondaryButton manualButton"><Camera size={17} /> 수동 확인 요청</button>
              )}
            </div>
          )}
        </div>

        <aside className="ownerSnapshot">
          <h2>사장님 현황</h2>
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

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="miniMetric"><span>{label}</span><strong>{value}</strong></div>;
}

function OwnerRow({ name, status, tone }: { name: string; status: string; tone: "ok" | "warn" | "idle" | "danger" }) {
  return <div className="ownerRow"><strong>{name}</strong><span className={tone}>{status}</span></div>;
}
