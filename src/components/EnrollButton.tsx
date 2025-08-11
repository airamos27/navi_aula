"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { courseId: string };

export default function EnrollButton({ courseId }: Props) {
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/enroll?courseId=${encodeURIComponent(courseId)}`);
        const data: { enrolled?: boolean } = await res.json();
        if (active) setEnrolled(Boolean(data.enrolled));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [courseId]);

  const enroll = async () => {
    setLoading(true);
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (res.status === 401) { router.push("/login"); return; }
    setEnrolled(true); setLoading(false);
  };

  const leave = async () => {
    setLoading(true);
    const res = await fetch("/api/enroll", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (res.status === 401) { router.push("/login"); return; }
    setEnrolled(false); setLoading(false);
  };

  if (loading) return <button className="border px-4 py-2 opacity-60">...</button>;
  return enrolled
    ? <button onClick={leave} className="border px-4 py-2">Leave course</button>
    : <button onClick={enroll} className="border px-4 py-2">Enroll</button>;
}
