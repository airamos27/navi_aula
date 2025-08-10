import Link from "next/link";

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

async function getCourses(): Promise<Course[]> {
  const init: NextFetchInit = { next: { tags: ["courses"] } };
  const res = await fetch("/api/courses", init);
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
