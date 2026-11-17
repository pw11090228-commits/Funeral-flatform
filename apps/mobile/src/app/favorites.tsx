import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { DEMO_PRODUCTS } from '@funeral/demo-data';
import { useAppState } from '@/providers/app-state';
import { C, Empty, Heading, Notice, ProductTile, Screen } from '@/components/mobile-ui';

export default function FavoritesScreen() {
  const { favoriteProductIds } = useAppState();
  const favorites = DEMO_PRODUCTS.filter((product) => favoriteProductIds.includes(product.id));
  return <Screen><Heading eyebrow="SAVED" title="관심 목록" description="관심 있는 상조 상품을 이 기기의 임시 상태로 보관합니다."/><Notice/>{favorites.length ? <View style={{ gap: 10 }}>{favorites.map((product) => <ProductTile key={product.id} product={product}/>)}</View> : <><Empty title="저장한 상품이 없습니다" message="상품 목록에서 하트를 눌러 관심 상품으로 저장해 보세요."/><Link href="/products" asChild><Pressable accessibilityRole="button" style={{ minHeight: 46, borderRadius: 12, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#FFFFFF', fontWeight: '700' }}>상조 상품 둘러보기</Text></Pressable></Link></>}</Screen>;
}
