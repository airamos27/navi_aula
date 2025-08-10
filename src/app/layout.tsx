import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Navi Aula",
  description: "Pilot",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.getAll().find(c => c.name === "session");
  const token = sessionCookie?.value ?? "";
  const payload = token ? await verifyToken(token) : null;

  return (
    <html lang="es">
      <body>
        <header className="flex items-center gap-3 border-b p-3">
          <Link href="/" className="font-semibold">Navi Aula</Link>
          <Link href="/courses">Courses</Link>
          {payload ? (
            <>
              <Link href="/private/profile/me">Mi perfil</Link>
              {payload.role === "admin" && <Link href="/admin/courses">Admin</Link>}
              <form action="/api/logout" method="post" className="ml-auto">
                <button className="border px-3 py-1">Salir</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="ml-auto">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
