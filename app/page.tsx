"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Link2,
  MapPin,
  Plus,
  RefreshCw,
  Settings2,
  Store,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

type SlotStatus = "available" | "almost" | "full";

type Slot = {
  id: number;
  date: string;
  time: string;
  booked: number;
  capacity: number;
  status: SlotStatus;
  synced: boolean;
};

const days = [
  { key: "2026-07-13", weekday: "월", day: "13" },
  { key: "2026-07-14", weekday: "화", day: "14", today: true },
  { key: "2026-07-15", weekday: "수", day: "15" },
  { key: "2026-07-16", weekday: "목", day: "16" },
  { key: "2026-07-17", weekday: "금", day: "17" },
  { key: "2026-07-18", weekday: "토", day: "18" },
  { key: "2026-07-19", weekday: "일", day: "19" },
];

const initialSlots: Slot[] = [
  { id: 1, date: "2026-07-14", time: "11:30", booked: 2, capacity: 4, status: "available", synced: true },
  { id: 2, date: "2026-07-14", time: "14:00", booked: 1, capacity: 4, status: "available", synced: true },
  { id: 3, date: "2026-07-14", time: "15:30", booked: 3, capacity: 4, status: "almost", synced: true },
  { id: 4, date: "2026-07-14", time: "17:00", booked: 4, capacity: 4, status: "full", synced: false },
  { id: 5, date: "2026-07-14", time: "18:30", booked: 2, capacity: 2, status: "full", synced: true },
  { id: 6, date: "2026-07-15", time: "14:00", booked: 0, capacity: 4, status: "available", synced: true },
];

const statusText: Record<SlotStatus, string> = {
  available: "예약 가능",
  almost: "마감 임박",
  full: "예약 마감",
};

