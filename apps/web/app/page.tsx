"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_FUNERAL_HALLS, DEMO_PRODUCTS } from "@funeral/demo-data";
import { DataNotice, HallCard, PageHeading, ProductCard } from "@/components/platform-ui";

export default function HomePage() {
  const [productQuery, setProductQuery] = useState("");
  const [region, setRegion] = useState("");
  return <div className="space-y-12">
    <section className="relative overflow-hidden rounded-3xl bg-[#142a40] px-5 py-9 text-white sm:px-10 sm:py-14 lg:px-14">
      <div className="max-w-3xl"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">복잡한 장례 준비를 한눈에</span><h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">상조와 장례식장,<br className="hidden sm:block" /> 기준을 세워 비교하세요.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">가격과 제공 항목을 같은 기준으로 살펴보고, 필요한 정보를 차분히 확인할 수 있습니다.</p></div>
      <div className="mt-8 grid gap-3 rounded-2xl bg-white p-3 text-slate-800 shadow-lg md:grid-cols-[1fr_1fr_auto] md:p-4">
        <form action="/products" className="flex gap-2"><label className="sr-only" htmlFor="hero-product-search">상조 상품 검색</label><input id="hero-product-search" name="q" value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="상조 상품 또는 회사 검색" className="min-h-12 min-w-0 flex-1 rounded-xl bg-slate-50 px-4 text-sm outline-none ring-[#26765d] focus:ring-2"/><button className="rounded-xl bg-[#26765d] px-4 text-sm font-semibold text-white">상품 찾기</button></form>
        <form action="/funeral-halls" className="flex gap-2"><label className="sr-only" htmlFor="hero-hall-region">지역 선택</label><select id="hero-hall-region" name="region" value={region} onChange={(event) => setRegion(event.target.value)} className="min-h-12 min-w-0 flex-1 rounded-xl bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-[#26765d]"><option value="">장례식장 지역 선택</option>{[...new Set(DEMO_FUNERAL_HALLS.map((hall) => hall.region))].map((item) => <option key={item}>{item}</option>)}</select><button className="rounded-xl border border-slate-200 px-4 text-sm font-semibold text-[#142a40]">시설 찾기</button></form>
        <Link href="/consultation" className="grid min-h-12 place-items-center rounded-xl bg-[#e9f3ee] px-4 text-sm font-bold text-[#26765d]">상담 신청</Link>
      </div>
    </section>

    <DataNotice />
    <section><PageHeading eyebrow="MUTUAL AID" title="추천 상조 상품" description="월 납입금과 총액, 제공 항목을 함께 확인해 보세요." action={<Link href="/products" className="text-sm font-semibold text-[#26765d]">전체 상품 보기 →</Link>} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{DEMO_PRODUCTS.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section><PageHeading eyebrow="FUNERAL HALLS" title="인기 장례식장 예시" description="지역과 시설별 비용 항목을 동일한 기준으로 살펴보세요." action={<Link href="/funeral-halls" className="text-sm font-semibold text-[#26765d]">전체 시설 보기 →</Link>} /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{DEMO_FUNERAL_HALLS.slice(0, 3).map((hall) => <HallCard key={hall.id} hall={hall} />)}</div></section>
    <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"><div><p className="text-sm font-semibold text-[#26765d]">비용을 이해하기 쉽게</p><h2 className="mt-2 text-xl font-bold text-[#142a40]">어떤 항목이 포함되는지 먼저 확인하세요.</h2><p className="mt-2 text-sm leading-6 text-slate-600">현재 금액은 가상 샘플이며, 식음료·장지·지역 추가 비용 등은 상품과 시설에 따라 다를 수 있습니다.</p></div><div className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="text-slate-500">비교할 때 확인할 정보</p><p className="mt-2 font-semibold text-[#142a40]">총액 · 월 납입 · 포함 항목 · 기준 날짜</p><p className="mt-3 text-xs text-slate-500">예시 기준 2026.11</p></div></section>
  </div>;
}
