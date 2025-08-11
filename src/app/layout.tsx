import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import ClientToaster from "@/components/ClientToaster";

export const metadata: Metadata = {
  title: "Navi Aula",
  description: "Pilot",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = store.getAll().find((c) => c.name === "session");
  const token = session?.value ?? "";
  const payload = token ? await verifyToken(token) : null;

  return (
    <html lang="es">
      <body>
        <header className="border-b">
          <div className="max-w-5xl mx-auto flex items-center gap-4 p-3">
            <Link href="/" className="font-semibold">Navi Aula</Link>
            <Link href="/courses">Courses</Link>
            {payload ? (
              <>
                <Link href="/private/my-courses">Mis cursos</Link>
                <Link href="/private/profile/me">Mi perfil</Link>
                {payload.role === "admin" && <Link href="/admin/courses">Admin</Link>}
                <form action="/api/logout" method="post" className="ml-auto">
                  <button className="border px-3 py-1 rounded">Salir</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="ml-auto">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6">{children}</main>

        {/* Toaster (cliente) */}
        <ClientToaster />
      </body>
    </html>
  );
}
