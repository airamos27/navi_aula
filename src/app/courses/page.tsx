import Link from "next/link";
import { unstable_cache as cache } from "next/cache";
import { supabaseAnon } from "@/lib/supabase";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  video_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const getCourses = cache(async (): Promise<Course[]> => {
  const db = supabaseAnon();
  const { data, error } = await db
    .from("courses")
    .select("id,slug,title,description,video_url,published,created_at,updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Course[];
}, ["courses:list"], { tags: ["courses"] });

export default async function Page() {
  const courses = await getCourses();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl">Courses</h1>
      <ul className="space-y-2">
        {courses.map((c) => (
          <li key={c.id}>
            <Link href={`/courses/${c.slug}`} className="underline">
              {c.title}
            </Link>
            {c.description ? (
              <div className="text-sm opacity-80">{c.description}</div>
            ) : null}
          </li>
        ))}
        {courses.length === 0 && <li>No courses yet.</li>}
      </ul>
    </div>
  );
}
