import { defaultVisitorProfile } from './customerProfiles';
import { SK_AGE_BRACKETS } from '../types/customerProfile';

export const TOTAL_VISITORS = 23060;

export const festivalInfo = {
  name: '해오름 야간문화축제',
  period: '2025.10.01 ~ 2025.10.05',
  location: '강원도 속초시 해오름광장 일원',
  organizer: '속초시청 관광문화과',
};

export const marketingKpis = {
  pushSent: 125000,
  reached: 98200,
  clicks: 14730,
  clickRate: 15.0,
};

export const targetAudienceSize = 150879;

export const targetSegments = [
  {
    label: '2050 여성',
    active: true,
    tooltip: 'SK 연령 데이터 기반',
  },
  {
    label: '가족단위',
    active: true,
    tooltip: '기혼/키즈 App 다회 이용 고객/방문 목적지 중 유치원,초등학교 다회 방문 고객',
  },
  {
    label: '수도권거주',
    active: true,
    tooltip: 'SK 위치데이터 기반 거주지 및 근무지 수도권 고객',
  },
  {
    label: '여행/관광 관심 고객',
    active: true,
    tooltip: '여행 서비스 App 다회 이용 고객',
  },
];

export type PromoMaterialId = 'promo-push' | 'survey-push' | 'main-banner';

export interface MaterialKpi {
  label: string;
  value: number;
  unit: string;
  change?: number;
  changeLabel?: string;
  highlight?: boolean;
  decimals?: number;
}

export interface PromoMaterial {
  id: PromoMaterialId;
  title: string;
  description: string;
  stats: { sent: number; clicks: number; impressions?: number };
  kpis: MaterialKpi[];
  schedule: { type: 'send' | 'exposure'; label: string; period: string };
  previews: {
    label: string;
    image: string;
    type: 'notification' | 'banner' | 'flyer' | 'app';
  }[];
}

export const surveyLocationSetting = {
  mapImage: '/marketing/haeoreum-map.png',
  scope: '해오름시 중앙공원 일대 · 반경 500m',
  target: 'Geofence 내 축제 방문 고객',
  estimatedReach: 12450,
};

export const promoMaterials: PromoMaterial[] = [
  {
    id: 'promo-push',
    title: '홍보 푸쉬',
    description: '2026 야간문화 축제 홍보 푸쉬',
    stats: { sent: 85000, clicks: 10200 },
    schedule: { type: 'send', label: '발송일', period: '2025.09.28' },
    kpis: [
      { label: '푸쉬 발송 수', value: 85000, unit: '건', change: 12, changeLabel: '전년 대비' },
      { label: '도달 고객 수', value: 72800, unit: '명', change: 9, changeLabel: '전년 대비' },
      { label: '클릭 수', value: 10200, unit: '건', change: 18, changeLabel: '전년 대비' },
      { label: '클릭율', value: 12.0, unit: '%', change: 2.1, changeLabel: '전년 대비', highlight: true, decimals: 1 },
    ],
    previews: [
      { label: '푸쉬 알림 화면', image: '/marketing/promo-push-notification.png', type: 'notification' },
      { label: '푸쉬 이미지', image: '/marketing/promo-push-banner.png', type: 'banner' },
    ],
  },
  {
    id: 'survey-push',
    title: '설문 참여 푸쉬',
    description: '방문 후 설문 참여 독려 푸쉬',
    stats: { sent: 40000, clicks: 4530 },
    schedule: { type: 'send', label: '발송일', period: '2025.10.02 ~ 2025.10.05' },
    kpis: [
      { label: '푸쉬 발송 수', value: 40000, unit: '건', change: 8, changeLabel: '전년 대비' },
      { label: '도달 고객 수', value: 33600, unit: '명', change: 6, changeLabel: '전년 대비' },
      { label: '클릭 수', value: 4530, unit: '건', change: 15, changeLabel: '전년 대비' },
      { label: '클릭율', value: 11.3, unit: '%', change: 1.8, changeLabel: '전년 대비', highlight: true, decimals: 1 },
    ],
    previews: [
      { label: '푸쉬 알림 화면', image: '/marketing/survey-push-notification.png', type: 'notification' },
      { label: '푸쉬 이미지', image: '/marketing/survey-push-banner.png', type: 'banner' },
    ],
  },
  {
    id: 'main-banner',
    title: '메인 배너',
    description: '모바일 전단지 및 앱 배너 노출',
    stats: { sent: 0, clicks: 42800, impressions: 892000 },
    schedule: { type: 'exposure', label: '노출 기간', period: '2025.09.20 ~ 2025.10.10' },
    kpis: [
      { label: '노출수', value: 892000, unit: '건', change: 32, changeLabel: '전년 대비' },
      { label: '클릭수', value: 42800, unit: '건', change: 18, changeLabel: '전년 대비' },
      { label: '클릭율', value: 4.8, unit: '%', change: 0.6, changeLabel: '전년 대비', highlight: true, decimals: 1 },
    ],
    previews: [
      { label: '모바일 전단지', image: '/marketing/main-banner-flyer.png', type: 'flyer' },
      { label: '앱 화면', image: '/marketing/main-banner-app.png', type: 'app' },
    ],
  },
];

