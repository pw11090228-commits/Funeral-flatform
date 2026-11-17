import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { DEMO_PRODUCTS } from '@funeral/demo-data';
import { calculateInstallmentTotal, formatKoreanWon } from '@funeral/shared-logic';
import { useAppState } from '@/providers/app-state';
import { ActionButton, C, Heading, Notice, PriceRow, RouteButton, Screen } from '@/components/mobile-ui';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = DEMO_PRODUCTS.find((item) => item.id === id);
  const { productCompareIds, favoriteProductIds, toggleProductCompare, toggleFavorite } = useAppState();
  if (!product) return <Screen><Heading title="상품을 찾을 수 없습니다" description="목록으로 돌아가 다른 상품을 선택해 주세요."/><Link href="/products" style={{ color: C.green, fontWeight: '700' }}>상조 상품 목록</Link></Screen>;
  const compared = productCompareIds.includes(product.id);
  const favorite = favoriteProductIds.includes(product.id);
  const blocked = !compared && productCompareIds.length >= 3;
  return <Screen><Heading eyebrow={product.companyName} title={product.name} description={product.companySummary}/><Notice/><View style={card}><PriceRow label="상품 총액" value={formatKoreanWon(product.totalPrice.amount)}/><PriceRow label="월 납입 예시" value={formatKoreanWon(product.monthlyPayment?.amount ?? 0)}/><PriceRow label="납입 기간" value={`${product.paymentMonths}개월`}/><PriceRow label="예상 납입 합계" value={formatKoreanWon(calculateInstallmentTotal(product.monthlyPayment?.amount ?? 0, product.paymentMonths ?? 0))}/></View><View style={card}><Text style={title}>포함 서비스 예시</Text>{product.serviceItems.map((item) => <PriceRow key={item.id} label={item.name} value={`${item.included ? '포함' : '별도'}${item.quantity ? ` · ${item.quantity}` : ''}`}/>)}</View><View style={card}><Text style={title}>별도 비용·제외 항목</Text><Text style={muted}>{product.excludedItems.join(' · ')}</Text><Text style={muted}>출처: {product.source.name} · 확인일 {product.source.checkedAt} · 검증 전</Text></View><ActionButton label={compared ? '비교 목록에서 빼기' : blocked ? '비교는 최대 3개' : '비교 목록에 담기'} variant="secondary" disabled={blocked} onPress={() => toggleProductCompare(product.id)}/><ActionButton label={favorite ? '관심 목록에서 제거' : '관심 상품 저장'} variant="soft" onPress={() => toggleFavorite(product.id)}/><RouteButton href="/compare" label="상품 비교 화면"/><RouteButton href="/consultation" label="상담 신청"/></Screen>;
}

const card = { backgroundColor: '#FFFFFF', borderColor: '#E4EAED', borderWidth: 1, borderRadius: 16, padding: 15 } as const;
const title = { color: '#142A40', fontSize: 16, fontWeight: '800', marginBottom: 8 } as const;
const muted = { color: '#647487', fontSize: 12, lineHeight: 19, marginTop: 5 } as const;
