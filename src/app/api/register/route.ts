import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const _data = await req.json().catch(() => ({}));
  // Demo sin BD
  return NextResponse.json({ ok: true });
}
