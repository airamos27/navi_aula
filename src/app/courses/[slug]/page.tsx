import Link from "next/link";
import { headers } from "next/headers";

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

interface NextFetchInit extends RequestInit {
  next?: { revalidate?: number; tags?: string[] };
}

async function getBaseURL(): Promise<string> {
  const h = await headers(); // <- ahora es Promise
  let proto: string | undefined;
  let host: string | undefined;

  for (const [k, v] of h.entries()) {
    const key = k.toLowerCase();
    if (!proto && key === "x-forwarded-proto") proto = v;
    if (!host && (key === "x-forwarded-host" || key === "host")) host = v;
  }

  if (!proto) proto = "http";
  if (!host) host = "localhost:3000";
  return `${proto}://${host}`;
}

async function getCourses(): Promise<Course[]> {
  const init: NextFetchInit = { next: { tags: ["courses"] } };
  const base = await getBaseURL();
  const res = await fetch(`${base}/api/courses`, init);
  if (!res.ok) throw new Error("Failed to fetch courses");
  const json: { courses?: Course[] } = await res.json();
  return json.courses ?? [];
}

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
