/** 해오름 야간문화축제 방문객 만족도 조사 — 공공기관 보고서용 데이터 */

export const TOTAL_RESPONDENTS = 487;

/** 연령대 공통 색상 (상세 분석용) */
export const AGE_SERIES = [
  { label: '10대', color: '#ea002c' },
  { label: '20대', color: '#f47725' },
  { label: '30대', color: '#ff8c42' },
  { label: '40대', color: '#ffc078' },
  { label: '50대 이상', color: '#adb5bd' },
] as const;

export type UnifiedChartData = {
  items: { label: string; overall: number }[];
  series: { label: string; color: string; values: number[] }[];
  genderSeries?: { label: string; color: string; values: number[] }[];
};

export const surveyOverview = {
  title: '축제 방문객 만족도 조사',
  subtitle: '2026 해오름 야간문화축제 방문객 대상 설문조사 결과',
  period: '2026.10.24 ~ 2026.10.26',
  target: '2026 해오름 야간 문화 축제 방문 고객',
  purpose:
    '축제 방문객의 만족도, 방문 목적, 소비행태, 재방문 의향 등을 파악하고 향후 축제 운영 및 정책 수립에 활용하기 위함',
  kpis: [
    { label: '응답자', value: '487', unit: '명', highlight: true },
    { label: '평균 만족도', value: '4.4', unit: '점', highlight: true },
    { label: '재방문 의향', value: '91', unit: '%' },
    { label: '조사기간', value: '10.24~10.26', unit: '' },
  ],
};

