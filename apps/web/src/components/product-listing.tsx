"use client";

import { useMemo, useState } from "react";
import { DEMO_PRODUCTS } from "@funeral/demo-data";
import { DataNotice, EmptyState, PageHeading, ProductCard } from "@/components/platform-ui";

export default function ProductListing({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("price-asc");
  const products = useMemo(() => DEMO_PRODUCTS.filter((item) => {
    const matchesQuery = `${item.name} ${item.companyName}`.toLowerCase().includes(query.toLowerCase().trim());
    const matchesPrice = !maxPrice || item.totalPrice.amount <= Number(maxPrice);
    return matchesQuery && matchesPrice;
  }).sort((a, b) => sort === "price-desc" ? b.totalPrice.amount - a.totalPrice.amount : a.totalPrice.amount - b.totalPrice.amount), [query, maxPrice, sort]);
  const reset = () => { setQuery(""); setMaxPrice(""); setSort("price-asc"); };
  return <div><PageHeading eyebrow="MUTUAL AID" title="상조 상품 비교" description="총액과 월 납입금, 제공 서비스와 제외 항목을 확인해 보세요."/><DataNotice/><section aria-label="상품 검색 및 필터" className="my-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_200px_190px]"><label className="sr-only" htmlFor="product-query">상품 또는 회사 검색</label><input id="product-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="상품명 또는 회사명 검색" className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm focus:border-[#26765d] focus:outline-none focus:ring-2 focus:ring-[#dceee6]"/><label className="sr-only" htmlFor="product-max-price">최대 상품 총액</label><input id="product-max-price" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/[^0-9]/g, ""))} placeholder="최대 총액 (원)" className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm focus:border-[#26765d] focus:outline-none focus:ring-2 focus:ring-[#dceee6]"/><label className="sr-only" htmlFor="product-sort">정렬</label><select id="product-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"><option value="price-asc">총액 낮은 순</option><option value="price-desc">총액 높은 순</option></select><p className="text-xs text-slate-500 md:col-span-3">{products.length}개 상품 · 최대 3개까지 비교에 담을 수 있습니다.</p></section>{products.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <EmptyState onReset={reset}/>}</div>;
}
