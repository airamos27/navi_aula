import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAnon();
  const { data, error } = await db
    .from("courses")
    .select("id,slug,title,description,video_url,published,created_at,updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ courses: data });
}
