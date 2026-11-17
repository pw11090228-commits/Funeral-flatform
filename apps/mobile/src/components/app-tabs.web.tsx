import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { C } from '@/components/mobile-ui';

export default function AppTabs() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.green, tabBarInactiveTintColor: '#718091', tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }, tabBarStyle: { height: 62, paddingTop: 7, paddingBottom: 7, borderTopColor: '#E4EAED', backgroundColor: '#FFFFFF' } }}>
    <Tabs.Screen name="index" options={{ title: '홈', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>⌂</Text> }}/>
    <Tabs.Screen name="products" options={{ title: '상조 비교', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>▤</Text> }}/>
    <Tabs.Screen name="funeral-halls" options={{ title: '장례식장', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>⌖</Text> }}/>
    <Tabs.Screen name="favorites" options={{ title: '관심 목록', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>♡</Text> }}/>
    <Tabs.Screen name="mypage" options={{ title: '마이페이지', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 17 }}>○</Text> }}/>
    <Tabs.Screen name="explore" options={{ href: null }}/>
    <Tabs.Screen name="products/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }}/>
    <Tabs.Screen name="funeral-halls/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }}/>
    <Tabs.Screen name="compare" options={{ href: null, tabBarStyle: { display: 'none' } }}/>
    <Tabs.Screen name="funeral-halls-compare" options={{ href: null, tabBarStyle: { display: 'none' } }}/>
    <Tabs.Screen name="consultation" options={{ href: null, tabBarStyle: { display: 'none' } }}/>
  </Tabs>;
}
