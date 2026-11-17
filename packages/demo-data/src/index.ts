import type { FuneralHall, Money, MutualAidProduct } from "@funeral/shared-types";

export type DemoProduct = MutualAidProduct & {
  companyName: string;
  companySummary: string;
  highlights: string[];
};

export type DemoFuneralHall = FuneralHall & {
  region: string;
  district: string;
  roomCount: number;
  amenityTags: string[];
  estimatedThreeDayTotal: Money;
};

export const DEMO_DATA_NOTICE =
  "화면 확인을 위한 가상 샘플입니다. 실제 업체·상품·가격을 검증한 정보가 아닙니다.";

const source = {
  name: "개발용 가상 샘플",
  checkedAt: "2026-11-14",
  status: "unverified" as const,
};

const krw = (amount: number): Money => ({ amount, currency: "KRW" });

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    companyId: "20000000-0000-4000-8000-000000000001",
    companyName: "가상상조",
    companySummary: "비교 화면을 위한 가상 회사 정보입니다.",
    name: "든든한 마음 360",
    totalPrice: krw(3_600_000),
    monthlyPayment: krw(30_000),
    paymentMonths: 120,
    serviceItems: [
      { id: "guide-1", name: "장례지도사", included: true, quantity: 1 },
      { id: "helper-1", name: "장례 도우미", included: true, quantity: 8 },
      { id: "vehicle-1", name: "장례 차량", included: true, quantity: 1 },
      { id: "urn-1", name: "기본 유골함", included: true, quantity: 1 },
    ],
    excludedItems: ["빈소 사용료", "식음료 비용", "지역·거리별 추가 운행료"],
    source,
    isSponsored: false,
    highlights: ["월 3만 원 예시", "핵심 의전 서비스 구성"],
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    companyId: "20000000-0000-4000-8000-000000000002",
    companyName: "예시라이프",
    companySummary: "비교 화면을 위한 가상 회사 정보입니다.",
    name: "평안한 여정 420",
    totalPrice: krw(4_200_000),
    monthlyPayment: krw(35_000),
    paymentMonths: 120,
    serviceItems: [
      { id: "guide-2", name: "장례지도사", included: true, quantity: 1 },
      { id: "helper-2", name: "장례 도우미", included: true, quantity: 10 },
      { id: "vehicle-2", name: "장례 차량", included: true, quantity: 1 },
      { id: "urn-2", name: "유골함", included: true, quantity: 1 },
      { id: "flower-2", name: "헌화용 국화", included: true, quantity: 30 },
    ],
    excludedItems: ["빈소 사용료", "식음료 비용", "추가 도우미 비용"],
    source,
    isSponsored: false,
    highlights: ["월 3만 5천 원 예시", "도우미 10명 예시"],
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    companyId: "20000000-0000-4000-8000-000000000003",
    companyName: "샘플케어",
    companySummary: "비교 화면을 위한 가상 회사 정보입니다.",
    name: "온전한 동행 480",
    totalPrice: krw(4_800_000),
    monthlyPayment: krw(40_000),
    paymentMonths: 120,
    serviceItems: [
      { id: "guide-3", name: "장례지도사", included: true, quantity: 1 },
      { id: "helper-3", name: "장례 도우미", included: true, quantity: 12 },
      { id: "vehicle-3", name: "장례 차량", included: true, quantity: 2 },
      { id: "urn-3", name: "고급 유골함", included: true, quantity: 1 },
      { id: "flower-3", name: "헌화용 국화", included: true, quantity: 50 },
    ],
    excludedItems: ["빈소 사용료", "식음료 비용", "장지 관련 비용"],
    source,
    isSponsored: false,
    highlights: ["월 4만 원 예시", "차량 2대 구성 예시"],
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    companyId: "20000000-0000-4000-8000-000000000004",
    companyName: "다정한길",
    companySummary: "비교 화면을 위한 가상 회사 정보입니다.",
    name: "차분한 준비 300",
    totalPrice: krw(3_000_000),
    monthlyPayment: krw(25_000),
    paymentMonths: 120,
    serviceItems: [
      { id: "guide-4", name: "장례지도사", included: true, quantity: 1 },
      { id: "helper-4", name: "장례 도우미", included: true, quantity: 6 },
      { id: "vehicle-4", name: "장례 차량", included: true, quantity: 1 },
    ],
    excludedItems: ["빈소 사용료", "식음료 비용", "유골함 및 의전용품"],
    source,
    isSponsored: false,
    highlights: ["월 2만 5천 원 예시", "기본 의전 구성"],
  },
  {
    id: "10000000-0000-4000-8000-000000000005",
    companyId: "20000000-0000-4000-8000-000000000005",
    companyName: "마음샘플",
    companySummary: "비교 화면을 위한 가상 회사 정보입니다.",
    name: "함께하는 길 600",
    totalPrice: krw(6_000_000),
    monthlyPayment: krw(50_000),
    paymentMonths: 120,
    serviceItems: [
      { id: "guide-5", name: "장례지도사", included: true, quantity: 1 },
      { id: "helper-5", name: "장례 도우미", included: true, quantity: 15 },
      { id: "vehicle-5", name: "장례 차량", included: true, quantity: 2 },
      { id: "urn-5", name: "고급 유골함", included: true, quantity: 1 },
      { id: "flower-5", name: "헌화용 국화", included: true, quantity: 70 },
      { id: "cloth-5", name: "수의", included: true, quantity: 1 },
    ],
    excludedItems: ["빈소 사용료", "식음료 비용", "장지 관련 비용"],
    source,
    isSponsored: false,
    highlights: ["월 5만 원 예시", "의전 인력·용품 구성 예시"],
  },
];

