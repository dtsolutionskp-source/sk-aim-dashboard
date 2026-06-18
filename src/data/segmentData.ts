import { TOTAL_VISITORS } from './mockData';

const SEGMENT_TOTAL = TOTAL_VISITORS;

/** SK 관심사 세그먼트 17종 */
export const SEGMENT_LABELS = [
  '여행',
  '등산/아웃도어/레저',
  '골프',
  '자동차',
  '뷰티/화장품',
  '패션',
  '식음료',
  '반려동물',
  '게임',
  '가전',
  '건강식품',
  '출산/육아',
  '가구/인테리어',
  '컨텐츠',
  '금융',
  'ART/전시',
  '주류',
] as const;

export type SegmentLabel = (typeof SEGMENT_LABELS)[number];

export type SegmentBadge = 'highlight' | 'outperform' | 'focus';

export interface SegmentProfile {
  id: string;
  label: SegmentLabel;
  benchmarkPct: number;
  targetPct: number;
  lift: number;
  count: number;
  badge?: SegmentBadge;
  insight: string;
  gender: { female: number; male: number };
  benchmarkGender: { female: number; male: number };
  age: { label: string; value: number }[];
  benchmarkAge: { label: string; value: number }[];
}

const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대 이상'];

/** 일반 기준: 20·30대 비중 높음 */
const DEFAULT_BENCHMARK_AGE = [7, 28, 32, 20, 13];

/** 축제 방문객: 40·50대 소폭 치중 */
const DEFAULT_VISITOR_AGE = [9, 20, 22, 28, 21];

function seg(
  id: string,
  label: SegmentLabel,
  benchmarkPct: number,
  targetPct: number,
  opts: {
    badge?: SegmentBadge;
    insight: string;
    gender?: { female: number; male: number };
    benchmarkGender?: { female: number; male: number };
    age?: number[];
    benchmarkAge?: number[];
  },
): SegmentProfile {
  const lift = Math.round((targetPct / benchmarkPct) * 100);
  return {
    id,
    label,
    benchmarkPct,
    targetPct,
    lift,
    count: Math.round((targetPct / 100) * SEGMENT_TOTAL),
    badge: opts.badge,
    insight: opts.insight,
    gender: opts.gender ?? { female: 52, male: 48 },
    benchmarkGender: opts.benchmarkGender ?? { female: 48, male: 52 },
    age: AGE_GROUPS.map((l, i) => ({ label: l, value: opts.age?.[i] ?? DEFAULT_VISITOR_AGE[i] })),
    benchmarkAge: AGE_GROUPS.map((l, i) => ({ label: l, value: opts.benchmarkAge?.[i] ?? DEFAULT_BENCHMARK_AGE[i] })),
  };
}

