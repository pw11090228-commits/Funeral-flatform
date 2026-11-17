import { Suspense } from "react";
import HallListing from "@/components/hall-listing";

type HallsPageProps = { searchParams: Promise<{ region?: string | string[] }> };

async function HallResults({ searchParams }: HallsPageProps) {
  const params = await searchParams;
  return <HallListing initialRegion={typeof params.region === "string" ? params.region : ""} />;
}

export default function FuneralHallsPage(props: HallsPageProps) {
  return <Suspense fallback={<p className="py-12 text-center text-sm text-slate-500">장례식장 정보를 불러오고 있습니다.</p>}><HallResults searchParams={props.searchParams}/></Suspense>;
}
