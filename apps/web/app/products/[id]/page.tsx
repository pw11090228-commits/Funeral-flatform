import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DEMO_PRODUCTS } from "@funeral/demo-data";
import { ProductDetails } from "@/components/detail-pages";

type ProductDetailProps = { params: Promise<{ id: string }> };

async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params;
  const product = DEMO_PRODUCTS.find((item) => item.id === id);
  if (!product) notFound();
  return <ProductDetails product={product}/>;
}

export default function ProductDetailPage(props: ProductDetailProps) {
  return <Suspense fallback={<p className="py-12 text-center text-sm text-slate-500">상품 정보를 불러오고 있습니다.</p>}><ProductDetail params={props.params}/></Suspense>;
}