export const respondentProfile = {
  gender: [
    { label: '남성', value: 48, color: '#868e96' },
    { label: '여성', value: 52, color: '#f47725' },
  ],
  age: [
    { label: '10대 이하', value: 4 },
    { label: '10대 초반', value: 6 },
    { label: '10대 후반', value: 9 },
    { label: '20대', value: 18 },
    { label: '30대', value: 22 },
    { label: '40대', value: 19 },
    { label: '50대', value: 14 },
    { label: '60대 이상', value: 8 },
  ],
  residence: [
    { label: '해오름시', value: 32 },
    { label: '인근 시군', value: 28 },
    { label: '광역권', value: 26 },
    { label: '타지역', value: 14 },
  ],
  residenceType: [
    { label: '거주자', value: 32, color: '#f47725' },
    { label: '외지인', value: 68, color: '#adb5bd' },
  ],
  /** 외지인 출발 지역 (외지인 331명 기준 비율) */
  nonResidentOrigins: [
    { label: '원주시', value: 14 },
    { label: '횡성군', value: 12 },
    { label: '춘천시', value: 8 },
    { label: '홍천군', value: 5 },
    { label: '수도권', value: 22 },
    { label: '강원 기타', value: 6 },
    { label: '충청권', value: 5 },
    { label: '타 광역시', value: 6 },
  ],
  nonResidentByCategory: [
    { label: '인근 시군', value: 41, detail: '원주·횡성·춘천·홍천 등' },
    { label: '광역권', value: 38, detail: '수도권·충청권 등' },
    { label: '타지역', value: 21, detail: '부산·대구·광주 등' },
  ],
  companion: [
    { label: '가족', value: 43, color: '#f47725' },
    { label: '연인', value: 18, color: '#ff8c42' },
    { label: '친구', value: 22, color: '#adb5bd' },
    { label: '단체', value: 8, color: '#868e96' },
    { label: '혼자', value: 9, color: '#ced4da' },
  ],
  unified: {
    gender: {
      items: [{ label: '남성', overall: 48 }, { label: '여성', overall: 52 }],
      series: [
        { label: '10대', color: '#ea002c', values: [8, 6] },
        { label: '20대', color: '#f47725', values: [22, 18] },
        { label: '30대', color: '#ff8c42', values: [24, 26] },
        { label: '40대', color: '#ffc078', values: [20, 22] },
        { label: '50대 이상', color: '#adb5bd', values: [26, 28] },
      ],
    },
    companion: {
      items: [
        { label: '가족', overall: 43 },
        { label: '연인', overall: 18 },
        { label: '친구', overall: 22 },
        { label: '단체', overall: 8 },
        { label: '혼자', overall: 9 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [28, 8, 18, 5, 12] },
        { label: '20대', color: '#f47725', values: [22, 24, 32, 6, 8] },
        { label: '30대', color: '#ff8c42', values: [48, 20, 18, 8, 10] },
        { label: '40대', color: '#ffc078', values: [52, 16, 20, 10, 12] },
        { label: '50대 이상', color: '#adb5bd', values: [38, 12, 24, 14, 18] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [54, 62, 46, 44, 38] },
        { label: '남성', color: '#adb5bd', values: [46, 38, 54, 56, 62] },
      ],
    },
    residence: {
      items: [
        { label: '해오름시', overall: 32 },
        { label: '인근 시군', overall: 28 },
        { label: '광역권', overall: 26 },
        { label: '타지역', overall: 14 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [18, 22, 28, 32] },
        { label: '20대', color: '#f47725', values: [24, 26, 30, 20] },
        { label: '30대', color: '#ff8c42', values: [30, 28, 26, 16] },
        { label: '40대', color: '#ffc078', values: [34, 30, 22, 14] },
        { label: '50대 이상', color: '#adb5bd', values: [38, 32, 18, 12] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [50, 52, 54, 48] },
        { label: '남성', color: '#adb5bd', values: [50, 48, 46, 52] },
      ],
    },
    nonResidentOrigins: {
      items: [
        { label: '원주시', overall: 14 },
        { label: '횡성군', overall: 12 },
        { label: '춘천시', overall: 8 },
        { label: '홍천군', overall: 5 },
        { label: '수도권', overall: 22 },
        { label: '강원 기타', overall: 6 },
        { label: '충청권', overall: 5 },
        { label: '타 광역시', overall: 6 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [8, 10, 6, 4, 18, 5, 4, 5] },
        { label: '20대', color: '#f47725', values: [12, 14, 10, 6, 28, 8, 6, 8] },
        { label: '30대', color: '#ff8c42', values: [16, 12, 8, 5, 24, 6, 5, 6] },
        { label: '40대', color: '#ffc078', values: [14, 13, 9, 5, 20, 7, 6, 5] },
        { label: '50대 이상', color: '#adb5bd', values: [10, 11, 7, 4, 16, 5, 4, 4] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [52, 54, 50, 48, 56, 52, 50, 54] },
        { label: '남성', color: '#adb5bd', values: [48, 46, 50, 52, 44, 48, 50, 46] },
      ],
    },
    residenceType: {
      items: [
        { label: '거주자', overall: 32 },
        { label: '외지인', overall: 68 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [12, 18] },
        { label: '20대', color: '#f47725', values: [20, 22] },
        { label: '30대', color: '#ff8c42', values: [24, 26] },
        { label: '40대', color: '#ffc078', values: [22, 20] },
        { label: '50대 이상', color: '#adb5bd', values: [22, 14] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [48, 55] },
        { label: '남성', color: '#adb5bd', values: [52, 45] },
      ],
    },
  },
  byResidenceType: {
    companion: [
      { group: '거주자', items: [{ label: '가족', value: 38 }, { label: '친구', value: 28 }, { label: '혼자', value: 18 }] },
      { group: '외지인', items: [{ label: '가족', value: 45 }, { label: '연인', value: 22 }, { label: '친구', value: 20 }] },
    ],
    satisfaction: [
      { group: '거주자', items: [{ label: '전체', value: 4.3, score: 4.3 }, { label: '드론쇼', value: 4.7, score: 4.7 }, { label: '푸드존', value: 4.0, score: 4.0 }] },
      { group: '외지인', items: [{ label: '전체', value: 4.5, score: 4.5 }, { label: '드론쇼', value: 4.9, score: 4.9 }, { label: '푸드존', value: 4.3, score: 4.3 }] },
    ],
  },
};

