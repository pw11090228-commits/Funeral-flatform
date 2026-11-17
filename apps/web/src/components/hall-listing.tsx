"use client";

import { useMemo, useState } from "react";
import { DEMO_FUNERAL_HALLS } from "@funeral/demo-data";
import { DataNotice, EmptyState, HallCard, PageHeading } from "@/components/platform-ui";

export default function HallListing({ initialRegion = "" }: { initialRegion?: string }) {
  const [region, setRegion] = useState(initialRegion);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("price-asc");
  const regions = [...new Set(DEMO_FUNERAL_HALLS.map((hall) => hall.region))];
  const halls = useMemo(() => DEMO_FUNERAL_HALLS.filter((hall) => {
    const matchRegion = !region || hall.region === region;
    const matchQuery = `${hall.name} ${hall.address} ${hall.district}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchPrice = !maxPrice || hall.estimatedThreeDayTotal.amount <= Number(maxPrice);
    return matchRegion && matchQuery && matchPrice;
  }).sort((a, b) => sort === "price-desc" ? b.estimatedThreeDayTotal.amount - a.estimatedThreeDayTotal.amount : a.estimatedThreeDayTotal.amount - b.estimatedThreeDayTotal.amount), [region, query, maxPrice, sort]);
  const reset = () => { setRegion(""); setQuery(""); setMaxPrice(""); setSort("price-asc"); };
  return <div><PageHeading eyebrow="FUNERAL HALLS" title="장례식장 찾기" description="지역과 빈소·안치·관리 비용을 같은 기준으로 비교해 보세요."/><DataNotice/><section aria-label="장례식장 검색 및 필터" className="my-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4"><label className="sr-only" htmlFor="hall-region">지역</label><select id="hall-region" value={region} onChange={(event) => setRegion(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"><option value="">전체 지역</option>{regions.map((item) => <option key={item}>{item}</option>)}</select><label className="sr-only" htmlFor="hall-query">시설 검색</label><input id="hall-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="시설명, 지역 검색" className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#dceee6]"/><label className="sr-only" htmlFor="hall-max-price">3일 합계 최대 금액</label><input id="hall-max-price" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/[^0-9]/g, ""))} placeholder="3일 비용 최대 (원)" className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#dceee6]"/><label className="sr-only" htmlFor="hall-sort">정렬</label><select id="hall-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"><option value="price-asc">예상 합계 낮은 순</option><option value="price-desc">예상 합계 높은 순</option></select><p className="text-xs text-slate-500 sm:col-span-2 xl:col-span-4">{halls.length}개 시설 · 지도 및 예약 정보는 아직 연결되지 않았습니다.</p></section>{halls.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{halls.map((hall) => <HallCard key={hall.id} hall={hall}/>)}</div> : <EmptyState onReset={reset}/>}</div>;
}