export default function BookingSlotsPage() {
  const [selectedDate, setSelectedDate] = useState("2026-07-14");
  const [filter, setFilter] = useState<"all" | SlotStatus>("all");
  const [slots, setSlots] = useState(initialSlots);
  const [selectedSlotId, setSelectedSlotId] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const visibleSlots = useMemo(
    () => slots.filter((slot) => slot.date === selectedDate && (filter === "all" || slot.status === filter)),
    [filter, selectedDate, slots],
  );

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? visibleSlots[0];
  const totalCapacity = slots.filter((slot) => slot.date === selectedDate).reduce((sum, slot) => sum + slot.capacity, 0);
  const totalBooked = slots.filter((slot) => slot.date === selectedDate).reduce((sum, slot) => sum + slot.booked, 0);

  function handleSync() {
    setIsSyncing(true);
    window.setTimeout(() => setIsSyncing(false), 900);
  }

  function handleCreateSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const capacity = Number(form.get("capacity"));
    const nextSlot: Slot = {
      id: Date.now(),
      date: String(form.get("date")),
      time: String(form.get("time")),
      booked: 0,
      capacity,
      status: "available",
      synced: form.get("synced") === "on",
    };
    setSlots((current) => [...current, nextSlot]);
    setSelectedDate(nextSlot.date);
    setSelectedSlotId(nextSlot.id);
    setIsModalOpen(false);
  }

  return (
    <main>
      <SiteHeader active="예약슬롯" notice="예약 연동 후 슬롯 현황이 자동으로 업데이트됩니다." />

      <section className="workspace pageWidth">
        <div className="titleRow">
          <div>
            <p className="eyebrow">BOOKING SLOTS</p>
            <h1>예약슬롯</h1>
            <p className="pageDescription">한산 시간대의 방문 가능 인원과 예약 현황을 관리합니다.</p>
          </div>
          <div className="titleActions">
            <button className="secondaryButton" onClick={handleSync} disabled={isSyncing}>
              <RefreshCw size={17} className={isSyncing ? "spin" : ""} />
              {isSyncing ? "동기화 중" : "예약 동기화"}
            </button>
            <button className="primaryButton" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> 새 슬롯
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
          <span className="syncBadge"><Link2 size={14} /> 네이버예약 연동</span>
        </div>

        <div className="metrics" aria-label="예약 요약">
          <div className="metric">
            <span className="metricIcon blue"><CalendarDays size={20} /></span>
            <div><span>오늘 슬롯</span><strong>{slots.filter((slot) => slot.date === selectedDate).length}<small>개</small></strong></div>
          </div>
          <div className="metric">
            <span className="metricIcon green"><Users size={20} /></span>
            <div><span>예약 인원</span><strong>{totalBooked}<small> / {totalCapacity}명</small></strong></div>
          </div>
          <div className="metric">
            <span className="metricIcon amber"><Clock3 size={20} /></span>
            <div><span>남은 자리</span><strong>{totalCapacity - totalBooked}<small>석</small></strong></div>
          </div>
          <div className="metric">
            <span className="metricIcon coral"><Check size={20} /></span>
            <div><span>예약률</span><strong>{totalCapacity ? Math.round((totalBooked / totalCapacity) * 100) : 0}<small>%</small></strong></div>
          </div>
        </div>

        <div className="dateSection">
          <div className="dateToolbar">
            <div className="monthControl">
              <button className="iconButton" aria-label="이전 주"><ChevronLeft size={19} /></button>
              <strong>2026년 7월</strong>
              <button className="iconButton" aria-label="다음 주"><ChevronRight size={19} /></button>
              <button className="todayButton" onClick={() => setSelectedDate("2026-07-14")}>오늘</button>
            </div>
            <span className="updatedAt"><RefreshCw size={13} /> 방금 전 업데이트</span>
          </div>
          <div className="weekPicker">
            {days.map((day) => (
              <button key={day.key} className={selectedDate === day.key ? "day selected" : "day"} onClick={() => setSelectedDate(day.key)}>
                <span>{day.weekday}</span>
                <strong>{day.day}</strong>
                {day.today && <i>오늘</i>}
              </button>
            ))}
          </div>
        </div>

        <div className="contentGrid">
          <section className="slotPanel">
            <div className="panelHeader">
              <div>
                <h2>7월 {Number(selectedDate.slice(-2))}일 예약 현황</h2>
                <p>슬롯을 선택하면 상세 예약 정보를 볼 수 있습니다.</p>
              </div>
              <div className="filterTabs" aria-label="슬롯 필터">
                {(["all", "available", "full"] as const).map((value) => (
                  <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>
                    {value === "all" ? "전체" : value === "available" ? "예약 가능" : "마감"}
                  </button>
                ))}
              </div>
            </div>

            <div className="slotList">
              {visibleSlots.length ? visibleSlots.map((slot) => {
                const fill = Math.round((slot.booked / slot.capacity) * 100);
                return (
                  <button key={slot.id} className={selectedSlot?.id === slot.id ? "slotItem selected" : "slotItem"} onClick={() => setSelectedSlotId(slot.id)}>
                    <span className={`statusDot ${slot.status}`} />
                    <strong className="slotTime">{slot.time}</strong>
                    <div className="slotProgress">
                      <div className="slotMeta">
                        <span>{statusText[slot.status]}</span>
                        <span>{slot.booked}/{slot.capacity}명</span>
                      </div>
                      <div className="progressTrack"><span style={{ width: `${fill}%` }} /></div>
                    </div>
                    <span className={slot.synced ? "sourceBadge linked" : "sourceBadge manual"}>
                      {slot.synced ? <Link2 size={13} /> : <Settings2 size={13} />}
                      {slot.synced ? "예약 연동" : "직접 등록"}
                    </span>
                    <ChevronRight className="slotArrow" size={18} />
                  </button>
                );
              }) : (
                <div className="emptyState">
                  <CalendarDays size={28} />
                  <strong>등록된 슬롯이 없습니다</strong>
                  <p>선택한 날짜에 방문 가능한 시간을 추가하세요.</p>
                  <button className="secondaryButton" onClick={() => setIsModalOpen(true)}><Plus size={17} /> 슬롯 추가</button>
                </div>
              )}
            </div>
          </section>

          <aside className="detailPanel">
            {selectedSlot ? (
              <>
                <div className="detailHeader">
                  <div>
                    <span className={`statusLabel ${selectedSlot.status}`}>{statusText[selectedSlot.status]}</span>
                    <h2>{selectedSlot.time} 슬롯</h2>
                  </div>
                  <button className="iconButton" aria-label="슬롯 설정"><Settings2 size={18} /></button>
                </div>
                <div className="capacityVisual">
                  <div className="capacityRing" style={{ "--percent": `${Math.round((selectedSlot.booked / selectedSlot.capacity) * 100) * 3.6}deg` } as React.CSSProperties}>
                    <div><strong>{selectedSlot.booked}</strong><span>/{selectedSlot.capacity}명</span></div>
                  </div>
                  <div>
                    <strong>{selectedSlot.capacity - selectedSlot.booked}자리 남음</strong>
                    <span>현재 예약률 {Math.round((selectedSlot.booked / selectedSlot.capacity) * 100)}%</span>
                  </div>
                </div>
                <div className="detailRows">
                  <div><span>방문 날짜</span><strong>2026. 7. {Number(selectedSlot.date.slice(-2))}</strong></div>
                  <div><span>체험 시간</span><strong>{selectedSlot.time} - {addMinutes(selectedSlot.time, 90)}</strong></div>
                  <div><span>예약 방식</span><strong>{selectedSlot.synced ? "네이버예약 연동" : "직접 등록"}</strong></div>
                </div>
                <div className="guestSection">
                  <div className="guestTitle"><strong>예약 체험단</strong><span>{selectedSlot.booked}명</span></div>
                  {Array.from({ length: selectedSlot.booked }).map((_, index) => (
                    <div className="guest" key={index}>
                      <span className={`avatar avatar${index + 1}`}>{["김", "이", "박", "최"][index]}</span>
                      <div><strong>{["김하늘", "이서준", "박지민", "최유나"][index]}</strong><span>체험단 예약 확정</span></div>
                      <span className="confirmed"><Check size={13} /> 확정</span>
                    </div>
                  ))}
                  {!selectedSlot.booked && <p className="noGuests">아직 예약한 체험단이 없습니다.</p>}
                </div>
                <button className="detailAction">예약자 전체 보기 <ChevronRight size={16} /></button>
              </>
            ) : <div className="emptyDetail">슬롯을 선택해주세요.</div>}
          </aside>
        </div>
      </section>

      <button className="helpButton" aria-label="도움말"><CircleHelp size={22} /></button>

      {isModalOpen && (
        <div className="modalBackdrop" role="presentation" onMouseDown={() => setIsModalOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="slot-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modalHeader">
              <div><p className="eyebrow">NEW BOOKING SLOT</p><h2 id="slot-modal-title">새 예약슬롯</h2></div>
              <button className="iconButton" aria-label="닫기" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSlot}>
              <label>방문 날짜<input name="date" type="date" defaultValue={selectedDate} min="2026-07-13" required /></label>
              <div className="formRow">
                <label>시작 시간<input name="time" type="time" defaultValue="14:00" required /></label>
                <label>가능 인원<input name="capacity" type="number" defaultValue="4" min="1" max="20" required /></label>
              </div>
              <label className="checkRow"><input name="synced" type="checkbox" defaultChecked /><span><strong>네이버예약과 연동</strong><small>예약이 들어오면 남은 자리가 자동 반영됩니다.</small></span></label>
              <div className="modalActions">
                <button type="button" className="secondaryButton" onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit" className="primaryButton"><Plus size={17} /> 슬롯 등록</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function addMinutes(time: string, minutes: number) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, hour, minute + minutes);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
