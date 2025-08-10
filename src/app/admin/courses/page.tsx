import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.getAll().find(c => c.name === "session");
  const token = sessionCookie?.value ?? "";
  const payload = token ? await verifyToken(token) : null;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl">Admin / Courses</h1>
      <div>Usuario: <b>{payload?.sub ?? "—"}</b> | Rol: <b>{payload?.role ?? "—"}</b></div>
      <Link href="/admin/courses/new" className="underline">New course</Link>
      <ul className="list-disc pl-6">
        <li>Listado (placeholder)</li>
      </ul>
      <form action="/api/logout" method="post">
        <button className="border px-4 py-2 mt-2">Cerrar sesión</button>
      </form>
    </div>
  );
}
