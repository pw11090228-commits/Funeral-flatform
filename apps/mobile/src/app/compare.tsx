import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { DEMO_PRODUCTS } from '@funeral/demo-data';
import { calculateInstallmentTotal, formatKoreanWon } from '@funeral/shared-logic';
import { useAppState } from '@/providers/app-state';
import { C, Empty, Heading, Notice, RouteButton, Screen } from '@/components/mobile-ui';

export default function ProductCompareScreen() {
  const { productCompareIds, toggleProductCompare } = useAppState();
  const products = DEMO_PRODUCTS.filter((item) => productCompareIds.includes(item.id));
  return <Screen><Heading eyebrow="COMPARE" title="상조 상품 비교" description="선택한 상품의 가격과 제공 항목을 나란히 확인합니다."/><Notice/>{products.length ? <><Text style={{ color: C.muted, fontSize: 12 }}>{products.length}/3개 상품</Text>{products.map((product) => <View key={product.id} style={card}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><View style={{ flex: 1 }}><Text style={{ color: C.green, fontSize: 11, fontWeight: '700' }}>{product.companyName}</Text><Text style={title}>{product.name}</Text></View><Pressable accessibilityRole="button" onPress={() => toggleProductCompare(product.id)} hitSlop={8}><Text style={{ color: C.muted, fontSize: 12, textDecorationLine: 'underline' }}>빼기</Text></Pressable></View>{[["상품 총액",formatKoreanWon(product.totalPrice.amount)],["월 납입금",formatKoreanWon(product.monthlyPayment?.amount ?? 0)],["납입 기간",`${product.paymentMonths}개월`],["예상 납입 합계",formatKoreanWon(calculateInstallmentTotal(product.monthlyPayment?.amount ?? 0, product.paymentMonths ?? 0))]].map(([label,value]) => <View key={label} style={row}><Text style={{ color: C.muted, fontSize: 12 }}>{label}</Text><Text style={{ color: C.ink, fontWeight: '700', fontSize: 13 }}>{value}</Text></View>)}<View style={{ borderTopColor: C.line, borderTopWidth: 1, paddingTop: 10 }}><Text style={small}>포함: {product.serviceItems.map((item) => `${item.name}${item.quantity ? ` ${item.quantity}` : ''}`).join(' · ')}</Text><Text style={[small, { marginTop: 5 }]}>별도: {product.excludedItems.join(' · ')}</Text></View></View>)}<RouteButton href="/products" label="상품 더 추가하기" variant="soft"/><RouteButton href="/consultation" label="상담 신청"/></> : <><Empty title="비교할 상품을 선택해 주세요" message="상품 목록에서 최대 3개까지 비교에 담을 수 있습니다."/><Link href="/products" asChild><Pressable accessibilityRole="button" style={btn}><Text style={{ color: '#FFFFFF', fontWeight: '700' }}>상품 찾아보기</Text></Pressable></Link></>}</Screen>;
}

const card = { backgroundColor: '#FFFFFF', borderColor: '#E4EAED', borderWidth: 1, borderRadius: 16, padding: 15, gap: 10 } as const;
const title = { color: '#142A40', fontSize: 16, fontWeight: '800', marginTop: 3 } as const;
const row = { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingVertical: 5 } as const;
const small = { color: '#647487', fontSize: 12, lineHeight: 18 } as const;
const btn = { backgroundColor: '#26765D', minHeight: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' } as const;