export const awarenessChannels = {
  overall: [
    { label: '푸쉬', value: 28 },
    { label: 'SNS', value: 24 },
    { label: '유튜브', value: 14 },
    { label: '검색', value: 12 },
    { label: '지인추천', value: 18 },
    { label: '기타', value: 4 },
  ],
  byAge: [
    { group: '20~30대', top: 'SNS 34%', insight: 'SNS·유튜브 비중 높음' },
    { group: '40~50대', top: '푸쉬 31%', insight: '푸쉬·지인추천 비중 높음' },
    { group: '가족 단위', top: '지인추천 26%', insight: '지인추천·검색 비중 높음' },
  ],
  byGender: [
    { group: '남성', items: [{ label: '푸쉬', value: 32 }, { label: 'SNS', value: 20 }, { label: '지인추천', value: 16 }] },
    { group: '여성', items: [{ label: 'SNS', value: 28 }, { label: '푸쉬', value: 24 }, { label: '지인추천', value: 20 }] },
  ],
  byResidenceType: [
    { group: '거주자', items: [{ label: '푸쉬', value: 35 }, { label: '지인추천', value: 22 }, { label: 'SNS', value: 18 }] },
    { group: '외지인', items: [{ label: 'SNS', value: 28 }, { label: '검색', value: 18 }, { label: '유튜브', value: 16 }] },
  ],
  aiInsights: [
    '20~30대는 SNS·유튜브 기반 인지 비중이 높아 디지털 채널 홍보 효과적',
    '50대 이상은 푸쉬 알림 비중이 높아 타겟 푸쉬 운영 적합',
    '외지인은 SNS·검색 비중이 높아 온라인 홍보 채널 강화 필요',
    '거주자는 푸쉬·지인추천 비중이 높아 지역 기반 홍보 효과적',
  ],
  unified: {
    items: [
      { label: '푸쉬', overall: 28 },
      { label: 'SNS', overall: 24 },
      { label: '유튜브', overall: 14 },
      { label: '검색', overall: 12 },
      { label: '지인추천', overall: 18 },
      { label: '기타', overall: 4 },
    ],
    series: [
      { label: '10대', color: '#ea002c', values: [10, 32, 18, 8, 12, 3] },
      { label: '20대', color: '#f47725', values: [14, 36, 22, 14, 10, 4] },
      { label: '30대', color: '#ff8c42', values: [22, 28, 16, 12, 16, 6] },
      { label: '40대', color: '#ffc078', values: [32, 20, 12, 10, 20, 6] },
      { label: '50대 이상', color: '#adb5bd', values: [38, 14, 8, 8, 26, 4] },
    ],
    genderSeries: [
      { label: '여성', color: '#f47725', values: [46, 58, 52, 50, 54, 48] },
      { label: '남성', color: '#adb5bd', values: [54, 42, 48, 50, 46, 52] },
    ],
  },
};

