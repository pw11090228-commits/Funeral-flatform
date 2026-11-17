import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DEMO_FUNERAL_HALLS } from "@funeral/demo-data";
import { HallDetails } from "@/components/detail-pages";

type HallDetailProps = { params: Promise<{ id: string }> };

async function HallDetail({ params }: HallDetailProps) {
  const { id } = await params;
  const hall = DEMO_FUNERAL_HALLS.find((item) => item.id === id);
  if (!hall) notFound();
  return <HallDetails hall={hall}/>;
}

export default function FuneralHallDetailPage(props: HallDetailProps) {
  return <Suspense fallback={<p className="py-12 text-center text-sm text-slate-500">시설 정보를 불러오고 있습니다.</p>}><HallDetail params={props.params}/></Suspense>;
}