const makePrice = (id: string, name: string, amount: number): FuneralHall["prices"][number] => ({
  id,
  name,
  price: krw(amount),
  basis: "1일 기준 예시",
  effectiveFrom: "2026-10-01",
  source,
});

const makeHall = (
  id: string,
  name: string,
  address: string,
  region: string,
  district: string,
  roomCount: number,
  rent: number,
  storage: number,
  management: number,
  amenityTags: string[],
): DemoFuneralHall => {
  const prices = [
    makePrice(`${id}-rent`, "빈소 사용료", rent),
    makePrice(`${id}-storage`, "안치료", storage),
    makePrice(`${id}-management`, "관리비", management),
  ];

  return {
    id,
    name,
    address,
    region,
    district,
    roomCount,
    amenityTags,
    facilitySummary: "화면 확인용으로 만든 가상 시설 정보입니다.",
    prices,
    estimatedThreeDayTotal: krw(prices.reduce((total, item) => total + item.price.amount, 0) * 3),
    source,
  };
};

export const DEMO_FUNERAL_HALLS: DemoFuneralHall[] = [
  makeHall(
    "30000000-0000-4000-8000-000000000001",
    "강남 샘플 장례문화원",
    "서울 강남구 예시로 10",
    "서울",
    "강남구",
    8,
    320_000,
    90_000,
    55_000,
    ["주차 가능", "대중교통 접근", "가족 휴게실"],
  ),
  makeHall(
    "30000000-0000-4000-8000-000000000002",
    "서울 예시 추모관",
    "서울 서초구 샘플길 21",
    "서울",
    "서초구",
    6,
    280_000,
    80_000,
    50_000,
    ["주차 가능", "장애인 편의시설"],
  ),
  makeHall(
    "30000000-0000-4000-8000-000000000003",
    "부산 샘플 장례식장",
    "부산 해운대구 가상로 32",
    "부산",
    "해운대구",
    7,
    250_000,
    75_000,
    45_000,
    ["주차 가능", "가족 휴게실"],
  ),
  makeHall(
    "30000000-0000-4000-8000-000000000004",
    "인천 가상 추모시설",
    "인천 연수구 예시대로 44",
    "인천",
    "연수구",
    5,
    210_000,
    65_000,
    42_000,
    ["대중교통 접근", "장애인 편의시설"],
  ),
  makeHall(
    "30000000-0000-4000-8000-000000000005",
    "대전 예시 장례문화원",
    "대전 유성구 샘플로 55",
    "대전",
    "유성구",
    4,
    190_000,
    60_000,
    40_000,
    ["주차 가능", "가족 휴게실"],
  ),
];
