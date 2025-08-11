import { NextResponse } from "next/server";
import { supabaseAnon, supabaseService } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const BodySchema = z.object({
  courseId: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
}).refine(v => v.courseId || v.slug, { message: "courseId o slug requerido" });

type RowId = { id: string };

async function getUserEmailFromCookie(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  let token = "";
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === "session") token = rest.join("=");
  }
  if (!token) return null;
  const payload = await verifyToken(token);
  const email = typeof payload?.sub === "string" ? payload.sub : null;
  return email && email.length > 0 ? email : null;
}

async function resolveCourseIdBySlug(slug: string): Promise<string | null> {
  const db = supabaseAnon();
  const { data } = await db.from("courses").select("id").eq("slug", slug).single();
  const row = data as RowId | null;
  return row?.id ?? null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  let courseId: string | null = null;
  let slug: string | null = null;
  for (const [k, v] of url.searchParams.entries()) {
    if (k === "courseId") courseId = v;
    if (k === "slug") slug = v;
  }

  const email = await getUserEmailFromCookie(req);
  if (!email) return NextResponse.json({ enrolled: false }, { status: 200 });

  const id = courseId ?? (slug ? await resolveCourseIdBySlug(slug) : null);
  if (!id) return NextResponse.json({ enrolled: false }, { status: 200 });

  const db = supabaseService();
  const { data } = await db
    .from("enrollments")
    .select("id")
    .eq("user_email", email)
    .eq("course_id", id)
    .maybeSingle();

  const row = data as RowId | null;
  return NextResponse.json({ enrolled: !!row });
}

export async function POST(req: Request) {
  const email = await getUserEmailFromCookie(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const id = parsed.data.courseId ?? (parsed.data.slug ? await resolveCourseIdBySlug(parsed.data.slug) : null);
  if (!id) return NextResponse.json({ error: "Curso no encontrado" }, { status: 400 });

  const db = supabaseService();
  const { error } = await db.from("enrollments").insert([{ user_email: email, course_id: id }]);
  if (error && error.code !== "23505") return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const email = await getUserEmailFromCookie(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const id = parsed.data.courseId ?? (parsed.data.slug ? await resolveCourseIdBySlug(parsed.data.slug) : null);
  if (!id) return NextResponse.json({ error: "Curso no encontrado" }, { status: 400 });

  const db = supabaseService();
  const { error } = await db.from("enrollments").delete().eq("user_email", email).eq("course_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