export const visitPurpose = {
  /** 전체 + 연령별 통합 차트용 */
  unified: {
    purposes: [
      { label: '드론쇼 관람', overall: 38 },
      { label: '가족 나들이', overall: 27 },
      { label: '공연 관람', overall: 15 },
      { label: '먹거리 체험', overall: 13 },
      { label: '기타', overall: 7 },
    ],
    series: [
      { label: '10대', color: '#ea002c', values: [6, 10, 14, 5, 3] },
      { label: '20대', color: '#f47725', values: [24, 12, 34, 8, 4] },
      { label: '30대', color: '#ff8c42', values: [20, 32, 12, 24, 6] },
      { label: '40대', color: '#ffc078', values: [16, 22, 10, 16, 8] },
      { label: '50대 이상', color: '#adb5bd', values: [14, 14, 16, 12, 10] },
    ],
    genderSeries: [
      { label: '여성', color: '#f47725', values: [42, 58, 48, 52, 44] },
      { label: '남성', color: '#adb5bd', values: [58, 42, 52, 48, 56] },
    ],
  },
  overall: [
    { label: '드론쇼 관람', value: 38 },
    { label: '가족 나들이', value: 27 },
    { label: '공연 관람', value: 15 },
    { label: '먹거리 체험', value: 13 },
    { label: '기타', value: 7 },
  ],
  byAge: [
    { group: '20대', items: [{ label: '공연', value: 32 }, { label: '포토존', value: 28 }, { label: '드론쇼', value: 22 }] },
    { group: '30~40대', items: [{ label: '가족 체험', value: 38 }, { label: '먹거리', value: 26 }, { label: '드론쇼', value: 20 }] },
    { group: '50대 이상', items: [{ label: '공연', value: 30 }, { label: '관광', value: 28 }, { label: '먹거리', value: 18 }] },
  ],
  byResidenceType: [
    { group: '거주자', items: [{ label: '가족 나들이', value: 35 }, { label: '드론쇼', value: 28 }, { label: '먹거리', value: 18 }] },
    { group: '외지인', items: [{ label: '드론쇼', value: 42 }, { label: '관광', value: 22 }, { label: '공연', value: 18 }] },
  ],
  byGender: [
    { group: '남성', items: [{ label: '드론쇼', value: 40 }, { label: '공연', value: 22 }, { label: '먹거리', value: 15 }] },
    { group: '여성', items: [{ label: '가족 나들이', value: 35 }, { label: '드론쇼', value: 32 }, { label: '먹거리', value: 18 }] },
  ],
  aiInsights: [
    '20대는 체험·포토존 등 체험형 콘텐츠 선호도가 높음',
    '30~40대는 가족형 프로그램·먹거리 비중이 높음',
    '외지인은 드론쇼·관광 목적 비중이 거주자 대비 높음',
    '거주자는 가족 나들이 목적 비중이 가장 높음',
  ],
};

export const satisfaction = {
  overall: 4.4,
  maxScore: 5.0,
  byProgram: [
    { label: '드론 라이트쇼', score: 4.8 },
    { label: '미디어아트', score: 4.6 },
    { label: '체험 프로그램', score: 4.4 },
    { label: '푸드존', score: 4.2 },
    { label: '교통', score: 3.4 },
    { label: '안내 서비스', score: 3.8 },
  ],
  byGender: [
    { label: '남성', score: 4.2 },
    { label: '여성', score: 4.6 },
  ],
  byAge: [
    { label: '20대', score: 4.1 },
    { label: '30대', score: 4.3 },
    { label: '40대', score: 4.5 },
    { label: '50대', score: 4.7 },
  ],
  byResidenceType: [
    { label: '거주자', score: 4.3 },
    { label: '외지인', score: 4.5 },
  ],
  topSatisfied: ['야간 경관', '드론쇼', '다양한 볼거리'],
  needsImprovement: ['주차', '교통', '화장실', '대기시간'],
  unified: {
    items: [
      { label: '드론 라이트쇼', overall: 4.8 },
      { label: '미디어아트', overall: 4.6 },
      { label: '체험 프로그램', overall: 4.4 },
      { label: '푸드존', overall: 4.2 },
      { label: '교통', overall: 3.4 },
      { label: '안내 서비스', overall: 3.8 },
    ],
    series: [
      { label: '10대', color: '#ea002c', values: [4.6, 4.5, 4.3, 4.0, 3.2, 3.6] },
      { label: '20대', color: '#f47725', values: [4.7, 4.6, 4.2, 4.1, 3.3, 3.7] },
      { label: '30대', color: '#ff8c42', values: [4.8, 4.6, 4.4, 4.2, 3.4, 3.8] },
      { label: '40대', color: '#ffc078', values: [4.9, 4.7, 4.5, 4.3, 3.5, 3.9] },
      { label: '50대 이상', color: '#adb5bd', values: [4.9, 4.8, 4.6, 4.4, 3.6, 4.1] },
    ],
    genderSeries: [
      { label: '여성', color: '#f47725', values: [48, 50, 52, 54, 46, 50] },
      { label: '남성', color: '#adb5bd', values: [52, 50, 48, 46, 54, 50] },
    ],
  },
};

