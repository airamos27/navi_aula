import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { revalidateTag } from "next/cache";
import { verifyToken } from "@/lib/auth";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  // validar sesión admin
  const cookie = (req.headers.get("cookie") ?? "")
    .split(";")
    .map(v => v.trim().split("="))
    .find(([k]) => k === "session");
  const token = cookie?.[1] ?? "";

  const payload = token ? await verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as {title?:string;description?:string;videoUrl?:string;slug?:string}));
  const title = (body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

  const slug = body.slug ? slugify(body.slug) : slugify(title);
  const description = body.description?.trim() ?? null;
  const video_url = body.videoUrl?.trim() ?? null;

  const db = supabaseService();
  const { error } = await db.from("courses").insert([{ slug, title, description, video_url, published: true }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // invalida caché de /courses
  revalidateTag("courses");
  return NextResponse.json({ ok: true, slug });
}
