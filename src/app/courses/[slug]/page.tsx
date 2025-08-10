type Props = { params: { slug: string } };
export default function Page({ params }: Props) {
  return <div className="p-6">OK: /courses/{params.slug}</div>;
}
