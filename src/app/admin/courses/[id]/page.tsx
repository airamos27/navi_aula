﻿export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="p-6 text-base">OK: /admin/courses/{id}</div>;
}
