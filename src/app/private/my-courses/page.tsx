import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabaseAnon } from "@/lib/supabase";

type CourseMini = { id: string; slug: string; title: string; description: string | null };
type Row = { courses: CourseMini | null };

export default async function Page() {
  const store = await cookies();
  const session = store.getAll().find(c => c.name === "session");
  const token = session?.value ?? "";
  const payload = token ? await verifyToken(token) : null;
  const email = typeof payload?.sub === "string" ? payload.sub : null;

  if (!email) return <div className="p-6">Sin sesión</div>;

  const db = supabaseAnon();
  const { data } = await db
    .from("enrollments")
    .select("courses(id,slug,title,description)")
    .eq("user_email", email)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];
  const list = rows.map(r => r.courses).filter((c): c is CourseMini => Boolean(c));

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl">Mis cursos</h1>
      <ul className="space-y-2">
        {list.map(c => (
          <li key={c.id}>
            <Link href={`/courses/${c.slug}`} className="underline">{c.title}</Link>
            {c.description && <div className="text-sm opacity-80">{c.description}</div>}
          </li>
        ))}
        {list.length === 0 && <li>Aún no estás inscrito en ningún curso.</li>}
      </ul>
    </div>
  );
}
