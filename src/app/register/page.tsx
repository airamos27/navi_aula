"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk("");
    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setOk("Registro demo OK. Ahora inicia sesión.");
    setTimeout(()=> router.push("/login"), 800);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Registro</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="border px-4 py-2">Crear cuenta</button>
      </form>
      {ok && <p className="text-green-600 mt-3 text-sm">{ok}</p>}
    </div>
  );
}
