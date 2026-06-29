import {
  aiInsights,
  festivalInfo,
  interestsAnalysis,
  topInflowRegions,
  TOTAL_VISITORS,
  visitorDemographics,
} from '../data/mockData';
import {
  aiFinalInsights,
  economicEffect,
  freeResponse,
  nps,
  revisitIntent,
  satisfaction,
} from '../data/surveyReportData';
import type { CrossChartSpec, ReportChartSpec } from './reportCharts';
import { computeMarketingAggregates } from '../data/marketingReportTables';
import { buildDetailMarketingSlides } from './detailMarketingSlides';
import { buildDetailPerformanceSlides } from './detailPerformanceSlides';
import type { ReportTableSpec } from './reportTableTypes';

export interface ReportKpiCard {
  label: string;
  value: string;
  highlight?: boolean;
}

export type PerformanceReportLayout = 'cover' | 'divider' | 'report' | 'detail' | 'closing';

export interface PerformanceReportSlide {
  id: string;
  sectionLabel?: string;
  /** 페이지 핵심 메시지 (헤드라인) */
  headline?: string;
  /** 표지·간지·페이지 주제 */
  title: string;
  summary?: string[];
  kpis?: ReportKpiCard[];
  charts?: ReportChartSpec[];
  crossCharts?: CrossChartSpec[];
  tables?: ReportTableSpec[];
  /** 상세 페이지 분석 해석 (2~3줄) */
  interpretation?: string[];
  aiInsights?: string[];
  layout: PerformanceReportLayout;
}

export const DATA_SOURCE_NOTE =
  '방문객·유입·체류: SK텔레콤 위치데이터 · 관심사 데이터 | 만족도·소비: 해오름 야간문화축제 현장 설문(487명)';

const CROSS_REGIONS = topInflowRegions.slice(0, 5);
const CROSS_INTEREST_LABELS = visitorDemographics.interests.slice(0, 4).map((i) => i.label);
const AGE_BUCKET_KEYS: { label: string; keys: string[] }[] = [
  { label: '10대', keys: ['10대 이하', '10대 초반', '10대 후반'] },
  { label: '20대', keys: ['20대 초반', '20대 후반'] },
  { label: '30대', keys: ['30대 초반', '30대 후반'] },
  { label: '40대', keys: ['40대 초반', '40대 후반'] },
  { label: '50대+', keys: ['50대 이상'] },
];
const CHART_ORANGE = '#f47725';
const CHART_RED = '#ea002c';
const CHART_TINTS = ['#f47725', '#ea002c', '#ff8c42', '#ffc078'];

function dividerSlide(id: string, numeral: string, title: string, subtitle: string): PerformanceReportSlide {
  return { id, sectionLabel: numeral, layout: 'divider', title, summary: [subtitle] };
}

function reportSlide(
  id: string,
  sectionLabel: string,
  title: string,
  headline: string,
  opts: {
    kpis?: ReportKpiCard[];
    charts?: ReportChartSpec[];
    crossCharts?: CrossChartSpec[];
    aiInsights: string[];
  },
): PerformanceReportSlide {
  return {
    id,
    sectionLabel,
    layout: 'report',
    title,
    headline,
    kpis: opts.kpis,
    charts: opts.charts?.slice(0, 2),
    crossCharts: opts.crossCharts?.slice(0, 1),
    aiInsights: opts.aiInsights,
  };
}

function sumAgeBucket(age: { label: string; value: number }[], keys: string[]): number {
  return age.filter((a) => keys.includes(a.label)).reduce((s, a) => s + a.value, 0);
}

function regionInterestValues(seed: number): number[] {
  const base = visitorDemographics.interests.slice(0, 4).map((i) => i.value);
  return base.map((v, i) => Math.max(8, Math.round(v * (0.88 + ((seed + i * 3) % 8) / 40))));
}

