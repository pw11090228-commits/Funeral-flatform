import { useMemo, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { DEMO_FUNERAL_HALLS } from '@funeral/demo-data';
import { useAppState } from '@/providers/app-state';
import { ActionButton, C, Empty, HallTile, Heading, Notice, Screen } from '@/components/mobile-ui';

export default function FuneralHallsScreen() {
  const params = useLocalSearchParams<{ region?: string }>();
  const [region, setRegion] = useState(typeof params.region === 'string' ? params.region : '');
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [descending, setDescending] = useState(false);
  const { hallCompareIds } = useAppState();
  const regions = [...new Set(DEMO_FUNERAL_HALLS.map((hall) => hall.region))];
  const results = useMemo(() => DEMO_FUNERAL_HALLS.filter((hall) => (!region || hall.region === region) && `${hall.name} ${hall.address}`.toLowerCase().includes(query.toLowerCase().trim()) && (!maxPrice || hall.estimatedThreeDayTotal.amount <= Number(maxPrice))).sort((a, b) => descending ? b.estimatedThreeDayTotal.amount - a.estimatedThreeDayTotal.amount : a.estimatedThreeDayTotal.amount - b.estimatedThreeDayTotal.amount), [region, query, maxPrice, descending]);
  const reset = () => { setRegion(''); setQuery(''); setMaxPrice(''); setDescending(false); };
  return <Screen><Heading eyebrow="FUNERAL HALLS" title="장례식장 찾기" description="지역과 주요 비용 항목을 한눈에 확인하세요."/><Notice/><Text style={{ color: C.ink, fontSize: 13, fontWeight: '700' }}>지역</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>{['전체', ...regions].map((item) => { const value = item === '전체' ? '' : item; return <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: region === value }} onPress={() => setRegion(value)} style={{ backgroundColor: region === value ? C.green : '#FFFFFF', borderColor: region === value ? C.green : C.line, borderWidth: 1, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 9 }}><Text style={{ color: region === value ? '#FFFFFF' : C.ink, fontSize: 12, fontWeight: '700' }}>{item}</Text></Pressable>; })}</View><TextInput accessibilityLabel="장례식장 이름 검색" value={query} onChangeText={setQuery} placeholder="시설명 또는 주소 검색" style={input}/><TextInput accessibilityLabel="최대 3일 비용" value={maxPrice} onChangeText={(value) => setMaxPrice(value.replace(/[^0-9]/g, ''))} inputMode="numeric" keyboardType="number-pad" placeholder="3일 비용 최대 (원)" style={input}/><View style={{ flexDirection: 'row', gap: 8 }}><ActionButton label={descending ? '예상 합계 높은 순' : '예상 합계 낮은 순'} variant="secondary" onPress={() => setDescending(!descending)}/><Link href="/funeral-halls-compare" asChild><Pressable accessibilityRole="button" style={{ flex: 1, minHeight: 44, backgroundColor: C.green, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#FFFFFF', fontWeight: '700' }}>비교함 {hallCompareIds.length}/3</Text></Pressable></Link></View><Text style={{ color: C.muted, fontSize: 12 }}>{results.length}곳 · 지도와 예약 정보는 아직 연결되지 않았습니다.</Text>{results.length ? <View style={{ gap: 10 }}>{results.map((hall) => <HallTile key={hall.id} hall={hall}/>)}</View> : <><Empty/><ActionButton label="검색 조건 초기화" variant="soft" onPress={reset}/></>}</Screen>;
}

const input = { minHeight: 48, borderRadius: 12, borderColor: '#E4EAED', borderWidth: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 13, fontSize: 14, color: '#142A40' } as const;
