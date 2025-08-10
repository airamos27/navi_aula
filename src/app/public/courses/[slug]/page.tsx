type Props = { params: { slug: string } };
export default function Page({ params }: Props) {
  return <div className="p-6 text-base">OK: /courses/{params.slug}</div>;
}
