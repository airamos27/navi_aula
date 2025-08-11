import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 font-sans">
      <header className="w-full py-8 flex flex-col items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <Image src="/next.svg" alt="Logo" width={120} height={40} className="mb-2 dark:invert" />
        <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">Bienvenido a Navi Aula</h1>
        <p className="mt-2 text-lg font-medium opacity-90">Tu plataforma moderna para cursos y aprendizaje online</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-12">
        <section className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-2xl w-full flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">Explora, aprende y crece</h2>
          <p className="mb-6 text-gray-700">Accede a cursos de calidad, gestiona tu progreso y forma parte de una comunidad educativa innovadora.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Crear cuenta</a>
            <a href="/login" className="bg-white border-2 border-blue-600 text-blue-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-50 transition">Iniciar sesión</a>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/file.svg" alt="Cursos" width={40} height={40} className="mb-2" />
            <h3 className="font-semibold text-lg mb-1 text-blue-700">Cursos actualizados</h3>
            <p className="text-gray-600 text-sm">Contenido relevante y en constante crecimiento para que nunca dejes de aprender.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/window.svg" alt="Interfaz" width={40} height={40} className="mb-2" />
            <h3 className="font-semibold text-lg mb-1 text-blue-700">Interfaz amigable</h3>
            <p className="text-gray-600 text-sm">Navegación sencilla, rápida y adaptada a cualquier dispositivo.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Image src="/globe.svg" alt="Comunidad" width={40} height={40} className="mb-2" />
            <h3 className="font-semibold text-lg mb-1 text-blue-700">Comunidad global</h3>
            <p className="text-gray-600 text-sm">Conecta con estudiantes y docentes de todo el mundo.</p>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 flex flex-col items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Navi Aula. Todos los derechos reservados.</p>
        <div className="flex gap-6 mt-2">
          <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">Next.js</a>
          <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Vercel</a>
        </div>
      </footer>
    </div>
  );
}
