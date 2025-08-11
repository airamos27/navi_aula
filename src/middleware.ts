import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
const issuer = "navi-aula";
const audience = "navi-aula";

function readSession(req: NextRequest): string {
  const cookieHeader = req.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === "session") return rest.join("=");
  }
  return "";
}

export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;

  if (p.startsWith("/private") || p.startsWith("/admin")) {
    const token = readSession(req);
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const { payload } = await jwtVerify(token, secretKey, { issuer, audience });
      const role = (payload as { role?: "user" | "admin" }).role;
      if (p.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/private/:path*", "/admin/:path*"] };
