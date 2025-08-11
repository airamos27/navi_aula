import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { supabaseService } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = LoginSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

  // Admin por variables de entorno
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD ?? "";
  if (adminEmail && email === adminEmail) {
    if (password !== adminPass) return NextResponse.json({ error: "Credenciales de admin inválidas" }, { status: 401 });
    const token = await signToken({ sub: email, role: "admin" });
    const res = NextResponse.json({ ok: true, role: "admin" as const });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  // Usuario normal: valida contra BD
  const db = supabaseService();
  const { data, error } = await db.from("users").select("password_hash").eq("email", email).single();
  if (error || !data) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });

  const ok = await bcrypt.compare((password), (data as { password_hash: string }).password_hash);
  if (!ok) return NextResponse.json({ error: "Contraseña inválida" }, { status: 401 });

  const token = await signToken({ sub: email, role: "user" });
  const res = NextResponse.json({ ok: true, role: "user" as const });
  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
