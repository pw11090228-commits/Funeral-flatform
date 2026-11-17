import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { DEMO_FUNERAL_HALLS } from '@funeral/demo-data';
import { formatKoreanWon } from '@funeral/shared-logic';
import { useAppState } from '@/providers/app-state';
import { ActionButton, C, Heading, Notice, PriceRow, RouteButton, Screen } from '@/components/mobile-ui';

export default function FuneralHallDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hall = DEMO_FUNERAL_HALLS.find((item) => item.id === id);
  const { hallCompareIds, toggleHallCompare } = useAppState();
  if (!hall) return <Screen><Heading title="시설을 찾을 수 없습니다" description="목록으로 돌아가 다른 장례식장을 선택해 주세요."/><Link href="/funeral-halls" style={{ color: C.green, fontWeight: '700' }}>장례식장 목록</Link></Screen>;
  const compared = hallCompareIds.includes(hall.id);
  const blocked = !compared && hallCompareIds.length >= 3;
  return <Screen><Heading eyebrow={`${hall.region} · ${hall.district}`} title={hall.name} description={hall.facilitySummary}/><Notice/><View style={card}><PriceRow label="주소" value={hall.address}/><PriceRow label="빈소" value={`${hall.roomCount}개`}/><PriceRow label="편의 시설" value={hall.amenityTags.join(' · ')}/></View><View style={card}><Text style={title}>주요 비용 예시 (1일)</Text>{hall.prices.map((price) => <PriceRow key={price.id} label={price.name} value={formatKoreanWon(price.price.amount)}/>)}</View><View style={card}><Text style={label}>3일 단순 합계 예시</Text><Text style={total}>{formatKoreanWon(hall.estimatedThreeDayTotal.amount)}</Text><Text style={muted}>빈소·안치·관리비를 각각 3일로 계산했습니다. 식음료와 장례용품은 제외됩니다.</Text><Text style={muted}>적용 예시 기준 {hall.prices[0]?.effectiveFrom} · 출처 {hall.source.name} · 검증 전</Text></View><ActionButton label={compared ? '비교 목록에서 빼기' : blocked ? '비교는 최대 3곳' : '비교 목록에 담기'} variant="secondary" disabled={blocked} onPress={() => toggleHallCompare(hall.id)}/><RouteButton href="/funeral-halls-compare" label="시설 비교 화면"/><RouteButton href="/consultation" label="상담 신청"/></Screen>;
}

const card = { backgroundColor: '#FFFFFF', borderColor: '#E4EAED', borderWidth: 1, borderRadius: 16, padding: 15 } as const;
const title = { color: '#142A40', fontSize: 16, fontWeight: '800', marginBottom: 8 } as const;
const label = { color: '#647487', fontSize: 12 } as const;
const total = { color: '#142A40', fontSize: 21, fontWeight: '800', marginTop: 4 } as const;
const muted = { color: '#647487', fontSize: 12, lineHeight: 19, marginTop: 5 } as const;
