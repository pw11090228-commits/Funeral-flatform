import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { DEMO_FUNERAL_HALLS, DEMO_PRODUCTS } from '@funeral/demo-data';
import { consultationRequestSchema } from '@funeral/validation';
import { C, Heading, Notice, Screen } from '@/components/mobile-ui';

export default function ConsultationScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [productId, setProductId] = useState('');
  const [hallId, setHallId] = useState('');
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const submit = () => {
    const result = consultationRequestSchema.safeParse({ name, phone, consentToContact: consent, ...(productId ? { productId } : {}), ...(hallId ? { funeralHallId: hallId } : {}) });
    if (!result.success) { setMessage(result.error.issues[0]?.message ?? '입력 내용을 확인해 주세요.'); setSuccess(false); return; }
    setMessage('입력 형식이 확인되었습니다. 데모 화면이므로 신청 내용은 저장되거나 전송되지 않았습니다.');
    setSuccess(true);
  };
  return <Screen><Heading eyebrow="CONSULTATION" title="상담 신청" description="상담 희망 정보를 입력하고 관심 항목을 선택해 주세요."/><Notice/><View style={card}><Text style={label}>이름</Text><TextInput accessibilityLabel="이름" value={name} onChangeText={setName} autoComplete="name" placeholder="이름" style={input}/><Text style={label}>연락처</Text><TextInput accessibilityLabel="연락처" value={phone} onChangeText={setPhone} autoComplete="tel" keyboardType="phone-pad" inputMode="tel" placeholder="전화번호" style={input}/><Text style={label}>관심 상조 상품 (선택)</Text><View style={chips}>{DEMO_PRODUCTS.map((product) => <Pressable key={product.id} accessibilityRole="button" accessibilityState={{ selected: productId === product.id }} onPress={() => setProductId(productId === product.id ? '' : product.id)} style={[chip, productId === product.id && selectedChip]}><Text style={{ color: productId === product.id ? '#FFFFFF' : C.ink, fontSize: 12 }}>{product.name}</Text></Pressable>)}</View><Text style={label}>관심 장례식장 (선택)</Text><View style={chips}>{DEMO_FUNERAL_HALLS.map((hall) => <Pressable key={hall.id} accessibilityRole="button" accessibilityState={{ selected: hallId === hall.id }} onPress={() => setHallId(hallId === hall.id ? '' : hall.id)} style={[chip, hallId === hall.id && selectedChip]}><Text style={{ color: hallId === hall.id ? '#FFFFFF' : C.ink, fontSize: 12 }}>{hall.region} · {hall.name}</Text></Pressable>)}</View><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consent }} onPress={() => setConsent(!consent)} style={consentRow}><View style={[check, consent && checkSelected]}><Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{consent ? '✓' : ''}</Text></View><Text style={small}>상담 안내를 위한 개인정보 수집·이용에 동의합니다. (데모에서는 저장·전송하지 않습니다.)</Text></Pressable>{message ? <Text accessibilityRole={success ? 'summary' : 'alert'} style={[messageStyle, success ? successStyle : errorStyle]}>{message}</Text> : null}<Pressable accessibilityRole="button" onPress={submit} style={submitButton}><Text style={{ color: '#FFFFFF', fontWeight: '800' }}>입력 확인</Text></Pressable><Text style={small}>실제 상담 접수와 개인정보 처리는 아직 연결되지 않은 시제품입니다.</Text></View></Screen>;
}

const card = { backgroundColor: '#FFFFFF', borderColor: '#E4EAED', borderWidth: 1, borderRadius: 16, padding: 16, gap: 9 } as const;
const label = { color: '#142A40', fontSize: 13, fontWeight: '700', marginTop: 4 } as const;
const input = { minHeight: 48, borderRadius: 12, borderColor: '#E4EAED', borderWidth: 1, paddingHorizontal: 13, color: '#142A40', fontSize: 14 } as const;
const chips = { flexDirection: 'row', flexWrap: 'wrap', gap: 7 } as const;
const chip = { borderRadius: 18, borderColor: '#E4EAED', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 } as const;
const selectedChip = { backgroundColor: '#26765D', borderColor: '#26765D' } as const;
const consentRow = { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 12, backgroundColor: '#F7F9FA', borderRadius: 12 } as const;
const check = { width: 20, height: 20, borderColor: '#AAB5BF', borderWidth: 1, borderRadius: 5, alignItems: 'center', justifyContent: 'center' } as const;
const checkSelected = { backgroundColor: '#26765D', borderColor: '#26765D' } as const;
const small = { flex: 1, color: '#647487', fontSize: 11, lineHeight: 17 } as const;
const messageStyle = { fontSize: 12, lineHeight: 18, padding: 11, borderRadius: 10 } as const;
const successStyle = { color: '#28624F', backgroundColor: '#EDF5F1' } as const;
const errorStyle = { color: '#9F2634', backgroundColor: '#FFF0F1' } as const;
const submitButton = { minHeight: 48, borderRadius: 12, backgroundColor: '#26765D', alignItems: 'center', justifyContent: 'center' } as const;