export const economicEffect = {
  additionalSpending: [
    { label: '소비함', value: 78, color: '#f47725' },
    { label: '소비 안함', value: 22, color: '#dee2e6' },
  ],
  spendingPlaces: [
    { label: '음식점', value: 42 },
    { label: '카페', value: 21 },
    { label: '전통시장', value: 14 },
    { label: '숙박시설', value: 8 },
    { label: '기타', value: 15 },
  ],
  spendingAmount: [
    { label: '3만원 이하', value: 22 },
    { label: '3~5만원', value: 35 },
    { label: '5~10만원', value: 28 },
    { label: '10만원 이상', value: 15 },
  ],
  byResidenceType: [
    { group: '거주자', items: [{ label: '추가 소비', value: 62 }, { label: '음식점', value: 38 }, { label: '카페', value: 22 }] },
    { group: '외지인', items: [{ label: '추가 소비', value: 86 }, { label: '숙박', value: 18 }, { label: '음식점', value: 48 }] },
  ],
  aiInsights: [
    '방문객의 78%가 행사장 외 지역 내 추가 소비 경험',
    '외지인의 추가 소비 비율·지출액이 거주자 대비 높음',
    '음식점 소비 비중이 42%로 가장 높음',
    '야간 체류형 콘텐츠 확대 시 추가 소비 증가 기대',
  ],
  estimatedEffect: '2.5억원',
  avgSpending: '4.8만원',
  unified: {
    additionalSpending: {
      items: [
        { label: '소비함', overall: 78 },
        { label: '소비 안함', overall: 22 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [62, 38] },
        { label: '20대', color: '#f47725', values: [72, 28] },
        { label: '30대', color: '#ff8c42', values: [78, 22] },
        { label: '40대', color: '#ffc078', values: [82, 18] },
        { label: '50대 이상', color: '#adb5bd', values: [76, 24] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [74, 52] },
        { label: '남성', color: '#adb5bd', values: [26, 48] },
      ],
    },
    spendingPlaces: {
      items: [
        { label: '음식점', overall: 42 },
        { label: '카페', overall: 21 },
        { label: '전통시장', overall: 14 },
        { label: '숙박시설', overall: 8 },
        { label: '기타', overall: 15 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [28, 32, 10, 4, 18] },
        { label: '20대', color: '#f47725', values: [38, 28, 12, 6, 16] },
        { label: '30대', color: '#ff8c42', values: [44, 22, 14, 8, 14] },
        { label: '40대', color: '#ffc078', values: [46, 20, 16, 10, 12] },
        { label: '50대 이상', color: '#adb5bd', values: [42, 18, 18, 12, 10] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [52, 58, 48, 46, 50] },
        { label: '남성', color: '#adb5bd', values: [48, 42, 52, 54, 50] },
      ],
    },
    spendingAmount: {
      items: [
        { label: '3만원 이하', overall: 22 },
        { label: '3~5만원', overall: 35 },
        { label: '5~10만원', overall: 28 },
        { label: '10만원 이상', overall: 15 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [38, 32, 22, 8] },
        { label: '20대', color: '#f47725', values: [28, 36, 26, 10] },
        { label: '30대', color: '#ff8c42', values: [20, 38, 30, 12] },
        { label: '40대', color: '#ffc078', values: [18, 34, 32, 16] },
        { label: '50대 이상', color: '#adb5bd', values: [16, 30, 34, 20] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [48, 54, 52, 46] },
        { label: '남성', color: '#adb5bd', values: [52, 46, 48, 54] },
      ],
    },
  },
};

