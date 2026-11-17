"use client";

import Link from "next/link";
import { calculateInstallmentTotal, formatKoreanWon } from "@funeral/shared-logic";
import type { DemoFuneralHall, DemoProduct } from "@funeral/demo-data";
import { DEMO_DATA_NOTICE } from "@funeral/demo-data";
import { usePlatformState } from "@/state/platform-state";

export function Header() {
  const { productCompareIds, hallCompareIds } = usePlatformState();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-[#142a40]" aria-label="Funeral Platform 홈">
          <span className="grid size-9 place-items-center rounded-xl bg-[#e8f3ef] text-lg text-[#26765d]">F</span>
          <span>Funeral <span className="text-[#26765d]">Platform</span></span>
        </Link>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/products" className="hover:text-[#26765d]">상조 상품</Link>
          <Link href="/compare" className="hover:text-[#26765d]">상조 비교{productCompareIds.length > 0 ? ` (${productCompareIds.length})` : ""}</Link>
          <Link href="/funeral-halls" className="hover:text-[#26765d]">장례식장</Link>
          <Link href="/funeral-halls/compare" className="hover:text-[#26765d]">시설 비교{hallCompareIds.length > 0 ? ` (${hallCompareIds.length})` : ""}</Link>
        </nav>
        <Link href="/consultation" className="rounded-xl bg-[#26765d] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b614b] sm:px-4">상담 신청</Link>
      </div>
      <nav aria-label="모바일 메뉴" className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 md:hidden">
        <Link className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2" href="/products">상조 찾기</Link>
        <Link className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2" href="/compare">상품 비교{productCompareIds.length ? ` ${productCompareIds.length}` : ""}</Link>
        <Link className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2" href="/funeral-halls">장례식장 찾기</Link>
        <Link className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2" href="/funeral-halls/compare">시설 비교{hallCompareIds.length ? ` ${hallCompareIds.length}` : ""}</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return <footer className="mt-16 border-t border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-8 text-xs leading-6 text-slate-500 sm:px-6 lg:px-8"><p className="font-semibold text-slate-700">Funeral Platform</p><p>현재 화면은 서비스 구조 확인을 위한 가상 샘플입니다. 실제 업체와 가격은 검증되지 않았습니다.</p><p>가격은 항목과 적용 기준에 따라 달라질 수 있으며, 계약 전 사업자에게 다시 확인해 주세요.</p></div></footer>;
}

export function DataNotice() {
  return <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"><strong className="mr-1">샘플 데이터 안내</strong>{DEMO_DATA_NOTICE}</div>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div>{eyebrow && <p className="mb-2 text-xs font-bold tracking-[0.14em] text-[#26765d]">{eyebrow}</p>}<h1 className="text-2xl font-bold tracking-tight text-[#142a40] sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>}</div>{action}</div>;
}

export function ProductCard({ product }: { product: DemoProduct }) {
  const { productCompareIds, favoriteProductIds, toggleProductCompare, toggleFavorite } = usePlatformState();
  const compared = productCompareIds.includes(product.id);
  const favorited = favoriteProductIds.includes(product.id);
  const installment = product.monthlyPayment && product.paymentMonths ? calculateInstallmentTotal(product.monthlyPayment.amount, product.paymentMonths) : product.totalPrice.amount;
  const compareDisabled = !compared && productCompareIds.length >= 3;
  return <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(20,42,64,0.04)]">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#26765d]">{product.companyName} · 가상 샘플</p><Link href={`/products/${product.id}`} className="mt-2 block text-lg font-bold text-[#142a40] hover:text-[#26765d]">{product.name}</Link></div><button type="button" onClick={() => toggleFavorite(product.id)} aria-label={`${product.name} ${favorited ? "관심 해제" : "관심 저장"}`} aria-pressed={favorited} className={`grid size-10 shrink-0 place-items-center rounded-xl border text-lg ${favorited ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{favorited ? "♥" : "♡"}</button></div>
    <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3"><div><p className="text-xs text-slate-500">상품 총액</p><p className="mt-1 font-bold text-[#142a40]">{formatKoreanWon(product.totalPrice.amount)}</p></div><div><p className="text-xs text-slate-500">월 납입 예시</p><p className="mt-1 font-bold text-[#142a40]">{formatKoreanWon(product.monthlyPayment?.amount ?? 0)}</p></div><div className="col-span-2 border-t border-slate-200 pt-2 text-xs text-slate-600">예상 총 납입액 {formatKoreanWon(installment)} · {product.paymentMonths}개월</div></div>
    <div className="mt-4 flex flex-wrap gap-1.5">{product.highlights.slice(0, 2).map((item) => <span key={item} className="rounded-full bg-[#edf5f1] px-2.5 py-1 text-xs text-[#28624f]">{item}</span>)}</div>
    <div className="mt-auto flex gap-2 pt-5"><button type="button" onClick={() => toggleProductCompare(product.id)} disabled={compareDisabled} aria-pressed={compared} className={`min-h-11 flex-1 rounded-xl border px-3 text-sm font-semibold ${compared ? "border-[#26765d] bg-[#edf5f1] text-[#26765d]" : "border-slate-200 text-slate-700 hover:bg-slate-50"} disabled:cursor-not-allowed disabled:opacity-50`}>{compared ? "비교에 담김" : compareDisabled ? "최대 3개" : "비교 담기"}</button><Link href={`/products/${product.id}`} className="grid min-h-11 flex-1 place-items-center rounded-xl bg-[#142a40] px-3 text-sm font-semibold text-white hover:bg-[#203b55]"><span className="text-white">자세히 보기</span></Link></div>
  </article>;
}

export function HallCard({ hall }: { hall: DemoFuneralHall }) {
  const { hallCompareIds, toggleHallCompare } = usePlatformState();
  const compared = hallCompareIds.includes(hall.id);
  const disabled = !compared && hallCompareIds.length >= 3;
  return <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(20,42,64,0.04)]"><p className="text-xs font-semibold text-[#26765d]">{hall.region} {hall.district} · 검증 전 샘플</p><Link href={`/funeral-halls/${hall.id}`} className="mt-2 text-lg font-bold text-[#142a40] hover:text-[#26765d]">{hall.name}</Link><p className="mt-2 text-sm text-slate-600">{hall.address}</p><div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">빈소·안치·관리비 3일 단순 합계 예시</p><p className="mt-1 text-lg font-bold text-[#142a40]">{formatKoreanWon(hall.estimatedThreeDayTotal.amount)}</p></div><p className="mt-3 text-xs text-slate-500">빈소 {hall.roomCount}개 · 식음료/장례용품 제외</p><div className="mt-auto flex gap-2 pt-5"><button type="button" onClick={() => toggleHallCompare(hall.id)} disabled={disabled} aria-pressed={compared} className={`min-h-11 flex-1 rounded-xl border text-sm font-semibold ${compared ? "border-[#26765d] bg-[#edf5f1] text-[#26765d]" : "border-slate-200 text-slate-700"} disabled:opacity-50`}>{compared ? "비교에 담김" : disabled ? "최대 3개" : "비교 담기"}</button><Link href={`/funeral-halls/${hall.id}`} className="grid min-h-11 flex-1 place-items-center rounded-xl bg-[#142a40] text-sm font-semibold text-white"><span className="text-white">시설 정보</span></Link></div></article>;
}

export function EmptyState({ title = "검색 결과가 없습니다", message = "검색어 또는 조건을 바꿔 다시 확인해 주세요.", onReset }: { title?: string; message?: string; onReset?: () => void }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><p className="text-2xl" aria-hidden="true">⌕</p><h2 className="mt-3 font-bold text-[#142a40]">{title}</h2><p className="mt-2 text-sm text-slate-600">{message}</p>{onReset && <button type="button" onClick={onReset} className="mt-4 rounded-xl bg-[#142a40] px-4 py-2.5 text-sm font-semibold text-white">조건 초기화</button>}</div>;
}

export function formatMoney(amount: number) { return formatKoreanWon(amount); }
