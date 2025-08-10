export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="p-6 text-base">OK: /courses/{slug}</div>;
}
