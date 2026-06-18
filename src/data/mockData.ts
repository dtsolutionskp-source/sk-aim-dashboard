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
  ctr: 15.0,
  conversionRate: 8.2,
};

export const targetSegments = [
  { label: '30~40대 여성', active: true },
  { label: '가족 단위', active: true },
  { label: '수도권 거주', active: true },
  { label: '여행/관광 관심 고객', active: true },
];

export const promoMaterials = [
  {
    id: 1,
    title: '축제 홍보 푸쉬',
    type: 'push',
    description: '해오름 야간문화축제 개막 안내',
    gradient: 'from-orange-400 to-red-500',
    stats: { sent: 85000, clicks: 10200 },
  },
  {
    id: 2,
    title: '설문 참여 푸쉬',
    type: 'push',
    description: '방문 후 설문 참여 독려',
    gradient: 'from-amber-400 to-orange-500',
    stats: { sent: 40000, clicks: 4530 },
  },
  {
    id: 3,
    title: '메인 배너',
    type: 'banner',
    description: 'T map 앱 메인 배너 노출',
    gradient: 'from-sky-400 to-blue-500',
    stats: { sent: 0, clicks: 0, impressions: 245000 },
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
  gender: [
    { label: '여성', value: 58, count: 13386 },
    { label: '남성', value: 42, count: 9674 },
  ],
  age: [
    { label: '20대', value: 18 },
    { label: '30대', value: 32 },
    { label: '40대', value: 28 },
    { label: '50대', value: 15 },
    { label: '60대+', value: 7 },
  ],
  residence: [
    { label: '수도권', value: 52 },
    { label: '강원', value: 28 },
    { label: '충청', value: 12 },
    { label: '기타', value: 8 },
  ],
  interests: [
    { label: '관광/여행', value: 45 },
    { label: '음식/맛집', value: 28 },
    { label: '문화/공연', value: 18 },
    { label: '가족/육아', value: 9 },
  ],
};

export const topInflowRegions = [
  { rank: 1, city: '수원', count: 2840, pct: 12.3 },
  { rank: 2, city: '성남', count: 2310, pct: 10.0 },
  { rank: 3, city: '용인', count: 1980, pct: 8.6 },
  { rank: 4, city: '인천', count: 1750, pct: 7.6 },
  { rank: 5, city: '고양', count: 1620, pct: 7.0 },
  { rank: 6, city: '속초', count: 1480, pct: 6.4 },
  { rank: 7, city: '춘천', count: 1290, pct: 5.6 },
  { rank: 8, city: '부천', count: 1150, pct: 5.0 },
  { rank: 9, city: '안양', count: 980, pct: 4.2 },
  { rank: 10, city: '화성', count: 870, pct: 3.8 },
];

export const stayTimeAnalysis = [
  { label: '1시간 미만', value: 15, count: 3460 },
  { label: '1~3시간', value: 42, count: 9688 },
  { label: '3~5시간', value: 28, count: 6456 },
  { label: '5시간 이상', value: 15, count: 3456 },
];

export const gridZones = [
  { id: 'A1', visitors: 1240, avgStay: 45, gender: { female: 62, male: 38 }, age: '30대' },
  { id: 'A2', visitors: 2180, avgStay: 72, gender: { female: 55, male: 45 }, age: '30~40대' },
  { id: 'A3', visitors: 890, avgStay: 38, gender: { female: 48, male: 52 }, age: '20~30대' },
  { id: 'B1', visitors: 3420, avgStay: 95, gender: { female: 58, male: 42 }, age: '가족 단위' },
  { id: 'B2', visitors: 4560, avgStay: 120, gender: { female: 52, male: 48 }, age: '전 연령' },
  { id: 'B3', visitors: 1680, avgStay: 55, gender: { female: 65, male: 35 }, age: '20~40대' },
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

export const economicImpact = [
  { label: '식당', amount: 428000000, pct: 35 },
  { label: '카페', amount: 186000000, pct: 15 },
  { label: '전통시장', amount: 248000000, pct: 20 },
  { label: '숙박업소', amount: 372000000, pct: 30 },
];

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
  { id: 'survey', title: '설문 분석', status: 'complete' },
  { id: 'economic', title: '경제적 파급효과', status: 'complete' },
  { id: 'ai', title: 'AI 인사이트', status: 'complete' },
  { id: 'improvement', title: '개선 제안', status: 'complete' },
];

export const aiInsights = [
  {
    title: '홍보 효율성',
    content: '수도권 30~40대 여성 타겟 CTR이 18.2%로 전체 평균 대비 21% 높음. 유사 타겟 확대 권장.',
  },
  {
    title: '공간 활용',
    content: 'B2 구역(메인 무대) 체류시간 평균 120분으로 최고. A3 구역은 유동 인구 대비 체류시간 낮아 콘텐츠 보강 필요.',
  },
  {
    title: '경제 효과',
    content: '축제 방문 후 지역 추가 소비 총액 5.3억원. 숙박 연계 시 경제 파급효과 30% 이상 증대 예상.',
  },
  {
    title: '개선 제안',
    content: '주차장 확충, 먹거리존 좌석 확대, 구역별 안내 표지판 설치를 우선 과제로 제안.',
  },
];