function buildRegionGenderCross(): CrossChartSpec {
  return {
    id: 'cross-region-gender',
    title: '유입 상위 5개 지역 × 성별',
    categories: CROSS_REGIONS.map((r) => r.city),
    series: [
      { label: '여성', color: CHART_ORANGE, values: CROSS_REGIONS.map((r) => r.gender.find((g) => g.label === '여성')!.value) },
      { label: '남성', color: CHART_TINTS[3], values: CROSS_REGIONS.map((r) => r.gender.find((g) => g.label === '남성')!.value) },
    ],
  };
}

function buildRegionAgeCross(): CrossChartSpec {
  return {
    id: 'cross-region-age',
    title: '유입 상위 5개 지역 × 연령대',
    categories: CROSS_REGIONS.map((r) => r.city),
    series: AGE_BUCKET_KEYS.map((b, i) => ({
      label: b.label,
      color: CHART_TINTS[i % CHART_TINTS.length],
      values: CROSS_REGIONS.map((r) => sumAgeBucket(r.age, b.keys)),
    })),
  };
}

function buildRegionInterestCross(): CrossChartSpec {
  return {
    id: 'cross-region-interest',
    title: '유입 상위 5개 지역 × 관심사',
    categories: CROSS_REGIONS.map((r) => r.city),
    series: CROSS_INTEREST_LABELS.map((label, i) => ({
      label,
      color: CHART_TINTS[i],
      values: CROSS_REGIONS.map((r) => regionInterestValues(r.rank)[i]),
    })),
  };
}

