"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, videoUrl }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error ?? "Error creating"); return; }
    router.push(`/courses/${data.slug}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl mb-4">New Course</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Title *" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="w-full border p-2" placeholder="Slug (optional)" value={slug} onChange={e=>setSlug(e.target.value)} />
        <textarea className="w-full border p-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="w-full border p-2" placeholder="Video URL (YouTube/Vimeo/embed)" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="border px-4 py-2">Create</button>
      </form>
    </div>
  );
}
