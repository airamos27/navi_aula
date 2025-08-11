import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { revalidateTag } from "next/cache";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const CourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(2000).optional(),
  videoUrl: z.string().url().optional(),
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readSessionCookie(req: Request): string {
  const cookieHeader = req.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === "session") return rest.join("=");
  }
  return "";
}

export async function POST(req: Request) {
  // Validar rol admin
  const token = readSessionCookie(req);
  const payload = token ? await verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validar body
  const json = await req.json().catch(() => ({}));
  const parsed = CourseSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const title = parsed.data.title;
  const slug = parsed.data.slug ? parsed.data.slug : slugify(title);
  const description = parsed.data.description ?? null;
  const video_url = parsed.data.videoUrl ?? null;

  const db = supabaseService();
  const { error } = await db.from("courses").insert([{ slug, title, description, video_url, published: true }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag("courses");
  return NextResponse.json({ ok: true, slug });
}
