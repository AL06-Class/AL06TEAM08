export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type CheckinSettings = {
  radiusMeters: number;
  startMinutesBefore: number;
  endMinutesAfter: number;
  maxGpsAccuracyMeters: number;
};

export type CheckinInput = {
  userId: string;
  participantId: string;
  reservationDate: string;
  reservationTime: string;
  now: string;
  userLocation: Coordinate;
  storeLocation: Coordinate;
  gpsAccuracy: number;
  alreadyCheckedIn: boolean;
  cancelled: boolean;
  selectedParticipant: boolean;
  locationPermissionGranted: boolean;
  settings: CheckinSettings;
};

export function calculateDistanceMeters(from: Coordinate, to: Coordinate) {
  const earthRadiusMeters = 6371000;
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(deltaLongitude / 2) ** 2;

  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
}

export function isWithinReservationWindow(input: Pick<CheckinInput, "reservationDate" | "reservationTime" | "now" | "settings">) {
  const now = new Date(input.now);
  const reservation = new Date(`${input.reservationDate}T${input.reservationTime}:00+09:00`);
  const start = new Date(reservation.getTime() - input.settings.startMinutesBefore * 60 * 1000);
  const end = new Date(reservation.getTime() + input.settings.endMinutesAfter * 60 * 1000);

  return now >= start && now <= end;
}

export function validateCheckin(input: CheckinInput) {
  const distance = calculateDistanceMeters(input.userLocation, input.storeLocation);
  const reasons: string[] = [];

  if (!input.locationPermissionGranted) reasons.push("위치 권한이 필요합니다.");
  if (!input.selectedParticipant || input.userId !== input.participantId) reasons.push("선정된 체험단 본인만 체크인할 수 있습니다.");
  if (input.cancelled) reasons.push("취소된 참여 건입니다.");
  if (input.alreadyCheckedIn) reasons.push("이미 체크인된 예약입니다.");
  if (!isWithinReservationWindow(input)) reasons.push("체크인 가능한 시간이 아닙니다.");
  if (distance > input.settings.radiusMeters) reasons.push(`매장에서 ${distance}m 떨어져 있습니다.`);
  if (input.gpsAccuracy > input.settings.maxGpsAccuracyMeters) reasons.push("GPS 정확도가 낮습니다.");

  return {
    approved: reasons.length === 0,
    distance,
    suspiciousLocation: input.gpsAccuracy > input.settings.maxGpsAccuracyMeters || distance > input.settings.radiusMeters,
    reasons,
  };
}
