"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data: { ok?: boolean; role?: "user" | "admin"; error?: string } = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok || !data.ok) {
      toast(data.error ?? "No se pudo iniciar sesión");
      return;
    }
    toast(data.role === "admin" ? "Bienvenido Admin" : "Bienvenido Usuario");
    router.push(data.role === "admin" ? "/admin/courses" : "/private/profile/me");
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-xl mb-4">Login</h1>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
            </div>
            <Button disabled={loading} type="submit">{loading ? "..." : "Entrar"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