export const revisitIntent = {
  levels: [
    { label: '매우 높음', value: 62 },
    { label: '높음', value: 29 },
    { label: '보통', value: 7 },
    { label: '낮음', value: 2 },
  ],
  totalPositive: 91,
  byResidenceType: [
    { group: '거주자', items: [{ label: '재방문 의향', value: 88 }, { label: '추천 의향', value: 82 }] },
    { group: '외지인', items: [{ label: '재방문 의향', value: 93 }, { label: '추천 의향', value: 91 }] },
  ],
  byGender: [
    { group: '남성', items: [{ label: '재방문', value: 89 }, { label: '추천', value: 85 }] },
    { group: '여성', items: [{ label: '재방문', value: 92 }, { label: '추천', value: 90 }] },
  ],
  unified: {
    levels: {
      items: [
        { label: '매우 높음', overall: 62 },
        { label: '높음', overall: 29 },
        { label: '보통', overall: 7 },
        { label: '낮음', overall: 2 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [48, 32, 14, 6] },
        { label: '20대', color: '#f47725', values: [58, 30, 9, 3] },
        { label: '30대', color: '#ff8c42', values: [64, 28, 6, 2] },
        { label: '40대', color: '#ffc078', values: [66, 26, 6, 2] },
        { label: '50대 이상', color: '#adb5bd', values: [68, 24, 6, 2] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [58, 54, 48, 44] },
        { label: '남성', color: '#adb5bd', values: [42, 46, 52, 56] },
      ],
    },
    nps: {
      items: [
        { label: '추천', overall: 58 },
        { label: '보통', overall: 31 },
        { label: '비추천', overall: 11 },
      ],
      series: [
        { label: '10대', color: '#ea002c', values: [42, 38, 20] },
        { label: '20대', color: '#f47725', values: [52, 34, 14] },
        { label: '30대', color: '#ff8c42', values: [58, 32, 10] },
        { label: '40대', color: '#ffc078', values: [62, 30, 8] },
        { label: '50대 이상', color: '#adb5bd', values: [64, 28, 8] },
      ],
      genderSeries: [
        { label: '여성', color: '#f47725', values: [54, 48, 42] },
        { label: '남성', color: '#adb5bd', values: [46, 52, 58] },
      ],
    },
  },
};

export const nps = {
  promote: 58,
  passive: 31,
  detractor: 11,
  score: 47,
  /** 추천 의향 주관식 — "왜 그렇게 생각하셨나요?" */
  reason: {
    question: '추천 의향에 대해 왜 그렇게 생각하셨나요?',
    keywords: {
      promote: [
        { word: '드론쇼', weight: 5 },
        { word: '야경', weight: 4 },
        { word: '가족', weight: 4 },
        { word: '분위기', weight: 3 },
        { word: '볼거리', weight: 3 },
      ],
      passive: [
        { word: '보통', weight: 4 },
        { word: '혼잡', weight: 3 },
        { word: '대기', weight: 3 },
        { word: '접근성', weight: 2 },
      ],
      detractor: [
        { word: '주차', weight: 5 },
        { word: '교통', weight: 4 },
        { word: '화장실', weight: 3 },
        { word: '안내', weight: 2 },
      ],
    },
    comments: [
      { id: 1, text: '드론쇼가 정말 인상적이어서 주변에 적극 추천하고 싶습니다.', type: 'promote' as const, category: '드론쇼' },
      { id: 2, text: '가족과 함께 가기 좋은 축제라 지인에게 추천했어요.', type: 'promote' as const, category: '가족' },
      { id: 3, text: '야경과 공연이 어우러져 분위기가 좋았습니다.', type: 'promote' as const, category: '분위기' },
      { id: 4, text: '볼거리는 많은데 특별히 추천할 만큼은 아닌 것 같아요.', type: 'passive' as const, category: '보통' },
      { id: 5, text: '사람이 많아서 좀 피곤했지만 나쁘지는 않았습니다.', type: 'passive' as const, category: '혼잡' },
      { id: 6, text: '주차가 너무 어려워서 추천하기 망설여집니다.', type: 'detractor' as const, category: '주차' },
      { id: 7, text: '교통이 막혀서 오래 걸렸어요. 개선되면 추천할 의향 있습니다.', type: 'detractor' as const, category: '교통' },
      { id: 8, text: '다양한 프로그램이 있어서 재방문하고 싶고 추천도 하고 싶어요.', type: 'promote' as const, category: '볼거리' },
    ],
    summary:
      '추천 응답자는 드론쇼·야경·가족 나들이 적합성을 주요 이유로 꼽았으며, 비추천 응답자는 주차·교통 불편을 핵심 사유로 제시함. 보통 응답자는 혼잡·대기시간을 언급하는 경향이 있음.',
  },
};

