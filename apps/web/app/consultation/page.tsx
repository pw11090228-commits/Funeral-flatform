"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { DEMO_FUNERAL_HALLS, DEMO_PRODUCTS } from "@funeral/demo-data";
import { consultationRequestSchema } from "@funeral/validation";
import { PageHeading } from "@/components/platform-ui";

export default function ConsultationPage() {
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [productId, setProductId] = useState("");
  const [hallId, setHallId] = useState("");
  const [consent, setConsent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = consultationRequestSchema.safeParse({ name, phone, consentToContact: consent, ...(productId ? { productId } : {}), ...(hallId ? { funeralHallId: hallId } : {}) });
    if (!result.success) { setMessage(result.error.issues[0]?.message ?? "입력 내용을 확인해 주세요."); setCompleted(false); return; }
    setMessage("입력 형식이 확인되었습니다. 현재는 데모 화면이므로 상담 신청이 저장되거나 전송되지 않았습니다.");
    setCompleted(true);
  };
  return <div className="mx-auto max-w-2xl"><PageHeading eyebrow="CONSULTATION" title="상담 신청" description="관심 있는 상품이나 시설을 선택하고 연락받을 정보를 입력해 주세요."/><div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">선택 가능한 업체와 상품은 모두 검증되지 않은 가상 샘플입니다. 입력 내용은 이 데모 화면에서만 확인하며 저장하거나 전송하지 않습니다.</div><form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><label className="block text-sm font-semibold">이름<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal focus:outline-none focus:ring-2 focus:ring-[#dceee6]" placeholder="이름"/></label><label className="block text-sm font-semibold">연락처<input required type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-normal focus:outline-none focus:ring-2 focus:ring-[#dceee6]" placeholder="전화번호"/></label><label className="block text-sm font-semibold">관심 상조 상품 (선택)<select value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal"><option value="">선택하지 않음</option>{DEMO_PRODUCTS.map((product) => <option key={product.id} value={product.id}>{product.companyName} · {product.name}</option>)}</select></label><label className="block text-sm font-semibold">관심 장례식장 (선택)<select value={hallId} onChange={(event) => setHallId(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-normal"><option value="">선택하지 않음</option>{DEMO_FUNERAL_HALLS.map((hall) => <option key={hall.id} value={hall.id}>{hall.region} · {hall.name}</option>)}</select></label><label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 size-4 accent-[#26765d]"/><span>상담 안내를 위한 개인정보 수집·이용에 동의합니다. <span className="text-xs text-slate-500">(데모 화면에서는 저장 또는 전송되지 않습니다.)</span></span></label>{message && <p role={completed ? "status" : "alert"} className={`rounded-xl p-3 text-sm leading-6 ${completed ? "bg-[#edf5f1] text-[#28624f]" : "bg-rose-50 text-rose-800"}`}>{message}</p>}<button type="submit" className="min-h-12 w-full rounded-xl bg-[#26765d] px-4 font-bold text-white hover:bg-[#1b614b]">입력 확인</button><p className="text-center text-xs text-slate-500">본 MVP는 실제 상담 접수 기능이 연결되지 않은 시제품입니다.</p></form><p className="mt-4 text-center text-sm"><Link href="/" className="text-[#26765d] underline">홈으로 돌아가기</Link></p></div>;
}