export const regionalResponse = [
  { region: '서울', rate: 18.5, visitors: 4250 },
  { region: '경기', rate: 22.3, visitors: 5120 },
  { region: '인천', rate: 12.8, visitors: 2940 },
  { region: '충청', rate: 9.2, visitors: 2110 },
  { region: '강원', rate: 28.4, visitors: 6520 },
  { region: '기타', rate: 8.8, visitors: 2020 },
];

export const visitorDemographics = {
  gender: defaultVisitorProfile.gender,
  age: defaultVisitorProfile.age,
  residence: defaultVisitorProfile.residence!,
  interests: defaultVisitorProfile.interests!,
};

function regionAge(seed: number) {
  const base = [6, 4, 6, 11, 13, 15, 14, 11, 9, 11];
  return SK_AGE_BRACKETS.map((label, i) => ({
    label,
    value: Math.max(2, base[i] + ((seed + i * 3) % 5) - 2),
  }));
}

function regionGender(femalePct: number) {
  return [
    { label: '여성', value: femalePct },
    { label: '남성', value: 100 - femalePct },
  ];
}

export const topInflowRegions = [
  { rank: 1, slug: 'suwon', city: '수원', count: 2840, pct: 12.3, gender: regionGender(56), age: regionAge(1) },
  { rank: 2, slug: 'seongnam', city: '성남', count: 2310, pct: 10.0, gender: regionGender(54), age: regionAge(2) },
  { rank: 3, slug: 'yongin', city: '용인', count: 1980, pct: 8.6, gender: regionGender(58), age: regionAge(3) },
  { rank: 4, slug: 'incheon', city: '인천', count: 1750, pct: 7.6, gender: regionGender(52), age: regionAge(4) },
  { rank: 5, slug: 'goyang', city: '고양', count: 1620, pct: 7.0, gender: regionGender(57), age: regionAge(5) },
  { rank: 6, slug: 'sokcho', city: '속초', count: 1480, pct: 6.4, gender: regionGender(51), age: regionAge(6) },
  { rank: 7, slug: 'chuncheon', city: '춘천', count: 1290, pct: 5.6, gender: regionGender(53), age: regionAge(7) },
  { rank: 8, slug: 'bucheon', city: '부천', count: 1150, pct: 5.0, gender: regionGender(55), age: regionAge(8) },
  { rank: 9, slug: 'anyang', city: '안양', count: 980, pct: 4.2, gender: regionGender(59), age: regionAge(9) },
  { rank: 10, slug: 'hwaseong', city: '화성', count: 870, pct: 3.8, gender: regionGender(54), age: regionAge(10) },
];

export type InflowRegion = (typeof topInflowRegions)[number];

export const interestsAnalysis = {
  summary: [
    '식음료·컨텐츠·ART/전시 세그먼트가 일반 기준 대비 lift가 가장 높음',
    '가족 단위 방문 특성상 출산/육아 세그먼트도 일반 대비 크게 높게 나타남',
  ],
  overall: defaultVisitorProfile.interests!,
};

export const stayTimeAnalysis = [
  { label: '1시간 미만', value: 15, count: 3460 },
  { label: '1~3시간', value: 42, count: 9688 },
  { label: '3~5시간', value: 28, count: 6456 },
  { label: '5시간 이상', value: 15, count: 3456 },
];

export const beforeVisitPlaces = [
  { label: '버스터미널', value: 32 },
  { label: 'KTX역', value: 28 },
  { label: '해수욕장', value: 22 },
  { label: '관광지', value: 12 },
  { label: '기타', value: 6 },
];

export const afterVisitPlaces = [
  { label: '먹거리 상권', value: 38 },
  { label: '카페거리', value: 22 },
  { label: '전통시장', value: 18 },
  { label: '숙박시설', value: 12 },
  { label: '관광지', value: 10 },
];