export const freeResponse = {
  positive: [
    { word: '드론쇼', weight: 5 },
    { word: '야경', weight: 4 },
    { word: '가족', weight: 4 },
    { word: '먹거리', weight: 3 },
    { word: '분위기', weight: 3 },
    { word: '공연', weight: 2 },
  ],
  negative: [
    { word: '주차', weight: 5 },
    { word: '교통', weight: 4 },
    { word: '대기', weight: 3 },
    { word: '혼잡', weight: 3 },
    { word: '화장실', weight: 2 },
  ],
  aiSummary:
    '방문객들은 드론 라이트쇼와 야간 경관에 대해 높은 만족도를 보였으며, 가족 단위 방문객의 긍정 평가가 특히 높게 나타남. 반면 주차 및 교통 혼잡에 대한 개선 요구가 지속적으로 확인됨.',
  comments: [
    { id: 1, text: '드론쇼가 정말 멋있었습니다. 가족 모두 만족했어요!', sentiment: 'positive' as const, category: '드론쇼' },
    { id: 2, text: '주차 공간이 부족해서 30분 이상 대기했습니다.', sentiment: 'negative' as const, category: '주차' },
    { id: 3, text: '먹거리존 메뉴가 다양해서 좋았습니다.', sentiment: 'positive' as const, category: '먹거리' },
    { id: 4, text: '야경과 함께하는 공연이 로맨틱했습니다.', sentiment: 'positive' as const, category: '공연' },
    { id: 5, text: '안내 표지판이 더 필요합니다. 길을 헤맸어요.', sentiment: 'negative' as const, category: '안내' },
    { id: 6, text: '외지에서 왔는데 축제 분위기가 너무 좋았어요. 내년에 또 올게요.', sentiment: 'positive' as const, category: '분위기' },
    { id: 7, text: '화장실 대기가 너무 길었습니다.', sentiment: 'negative' as const, category: '화장실' },
    { id: 8, text: '미디어아트 존이 인상적이었습니다.', sentiment: 'positive' as const, category: '미디어아트' },
    { id: 9, text: '출퇴근 시간대 교통이 막혀서 불편했습니다.', sentiment: 'negative' as const, category: '교통' },
    { id: 10, text: '아이들이 체험 프로그램을 정말 좋아했어요.', sentiment: 'positive' as const, category: '체험' },
  ],
};

export const aiFinalInsights = {
  keyResults: [
    '방문객 만족도 4.4점 (5점 만점)',
    '재방문 의향 91%',
    '방문객 78% 추가 소비 발생',
    '드론 라이트쇼 만족도 최고 (4.8점)',
    '가족 단위 방문객 비중 43%',
  ],
  policyRecommendations: {
    content: ['야간 체류형 프로그램 확대', '가족형 체험 콘텐츠 강화', '미디어아트 존 확충'],
    marketing: ['20~30대 SNS·유튜브 중심 홍보', '50대 이상 푸쉬 알림 집중', '외지인 대상 온라인 검색 광고 강화'],
    operations: ['주차장 확대 및 셔틀버스 운영', '혼잡 시간대 분산 운영', '화장실·안내 표지판 보강'],
  },
  publicInsights: [
    '① 방문객은 드론쇼와 야간 경관에 높은 만족도를 보임',
    '② 행사 방문객 78%가 주변 상권에서 추가 소비 경험',
    '③ 교통·주차 개선 시 재방문 의향 상승 기대',
    '④ 가족 단위 방문객 비중이 높아 가족형 콘텐츠 확대 필요',
  ],
};

