import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.getAll().find(c => c.name === "session");
  const token = sessionCookie?.value ?? "";
  const payload = token ? await verifyToken(token) : null;

  if (!payload) return <div className="p-6">Sin sesión</div>;

  return (
    <div className="p-6 space-y-2">
      <div>Hola: <b>{String(payload.sub)}</b></div>
      <div>Rol: <b>{String(payload.role)}</b></div>
      <form action="/api/logout" method="post" className="mt-4">
        <button className="border px-4 py-2">Cerrar sesión</button>
      </form>
    </div>
  );
}
