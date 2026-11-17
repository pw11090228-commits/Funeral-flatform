import { Suspense } from "react";
import ProductListing from "@/components/product-listing";

type ProductsPageProps = { searchParams: Promise<{ q?: string | string[] }> };

async function ProductResults({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  return <ProductListing initialQuery={typeof params.q === "string" ? params.q : ""} />;
}

export default function ProductsPage(props: ProductsPageProps) {
  return <Suspense fallback={<p className="py-12 text-center text-sm text-slate-500">상품 정보를 불러오고 있습니다.</p>}><ProductResults searchParams={props.searchParams}/></Suspense>;
}
