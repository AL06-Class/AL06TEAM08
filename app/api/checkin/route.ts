import { NextResponse } from "next/server";
import { validateCheckin, type CheckinInput } from "@/lib/checkin";

type SavedCheckin = {
  id: string;
  participantId: string;
  distance: number;
  checkedInAt: string;
  ipAddress: string;
  userAgent: string;
  suspiciousLocation: boolean;
};

const savedCheckins: SavedCheckin[] = [];

export async function POST(request: Request) {
  const input = await request.json() as CheckinInput;
  const result = validateCheckin(input);

  if (!result.approved) {
    return NextResponse.json({ ok: false, ...result }, { status: 400 });
  }

  const headers = request.headers;
  const saved: SavedCheckin = {
    id: `checkin-${Date.now()}`,
    participantId: input.participantId,
    distance: result.distance,
    checkedInAt: new Date().toISOString(),
    ipAddress: headers.get("x-forwarded-for") ?? "local",
    userAgent: headers.get("user-agent") ?? "unknown",
    suspiciousLocation: result.suspiciousLocation,
  };

  savedCheckins.push(saved);

  return NextResponse.json({ ok: true, checkin: saved, distance: result.distance });
}