export function buildPerformanceReportSlides(): PerformanceReportSlide[] {
  const mkt = computeMarketingAggregates();
  const slides: PerformanceReportSlide[] = [];

  slides.push({
    id: 'cover',
    layout: 'cover',
    title: `${festivalInfo.name}\n성과 분석 보고서`,
    summary: [
      festivalInfo.organizer,
      `${festivalInfo.period} · ${festivalInfo.location}`,
      '관광공사·지자체 제출용 통합 성과 보고서',
      DATA_SOURCE_NOTE,
    ],
  });

  slides.push(
    reportSlide('exec', 'Executive Summary', '경영·정책 요약', '야간 콘텐츠 만족과 지역경제 파급이 동시에 확인되었습니다', {
      kpis: [
        { label: '방문객', value: `${TOTAL_VISITORS.toLocaleString()}명`, highlight: true },
        { label: '재방문 의향', value: `${revisitIntent.totalPositive}%`, highlight: true },
        { label: '평균 만족도', value: `${satisfaction.overall}점` },
        { label: 'NPS', value: `${nps.score}점` },
      ],
      aiInsights: [
        `총 방문객 ${TOTAL_VISITORS.toLocaleString()}명—외지·가족 동반 비중 높아 관광·체류형 야간축제 성장 잠재력 확인`,
        `만족도 ${satisfaction.overall}점·재방문 ${revisitIntent.totalPositive}%로 콘텐츠 경쟁력 우수, 교통·주차가 핵심 제약`,
        `방문객 78% 추가 소비—축제-상권 연계가 지역경제 파급의 핵심 레버`,
      ],
    }),
  );

  slides.push(dividerSlide('div-mkt', 'Ⅰ', '마케팅 성과', 'OK캐쉬백 디지털 홍보 채널 통합 성과'));

  slides.push(
    reportSlide('mkt-push', 'Ⅰ. 마케팅', '디지털 홍보 성과 요약', 'OK캐쉬백 타겟 Push 클릭율 12%대로 홍보 효과가 검증되었습니다', {
      kpis: [
        { label: '푸쉬 도달', value: `${mkt.pushReach.toLocaleString()}명`, highlight: true },
        { label: '푸쉬 클릭', value: `${mkt.pushClicks.toLocaleString()}건` },
        { label: '클릭율', value: `${mkt.clickRate.toFixed(1)}%`, highlight: true },
        { label: '통합 클릭', value: `${mkt.totalClicks.toLocaleString()}건` },
      ],
      charts: [
        {
          id: 'mkt-channels',
          title: '채널별 클릭 성과',
          type: 'horizontal',
          items: [
            { label: '타겟 Push', value: mkt.pushClicks, unit: `${mkt.pushClicks.toLocaleString()}건` },
            { label: '앱 배너', value: mkt.bannerClicks, unit: `${mkt.bannerClicks.toLocaleString()}건` },
          ],
          maxValue: mkt.totalClicks,
        },
      ],
      aiInsights: [
        'OK캐쉬백 단일 미디어 Push·배너 통합 집행—성과 추적 일원화',
        '2050 여성·가족 세그먼트와 축제 방문객 프로파일의 정합성이 높음',
        '설문 Push로 현장 응답 487명 확보—성과 측정 채널로 재활용 가치 높음',
      ],
    }),
  );

  slides.push(...buildDetailMarketingSlides());

  slides.push(dividerSlide('div-data', 'Ⅱ', '데이터 분석', 'SK텔레콤 위치데이터 기반 방문객 분석'));

  slides.push(
    reportSlide('data-profile', 'Ⅱ. 데이터', '방문객 프로파일', '30~40대 여성 방문객이 핵심 고객층입니다', {
      kpis: [
        { label: '여성 비중', value: '55%', highlight: true },
        { label: '광역권 거주', value: '54%' },
        { label: '가족·연인 동반', value: '높음' },
        { label: '20~40대', value: '주력' },
      ],
      charts: [
        {
          id: 'gender',
          title: '성별 분포',
          type: 'donut',
          items: visitorDemographics.gender.map((g, i) => ({
            label: g.label,
            value: g.value,
            color: i === 0 ? CHART_ORANGE : CHART_TINTS[3],
          })),
        },
      ],
      aiInsights: [
        '여성·30대 초반·가족 동반 중심—야간·가족형 프로그램과 높은 적합성',
        '광역권 거주 54%—외지 관광객 대상 교통·숙박 안내가 전환 핵심',
        '2050 여성·가족 세그먼트 맞춤 푸쉬·SNS 채널 분리 운영 권장',
      ],
    }),
  );

  slides.push(
    reportSlide(
      'data-inflow',
      'Ⅱ. 데이터',
      '유입지역',
      '광역권 가온·서림·동원 순으로 유입이 집중되었습니다',
      {
        kpis: [
          { label: '1위 유입', value: `${topInflowRegions[0].city} ${topInflowRegions[0].pct}%`, highlight: true },
          { label: 'TOP 3 비중', value: '약 31%' },
          { label: '해오름시 거주', value: '6.4%' },
          { label: '외지 유입', value: '93.6%' },
        ],
        charts: [
          {
            id: 'inflow-top5',
            title: '유입지역 TOP 5',
            type: 'vertical',
            items: topInflowRegions.slice(0, 5).map((r) => ({ label: r.city, value: r.pct })),
          },
        ],
        aiInsights: [
          '가온·서림·동원 등 광역권 도시 순 유입—당일·1박 방문 패턴 혼재',
          '상위 유입 도시별 맞춤 홍보(교통·주차·KTX 연계) 콘텐츠 제작 필요',
          interestsAnalysis.summary[0],
        ],
      },
    ),
  );

  slides.push(
    reportSlide('data-stay', 'Ⅱ. 데이터', '체류·이동', '방문 후 먹거리 상권 이동이 38%로 지역경제 연계가 활발합니다', {
      kpis: [
        { label: '1~3시간 체류', value: '42%', highlight: true },
        { label: '방문 후 상권', value: '38%', highlight: true },
        { label: '카페거리', value: '22%' },
        { label: '5시간 이상', value: '15%' },
      ],
      charts: [
        {
          id: 'after-move',
          title: '방문 후 이동지',
          type: 'donut',
          items: [
            { label: '먹거리 상권', value: 38, color: CHART_ORANGE },
            { label: '카페거리', value: 22, color: CHART_RED },
            { label: '전통시장', value: 18, color: CHART_TINTS[2] },
            { label: '기타', value: 22, color: CHART_TINTS[3] },
          ],
        },
      ],
      aiInsights: [
        '식음료·컨텐츠 관심 높음—먹거리·미디어아트 연계가 체류·소비 확대에 유리',
        '축제-먹거리존-인근 상권 동선 설계가 지역경제 파급의 관건',
        '체류 연장형 야간 체험 프로그램 추가 검토 권장',
      ],
    }),
  );

  slides.push(
    reportSlide('cross-gender', 'Ⅱ. 교차분석', '지역별 × 성별', '유입 상위 지역 모두 여성 비중이 51~59%로 나타났습니다', {
      kpis: [
        { label: '전체 여성', value: '55%' },
        { label: '최고 여성 비중', value: '무궁 59%' },
        { label: '분석 지역', value: 'TOP 5' },
      ],
      crossCharts: [buildRegionGenderCross()],
      aiInsights: [
        '동원·무궁 등 여성 58~59%—가족·2050 여성 타깃 홍보 우선 검토 대상',
        '북해(남성 48%)는 연인·친구 동반 프로그램·SNS 채널 활용 여지',
        '유입 도시별 성별 구성에 맞춘 메시지 이원화(가족 vs 연인) 권장',
      ],
    }),
  );

  slides.push(
    reportSlide('cross-age', 'Ⅱ. 교차분석', '지역별 × 연령', '가온·서림 등 광역권 도시는 30~40대 비중이 높습니다', {
      kpis: [
        { label: '핵심 연령', value: '30~40대' },
        { label: '가족 유입 도시', value: '가온·동원' },
        { label: '20대 비중↑', value: '온양·청계' },
      ],
      crossCharts: [buildRegionAgeCross()],
      aiInsights: [
        '30~40대 비중 높은 도시—가족 패키지·드론쇼 예약제·체류형 프로그램 홍보',
        '해오름시·인근 도시 50대+ 비중 다소 높음—거주민 접근성·주차 안내 강화',
        '20대 비중 높은 권역—SNS·유튜브 중심 홍보와 연계 가능',
      ],
    }),
  );

  slides.push(
    reportSlide('cross-interest', 'Ⅱ. 교차분석', '지역별 × 관심사', '전 지역 식음료·컨텐츠 관심이 상위로 나타났습니다', {
      kpis: [
        { label: '관심 1위', value: '식음료' },
        { label: '관심 2위', value: '컨텐츠' },
        { label: '가족 특화', value: '출산/육아' },
      ],
      crossCharts: [buildRegionInterestCross()],
      aiInsights: [
        interestsAnalysis.summary[1],
        '축제 먹거리·미디어아트 연계 전략의 타당성 확인',
        '출산/육아 관심 높은 유입지—키즈 체험·가족 휴게 공간 확대 우선',
      ],
    }),
  );

  slides.push(dividerSlide('div-svy', 'Ⅲ', '만족도 조사', '현장 설문 487명 분석'));

  slides.push(
    reportSlide('svy-sat', 'Ⅲ. 만족도', '행사 만족도', '드론쇼가 방문 만족도를 견인했습니다', {
      kpis: [
        { label: '전체 만족도', value: `${satisfaction.overall}점`, highlight: true },
        { label: '드론 라이트쇼', value: '4.8점', highlight: true },
        { label: '교통', value: '3.4점' },
        { label: '안내 서비스', value: '3.8점' },
      ],
      charts: [
        {
          id: 'program-sat',
          title: '프로그램별 만족도',
          type: 'horizontal',
          items: satisfaction.byProgram.slice(0, 5).map((p) => ({
            label: p.label.replace(' ', ''),
            value: p.score,
            unit: `${p.score.toFixed(1)}점`,
          })),
          maxValue: 5,
          unit: '점',
        },
      ],
      aiInsights: [
        '드론 라이트쇼 4.8점 최고 호평—야간 경관·볼거리가 축제 경쟁력의 핵심 자산',
        '교통 3.4점·안내 3.8점 최저—주차·화장실·표지판 개선이 재방문 제약 요인',
        '드론쇼 시간대 분산·예약제로 혼잡 완화 및 만족도 유지 권장',
      ],
    }),
  );

  slides.push(
    reportSlide('svy-voice', 'Ⅲ. 만족도', '주요 의견', '방문객은 드론쇼·야경을, 개선은 주차·교통을 요구했습니다', {
      kpis: [
        { label: '긍정 키워드 1위', value: '드론쇼', highlight: true },
        { label: '개선 키워드 1위', value: '주차', highlight: true },
        { label: '설문 응답', value: '487명' },
      ],
      charts: [
        {
          id: 'voice-positive',
          title: '긍정 키워드',
          type: 'horizontal',
          items: freeResponse.positive.slice(0, 4).map((w) => ({
            label: w.word,
            value: w.weight * 10,
            unit: `${w.weight}회`,
          })),
          maxValue: 50,
        },
        {
          id: 'voice-negative',
          title: '개선 키워드',
          type: 'horizontal',
          items: freeResponse.negative.slice(0, 4).map((w) => ({
            label: w.word,
            value: w.weight * 10,
            unit: `${w.weight}회`,
            color: CHART_RED,
          })),
          maxValue: 50,
        },
      ],
      aiInsights: [
        freeResponse.aiSummary,
        nps.reason.summary,
        '주차·교통·혼잡 개선이 NPS·재방문 의향 제고의 단기 실행 과제',
      ],
    }),
  );

  slides.push(
    reportSlide('svy-economic', 'Ⅲ. 만족도', '지역 경제효과', '방문객 78%가 행사장 외 추가 소비를 경험했습니다', {
      kpis: [
        { label: '추가 소비', value: '78%', highlight: true },
        { label: '1인 평균 지출', value: economicEffect.avgSpending, highlight: true },
        { label: '추정 효과', value: economicEffect.estimatedEffect },
        { label: '음식점 소비', value: '42%' },
      ],
      aiInsights: [
        ...economicEffect.aiInsights.slice(0, 2),
        '외지인 대상 1박 2일 패키지·야간 상권 이벤트로 추가 소비·체류 확대',
      ],
    }),
  );

  slides.push(
    reportSlide('svy-revisit', 'Ⅲ. 만족도', '재방문·NPS', '재방문 의향 91%로 축제 충성도가 높게 나타났습니다', {
      kpis: [
        { label: '재방문 의향', value: `${revisitIntent.totalPositive}%`, highlight: true },
        { label: 'NPS', value: `${nps.score}점`, highlight: true },
        { label: '추천', value: `${nps.promote}%` },
        { label: '비추천', value: `${nps.detractor}%` },
      ],
      charts: [
        {
          id: 'revisit',
          title: '재방문 의향',
          type: 'donut',
          items: revisitIntent.levels.map((l, i) => ({
            label: l.label,
            value: l.value,
            color: CHART_TINTS[i % CHART_TINTS.length],
          })),
        },
      ],
      aiInsights: [
        `재방문 긍정 ${revisitIntent.totalPositive}%, NPS ${nps.score}점—콘텐츠 만족이 추천 의향으로 연결`,
        aiInsights[2]?.content ?? '주차·교통 개선 시 재방문·추천 의향 추가 상승 기대',
        '주차장 확대·셔틀·혼잡 시간대 분산으로 NPS 제약 요인 해소',
      ],
    }),
  );

  slides.push(...buildDetailPerformanceSlides());

  slides.push({
    id: 'closing',
    layout: 'closing',
    sectionLabel: '종합',
    title: 'AI 종합 인사이트 및 정책 제언',
    headline: '콘텐츠 강화와 인프라 개선을 병행 추진할 시기입니다',
    aiInsights: aiFinalInsights.publicInsights as unknown as string[],
    summary: [
      ...aiFinalInsights.policyRecommendations.content.slice(0, 2),
      ...aiFinalInsights.policyRecommendations.marketing.slice(0, 2),
      ...aiFinalInsights.policyRecommendations.operations.slice(0, 2),
    ],
  });

  return slides;
}
