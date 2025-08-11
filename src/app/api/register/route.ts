import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = RegisterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email o contraseña inválidos" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const password_hash = await bcrypt.hash(password, 10);

  const db = supabaseService();
  const { error } = await db.from("users").insert([{ email: email.toLowerCase(), password_hash }]);

  if (error?.code === "23505") return NextResponse.json({ error: "Ese email ya está registrado" }, { status: 409 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