export const surveySectionSummaries = {
  overview: [
    '총 487명 응답, 전체 만족도 4.4점·재방문 의향 91%로 전반적으로 긍정적 평가',
    '드론쇼·야간 경관 만족이 높고, 주차·교통 개선이 핵심 과제로 확인됨',
  ],
  profile: [
    '외지인 68%·가족 동반 43%로 외지인·가족 단위 방문이 주류',
    '수도권·인근 시군 유입 비중이 높고, 여성 응답자가 52%로 다소 많음',
  ],
  awareness: [
    '푸쉬(28%)·SNS(24%)가 인지 경로 1·2위',
    '20~30대는 SNS·유튜브, 50대 이상은 푸쉬 비중이 높아 채널별 타겟 홍보 필요',
  ],
  purpose: [
    '드론쇼 관람(38%)·가족 나들이(27%)가 방문 목적 상위',
    '외지인은 드론쇼·관광, 거주자는 가족 나들이 비중이 상대적으로 높음',
  ],
  satisfaction: [
    '전체 만족도 4.4점, 드론 라이트쇼(4.8점)가 가장 높은 호평',
    '교통(3.4점)·안내 서비스(3.8점)는 개선 필요, 주차·화장실 불편이 반복 언급됨',
  ],
  economic: [
    '응답자 78%가 행사장 외 지역에서 추가 소비, 1인 평균 4.8만원 지출',
    '음식점(42%) 소비 비중 최고, 외지인의 추가 소비·지출액이 거주자 대비 높음',
  ],
  revisit: [
    '재방문 의향 긍정 91%, NPS 47점으로 추천 의향도 양호',
    '추천 사유는 드론쇼·야경·가족 적합성, 비추천은 주차·교통 불편이 핵심',
  ],
  comments: [
    '긍정 의견은 드론쇼·야경·가족 나들이 적합성이 중심',
    '부정 의견은 주차·교통·혼잡·대기시간 개선 요구가 반복적으로 확인됨',
  ],
  insights: [
    '드론쇼·야간 경관 만족과 높은 재방문 의향이 축제 경쟁력의 핵심',
    '교통·주차·안내 개선과 가족형·야간 체류 콘텐츠 확대가 정책 우선순위',
  ],
} as const;

export type SurveyDetailId =
  | 'profile'
  | 'awareness'
  | 'purpose'
  | 'satisfaction'
  | 'economic'
  | 'revisit'
  | 'comments';

export const surveyDetailMeta: Record<SurveyDetailId, { title: string; subtitle: string }> = {
  profile: { title: '응답자 프로파일', subtitle: '성별·연령·거주지·동반유형 상세 분석' },
  awareness: { title: '행사 인지 경로', subtitle: '성별·연령·거주지별 교차분석' },
  purpose: { title: '방문 목적 분석', subtitle: '연령·성별·거주지별 교차분석' },
  satisfaction: { title: '행사 만족도 분석', subtitle: '성별·연령·거주지별 교차분석' },
  economic: { title: '지역 경제 효과', subtitle: '소비행태·거주지별 교차분석' },
  revisit: { title: '재방문 및 추천 의향', subtitle: '성별·거주지별 교차분석' },
  comments: { title: '자유 의견', subtitle: '주관식 응답 원문' },
};

/** 퍼센트 → 응답자 수 */
export function toCount(pct: number, total = TOTAL_RESPONDENTS) {
  return Math.round((pct / 100) * total);
}
