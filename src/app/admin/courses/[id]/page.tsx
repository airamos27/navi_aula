type Props = { params: { id: string } };
export default function Page({ params }: Props) {
  return <div className="p-6 text-base">OK: /admin/courses/{params.id}</div>;
}
