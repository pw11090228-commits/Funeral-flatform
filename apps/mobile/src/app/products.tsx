import { useMemo, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { DEMO_PRODUCTS } from '@funeral/demo-data';
import { useAppState } from '@/providers/app-state';
import { ActionButton, C, Empty, Heading, Notice, ProductTile, Screen } from '@/components/mobile-ui';

export default function ProductsScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(typeof params.q === 'string' ? params.q : '');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortDescending, setSortDescending] = useState(false);
  const { productCompareIds } = useAppState();
  const results = useMemo(() => DEMO_PRODUCTS.filter((item) => `${item.name} ${item.companyName}`.toLowerCase().includes(query.toLowerCase().trim()) && (!maxPrice || item.totalPrice.amount <= Number(maxPrice))).sort((a, b) => sortDescending ? b.totalPrice.amount - a.totalPrice.amount : a.totalPrice.amount - b.totalPrice.amount), [query, maxPrice, sortDescending]);
  const reset = () => { setQuery(''); setMaxPrice(''); setSortDescending(false); };
  return <Screen><Heading eyebrow="MUTUAL AID" title="상조 상품 비교" description="총액과 월 납입금, 서비스 구성을 확인해 보세요."/><Notice/><View style={{ gap: 9 }}><TextInput accessibilityLabel="상품 또는 회사 검색" value={query} onChangeText={setQuery} placeholder="상품명 또는 회사명 검색" style={input}/><TextInput accessibilityLabel="최대 상품 금액" value={maxPrice} onChangeText={(value) => setMaxPrice(value.replace(/[^0-9]/g, ''))} inputMode="numeric" keyboardType="number-pad" placeholder="최대 총액 (원)" style={input}/><View style={{ flexDirection: 'row', gap: 8 }}><ActionButton label={sortDescending ? '총액 높은 순 ↓' : '총액 낮은 순 ↑'} variant="secondary" onPress={() => setSortDescending(!sortDescending)}/><Link href="/compare" asChild><Pressable accessibilityRole="button" style={{ flex: 1, minHeight: 44, backgroundColor: C.green, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontWeight: '700' }}>비교함 {productCompareIds.length}/3</Text></Pressable></Link></View><Text style={{ color: C.muted, fontSize: 12 }}>{results.length}개 상품 · 샘플은 실제 정보가 아닙니다.</Text></View>{results.length ? <View style={{ gap: 10 }}>{results.map((product) => <ProductTile key={product.id} product={product}/>)}</View> : <><Empty/><ActionButton label="검색 조건 초기화" variant="soft" onPress={reset}/></>}</Screen>;
}

const input = { minHeight: 48, borderRadius: 12, borderColor: '#E4EAED', borderWidth: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 13, fontSize: 14, color: '#142A40' } as const;
