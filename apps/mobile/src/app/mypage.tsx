import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useAppState } from '@/providers/app-state';
import { C, Heading, Notice, RouteButton, Screen } from '@/components/mobile-ui';

export default function MyPageScreen() {
  const { productCompareIds, hallCompareIds, favoriteProductIds } = useAppState();
  return <Screen><Heading eyebrow="MY PAGE" title="마이페이지" description="현재는 회원 계정 없이 이 화면 안에서만 선택한 항목을 관리합니다."/><Notice/><View style={{ flexDirection: 'row', gap: 8 }}>{[["관심 상품", favoriteProductIds.length],["상품 비교", productCompareIds.length],["시설 비교", hallCompareIds.length]].map(([label, count]) => <View key={String(label)} style={{ flex: 1, padding: 13, backgroundColor: '#FFFFFF', borderRadius: 14, borderColor: C.line, borderWidth: 1 }}><Text style={{ color: C.muted, fontSize: 11 }}>{label}</Text><Text style={{ color: C.ink, fontSize: 20, fontWeight: '800', marginTop: 5 }}>{count}</Text></View>)}</View><RouteButton href="/consultation" label="상담 신청 화면"/><View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, borderColor: C.line, borderWidth: 1, padding: 16, gap: 8 }}><Text style={{ color: C.ink, fontWeight: '800' }}>서비스 안내</Text><Text style={{ color: C.muted, fontSize: 13, lineHeight: 20 }}>데모 앱에서는 로그인, 서버 저장, 실제 상담 접수를 제공하지 않습니다. 화면을 닫으면 로컬 선택 내용이 초기화됩니다.</Text></View><Link href="/products" asChild><Pressable accessibilityRole="link"><Text style={{ color: C.green, textAlign: 'center', fontWeight: '700' }}>상품 찾아보기</Text></Pressable></Link></Screen>;
}
