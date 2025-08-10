import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "");
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  let role: "user" | "admin" = "user";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (adminEmail && email === adminEmail) {
    if (!adminPass || password !== adminPass) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }
    role = "admin";
  }

  const token = await signToken({ sub: email, role });
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
