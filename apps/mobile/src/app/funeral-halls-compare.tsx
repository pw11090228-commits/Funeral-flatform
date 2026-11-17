import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { DEMO_FUNERAL_HALLS } from '@funeral/demo-data';
import { formatKoreanWon } from '@funeral/shared-logic';
import { useAppState } from '@/providers/app-state';
import { C, Empty, Heading, Notice, RouteButton, Screen } from '@/components/mobile-ui';

export default function HallCompareScreen() {
  const { hallCompareIds, toggleHallCompare } = useAppState();
  const halls = DEMO_FUNERAL_HALLS.filter((item) => hallCompareIds.includes(item.id));
  return <Screen><Heading eyebrow="COMPARE" title="장례식장 비교" description="빈소·안치·관리 비용을 항목별로 확인합니다."/><Notice/>{halls.length ? <><Text style={{ color: C.muted, fontSize: 12 }}>{halls.length}/3곳 · 3일 단순 합계 예시</Text>{halls.map((hall) => <View key={hall.id} style={card}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><View style={{ flex: 1 }}><Text style={{ color: C.green, fontSize: 11, fontWeight: '700' }}>{hall.region} {hall.district}</Text><Text style={title}>{hall.name}</Text></View><Pressable accessibilityRole="button" onPress={() => toggleHallCompare(hall.id)}><Text style={{ color: C.muted, fontSize: 12, textDecorationLine: 'underline' }}>빼기</Text></Pressable></View>{hall.prices.map((price) => <View key={price.id} style={row}><Text style={{ color: C.muted, fontSize: 12 }}>{price.name} · 1일</Text><Text style={{ color: C.ink, fontWeight: '700', fontSize: 13 }}>{formatKoreanWon(price.price.amount)}</Text></View>)}<View style={{ backgroundColor: '#EDF5F1', borderRadius: 10, padding: 11 }}><Text style={{ color: C.green, fontSize: 11 }}>3일 합계 (식음료·용품 제외)</Text><Text style={{ color: C.ink, fontWeight: '800', fontSize: 17, marginTop: 3 }}>{formatKoreanWon(hall.estimatedThreeDayTotal.amount)}</Text></View><Text style={small}>빈소 {hall.roomCount}개 · {hall.amenityTags.join(' · ')}</Text></View>)}<RouteButton href="/funeral-halls" label="시설 더 추가하기" variant="soft"/><RouteButton href="/consultation" label="상담 신청"/></> : <><Empty title="비교할 시설을 선택해 주세요" message="장례식장 목록에서 최대 3곳까지 비교에 담을 수 있습니다."/><Link href="/funeral-halls" asChild><Pressable accessibilityRole="button" style={btn}><Text style={{ color: '#FFFFFF', fontWeight: '700' }}>장례식장 찾아보기</Text></Pressable></Link></>}</Screen>;
}

const card = { backgroundColor: '#FFFFFF', borderColor: '#E4EAED', borderWidth: 1, borderRadius: 16, padding: 15, gap: 9 } as const;
const title = { color: '#142A40', fontSize: 16, fontWeight: '800', marginTop: 3 } as const;
const row = { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingVertical: 5 } as const;
const small = { color: '#647487', fontSize: 12, lineHeight: 18 } as const;
const btn = { backgroundColor: '#26765D', minHeight: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' } as const;