export const movementAnalysis = {
  before: {
    items: beforeVisitPlaces.map((p) => ({ label: p.label, overall: p.value })),
    series: [
      { label: '10대', color: '#ea002c', values: [14, 12, 18, 10, 8] },
      { label: '20대', color: '#f47725', values: [22, 28, 20, 16, 12] },
      { label: '30대', color: '#ff8c42', values: [28, 26, 24, 20, 14] },
      { label: '40대', color: '#ffc078', values: [20, 18, 22, 24, 18] },
      { label: '50대', color: '#c9a227', values: [10, 10, 12, 22, 28] },
      { label: '60대 이상', color: '#adb5bd', values: [6, 6, 4, 8, 20] },
    ],
    genderSeries: [
      { label: '여성', color: '#f47725', values: [54, 52, 56, 50, 48] },
      { label: '남성', color: '#adb5bd', values: [46, 48, 44, 50, 52] },
    ],
  },
  after: {
    items: afterVisitPlaces.map((p) => ({ label: p.label, overall: p.value })),
    series: [
      { label: '10대', color: '#ea002c', values: [12, 14, 16, 8, 10] },
      { label: '20대', color: '#f47725', values: [30, 34, 24, 12, 16] },
      { label: '30대', color: '#ff8c42', values: [32, 30, 26, 18, 14] },
      { label: '40대', color: '#ffc078', values: [18, 16, 22, 20, 16] },
      { label: '50대', color: '#c9a227', values: [6, 8, 10, 26, 22] },
      { label: '60대 이상', color: '#adb5bd', values: [2, 4, 2, 16, 22] },
    ],
    genderSeries: [
      { label: '여성', color: '#f47725', values: [58, 62, 54, 48, 52] },
      { label: '남성', color: '#adb5bd', values: [42, 38, 46, 52, 48] },
    ],
  },
};

export const surveyKpis = {
  pushSent: 40000,
  responses: 12480,
  responseRate: 31.2,
  satisfaction: 4.3,
  revisitIntent: 78,
  nps: 62,
};

export const visitPurposes = [
  { label: '드론쇼', value: 35 },
  { label: '공연', value: 22 },
  { label: '먹거리', value: 18 },
  { label: '관광', value: 15 },
  { label: '가족 나들이', value: 10 },
];

export const awarenessChannels = [
  { label: '푸쉬', value: 32 },
  { label: 'SNS', value: 28 },
  { label: '지인 추천', value: 22 },
  { label: '현수막', value: 12 },
  { label: '기타', value: 6 },
];

export const spendingAnalysis = {
  venueSpending: { avg: 28500, total: 355680000 },
  additionalSpending: { avg: 42300, total: 527904000 },
  accommodation: { stayed: 42, avg: 89000 },
  revisitIntent: 78,
};

export const surveyComments = [
  { id: 1, text: '드론쇼가 정말 멋있었습니다. 가족 모두 만족했어요!', sentiment: 'positive', category: '드론쇼' },
  { id: 2, text: '주차 공간이 부족해서 30분 이상 대기했습니다.', sentiment: 'negative', category: '주차' },
  { id: 3, text: '먹거리존 메뉴가 다양해서 좋았습니다.', sentiment: 'positive', category: '먹거리' },
  { id: 4, text: '먹거리존 확대가 필요합니다. 줄이 너무 길었어요.', sentiment: 'negative', category: '먹거리' },
  { id: 5, text: '야경과 함께하는 공연이 로맨틱했습니다.', sentiment: 'positive', category: '공연' },
  { id: 6, text: '안내 표지판이 더 필요합니다. 길을 헤맸어요.', sentiment: 'negative', category: '안내' },
];

export const aiSummary = [
  '드론쇼 만족도가 전체 응답자의 85% 이상에서 높게 평가됨',
  '주차 관련 개선 요구가 전체 부정 의견의 42%를 차지',
  '가족 단위 방문객의 재방문 의향이 82%로 가장 높음',
  '먹거리존 확대 및 대기시간 개선이 핵심 개선 과제로 도출됨',
];

export const reportSections = [
  { id: 'overview', title: '행사 개요', status: 'complete' },
  { id: 'marketing', title: '홍보 성과', status: 'complete' },
  { id: 'visitors', title: '방문객 분석', status: 'complete' },
  { id: 'inflow', title: '유입지역 분석', status: 'complete' },
  { id: 'stay', title: '체류시간 분석', status: 'complete' },
  { id: 'movement', title: '방문 전/후 이동 분석', status: 'complete' },
  { id: 'survey', title: '만족도 조사', status: 'complete' },
  { id: 'ai', title: 'AI 인사이트', status: 'complete' },
  { id: 'improvement', title: '개선 제안', status: 'complete' },
];

export const aiInsights = [
  {
    title: '홍보 효율성',
    content: '수도권 2050 여성 타겟 클릭율이 18.2%로 전체 평균 대비 21% 높음. 유사 타겟 확대 권장.',
  },
  {
    title: '방문 패턴',
    content: '수도권·인근 광역시 유입이 높고, 가족·연인 동반 방문 비중이 상대적으로 큼. 체류시간 1~3시간 구간이 가장 많음.',
  },
  {
    title: '개선 제안',
    content: '주차장 확충, 먹거리존 좌석 확대, 구역별 안내 표지판 설치를 우선 과제로 제안.',
  },
];
