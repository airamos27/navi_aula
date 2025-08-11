import { supabaseAnon } from "@/lib/supabase";
import EnrollButton from "@/components/EnrollButton";

type Course = { id: string; slug: string; title: string; description: string | null; video_url: string | null; };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = supabaseAnon();
  const { data } = await db
    .from("courses")
    .select("id,slug,title,description,video_url")
    .eq("slug", slug)
    .single();

  if (!data) return <div className="p-6">Course not found.</div>;
  const c = data as Course;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl">{c.title}</h1>
      {c.description && <p>{c.description}</p>}
      <EnrollButton courseId={c.id} />
      {c.video_url && (
        <div className="aspect-video">
          <iframe src={c.video_url} className="w-full h-full" allowFullScreen />
        </div>
      )}
    </div>
  );
}
