"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Update the import path and exported names if needed
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export default function Page() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, videoUrl }),
    });
    const data: { ok?: boolean; slug?: string; error?: string } = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok || !data.ok) {
      toast(
        <div>
          <strong>Error</strong>
          <div>{data.error ?? "No se pudo crear el curso"}</div>
        </div>
      );
      return;
    }
    toast(
      <div>
        <strong>Curso creado</strong>
        <div>Se publicará al instante</div>
      </div>
    );
    router.push(`/courses/${data.slug}`);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="p-6 space-y-3">
          <h1 className="text-xl">Nuevo curso</h1>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="slug">Slug (opcional)</Label>
              <Input id="slug" value={slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <Label htmlFor="video">Video URL</Label>
              <Input id="video" value={videoUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)} />
            </div>
            <Button disabled={loading} type="submit">{loading ? "..." : "Publicar"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