export const segmentAnalysis = {
  benchmarkLabel: '일반 기준',
  targetLabel: '축제 방문객',
  benchmarkDescription: 'SK 위치데이터 기반 광역 평균 관심사 점유율',
  targetDescription: '2026 해오름 야간문화축제 방문객 관심사 점유율',
  totalVisitors: TOTAL_VISITORS,
  benchmarkGender: { female: 48.2, male: 51.8 },
  targetGender: { female: 55, male: 45 },
  benchmarkAge: [
    { label: '10대', value: 7 },
    { label: '20대', value: 28 },
    { label: '30대', value: 32 },
    { label: '40대', value: 20 },
    { label: '50대 이상', value: 13 },
  ],
  targetAge: [
    { label: '10대', value: 9 },
    { label: '20대', value: 20 },
    { label: '30대', value: 22 },
    { label: '40대', value: 28 },
    { label: '50대 이상', value: 21 },
  ],
  segments: [
    seg('travel', '여행', 38.2, 58.4, {
      badge: 'highlight',
      insight: '일반 기준 대비 여행 관심 점유율이 두드러지게 높습니다.',
      gender: { female: 54, male: 46 },
      age: [9, 20, 22, 28, 21],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('outdoor', '등산/아웃도어/레저', 22.4, 28.6, {
      badge: 'outperform',
      insight: '강원권 축제 특성상 아웃도어·레저 관심이 일반 대비 높게 나타납니다.',
      gender: { female: 46, male: 54 },
      age: [8, 18, 24, 30, 20],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('golf', '골프', 8.1, 11.2, {
      badge: 'outperform',
      insight: '타깃 대비 골프 관심 비중이 상대적으로 높은 편입니다.',
      gender: { female: 32, male: 68 },
      age: [2, 10, 18, 32, 38],
      benchmarkAge: [3, 14, 24, 28, 31],
    }),
    seg('auto', '자동차', 18.5, 26.1, {
      badge: 'highlight',
      insight: '수도권·인근 광역 유입과 맞물려 자동차 관심 비중이 높습니다.',
      gender: { female: 38, male: 62 },
      age: [8, 18, 22, 30, 22],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('beauty', '뷰티/화장품', 24.2, 32.8, {
      badge: 'outperform',
      insight: '야간 축제 방문객 중 뷰티·화장품 관심이 일반 대비 높습니다.',
      gender: { female: 78, male: 22 },
      age: [8, 24, 26, 28, 14],
      benchmarkAge: [8, 32, 34, 18, 8],
    }),
    seg('fashion', '패션', 27.8, 44.5, {
      badge: 'highlight',
      insight: '20~30대 중심으로 패션 관심 점유율이 크게 높습니다.',
      gender: { female: 68, male: 32 },
      age: [10, 26, 28, 24, 12],
      benchmarkAge: [8, 34, 36, 14, 8],
    }),
    seg('food', '식음료', 51.6, 81.3, {
      badge: 'outperform',
      insight: '축제 먹거리·야시장 연계로 식음료 관심이 압도적으로 높습니다.',
      gender: { female: 56, male: 44 },
      age: [9, 20, 22, 28, 21],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('pet', '반려동물', 11.8, 14.2, {
      insight: '반려동물 관심은 일반 수준과 유사하나 가족 동반층에서 소폭 높습니다.',
      gender: { female: 62, male: 38 },
      age: [8, 18, 24, 30, 20],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('game', '게임', 31.4, 48.6, {
      badge: 'outperform',
      insight: '젊은 층 유입과 맞물려 게임 관심 비중이 일반 대비 높습니다.',
      gender: { female: 42, male: 58 },
      age: [12, 28, 26, 22, 12],
      benchmarkAge: [8, 34, 32, 18, 8],
    }),
    seg('appliance', '가전', 14.2, 18.4, {
      badge: 'outperform',
      insight: '30~40대 중심으로 가전 관심이 소폭 높게 나타납니다.',
      gender: { female: 52, male: 48 },
      age: [6, 16, 22, 32, 24],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('health', '건강식품', 15.8, 18.9, {
      badge: 'outperform',
      insight: '50대 이상 방문객 비중에 따라 건강식품 관심이 다소 높습니다.',
      gender: { female: 58, male: 42 },
      age: [6, 14, 20, 30, 30],
      benchmarkAge: [6, 24, 28, 22, 20],
    }),
    seg('parenting', '출산/육아', 17.6, 31.4, {
      badge: 'focus',
      insight: '가족 단위 방문이 많아 출산·육아 관심이 일반 대비 크게 높습니다.',
      gender: { female: 72, male: 28 },
      age: [8, 20, 26, 30, 16],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('furniture', '가구/인테리어', 12.1, 19.2, {
      badge: 'outperform',
      insight: '인근 거주·귀가 동선과 연계된 인테리어 관심이 높습니다.',
      gender: { female: 64, male: 36 },
      age: [6, 16, 22, 32, 24],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('content', '컨텐츠', 42.3, 71.8, {
      badge: 'outperform',
      insight: '야간 문화·미디어아트 콘텐츠와 맞물려 관심 점유율이 매우 높습니다.',
      gender: { female: 54, male: 46 },
      age: [10, 24, 26, 26, 14],
      benchmarkAge: [8, 32, 34, 18, 8],
    }),
    seg('finance', '금융', 19.8, 32.4, {
      badge: 'outperform',
      insight: '30~40대 직장인 유입으로 금융 관심 비중이 상대적으로 높습니다.',
      gender: { female: 44, male: 56 },
      age: [6, 16, 24, 32, 22],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('art', 'ART/전시', 14.6, 38.2, {
      badge: 'highlight',
      insight: '축제 예술·전시 콘텐츠와 직결되어 ART/전시 관심이 가장 크게 높습니다.',
      gender: { female: 58, male: 42 },
      age: [9, 20, 22, 30, 19],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
    seg('liquor', '주류', 17.9, 28.5, {
      badge: 'outperform',
      insight: '야간 축제·먹거리존 연계로 주류 관심이 일반 대비 높습니다.',
      gender: { female: 38, male: 62 },
      age: [8, 22, 24, 30, 16],
      benchmarkAge: [7, 28, 32, 20, 13],
    }),
  ] satisfies SegmentProfile[],
};

/** 방문객 점유율 순 관심사 순위 */
export const topSegmentsByRank = [...segmentAnalysis.segments].sort(
  (a, b) => b.targetPct - a.targetPct,
);

/** @deprecated targetPct 순위 사용 */
export const topSegmentsByLift = topSegmentsByRank;

export function getSegmentById(id: string) {
  return segmentAnalysis.segments.find((s) => s.id === id);
}
