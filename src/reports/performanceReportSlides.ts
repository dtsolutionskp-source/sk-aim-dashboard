import {
  aiInsights,
  festivalInfo,
  interestsAnalysis,
  marketingKpis,
  movementAnalysis,
  promoMaterials,
  stayTimeAnalysis,
  targetSegments,
  topInflowRegions,
  TOTAL_VISITORS,
  visitorDemographics,
  type PromoMaterial,
} from '../data/mockData';
import {
  aiFinalInsights,
  awarenessChannels,
  economicEffect,
  nps,
  respondentProfile,
  revisitIntent,
  satisfaction,
  surveyOverview,
  surveySectionSummaries,
  visitPurpose,
} from '../data/surveyReportData';
import type { CrossChartSpec, ReportChartSpec } from './reportCharts';
import {
  buildMarketingSummaryDataTable,
  computeMarketingAggregates,
  getMaterialDataTable,
  type ReportDataTable,
} from '../data/marketingReportTables';

export interface ReportTableRow {
  label: string;
  value: string;
}

export type { ReportDataTable };

export interface ReportSlideImage {
  src: string;
  caption: string;
  variant?: 'notification' | 'wide' | 'flyer';
}

export interface PerformanceReportSlide {
  id: string;
  sectionLabel?: string;
  title: string;
  summary?: string[];
  insights?: string[];
  recommendations?: string[];
  table?: ReportTableRow[];
  tables?: { heading?: string; rows: ReportTableRow[] }[];
  dataTable?: ReportDataTable;
  charts?: ReportChartSpec[];
  crossCharts?: CrossChartSpec[];
  images?: ReportSlideImage[];
  layout: 'cover' | 'divider' | 'section' | 'detail' | 'marketing' | 'marketing-summary';
}

export const DATA_SOURCE_NOTE =
  '방문객·유입·체류: SK텔레콤 위치데이터 · 관심사 데이터 | 만족도·소비: 해오름 야간문화축제 현장 설문(487명)';

function resolveAssetUrl(path: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return path;
}

function formatKpi(value: number, unit: string, decimals?: number): string {
  return `${decimals !== undefined ? value.toFixed(decimals) : value.toLocaleString()}${unit}`;
}

function sectionSlide(
  id: string,
  sectionLabel: string,
  title: string,
  summary: string[],
  table?: ReportTableRow[],
): PerformanceReportSlide {
  return { id, sectionLabel, layout: 'section', title, summary, table };
}

function dividerSlide(
  id: string,
  numeral: string,
  title: string,
  subtitle: string,
): PerformanceReportSlide {
  return { id, sectionLabel: numeral, layout: 'divider', title, summary: [subtitle] };
}

function detailSlide(
  id: string,
  sectionLabel: string,
  title: string,
  opts: {
    insights: string[];
    recommendations?: string[];
    charts?: ReportChartSpec[];
    crossCharts?: CrossChartSpec[];
    table?: ReportTableRow[];
    tables?: { heading?: string; rows: ReportTableRow[] }[];
  },
): PerformanceReportSlide {
  return {
    id,
    sectionLabel,
    layout: 'detail',
    title,
    insights: opts.insights,
    recommendations: opts.recommendations,
    charts: opts.charts,
    crossCharts: opts.crossCharts,
    table: opts.table,
    tables: opts.tables,
  };
}

function previewVariant(type: string): ReportSlideImage['variant'] {
  if (type === 'notification') return 'notification';
  if (type === 'flyer') return 'flyer';
  return 'wide';
}

function allMarketingImages(): ReportSlideImage[] {
  return promoMaterials.flatMap((m) =>
    m.previews.map((p) => ({
      src: resolveAssetUrl(p.image),
      caption: `${m.title} · ${p.label}`,
      variant: previewVariant(p.type),
    })),
  );
}

function materialImages(material: PromoMaterial): ReportSlideImage[] {
  return material.previews.map((p) => ({
    src: resolveAssetUrl(p.image),
    caption: p.label,
    variant: previewVariant(p.type),
  }));
}

function pushMaterialTable(material: PromoMaterial): ReportTableRow[] {
  if (material.id === 'main-banner') return [];
  return targetSegments.map((s) => ({ label: `타겟 · ${s.label}`, value: '적용' }));
}

function aggregateAgeForChart() {
  const buckets = [
    { label: '10대', keys: ['10대 이하', '10대 초반', '10대 후반'] },
    { label: '20대', keys: ['20대'] },
    { label: '30대', keys: ['30대'] },
    { label: '40대', keys: ['40대'] },
    { label: '50대+', keys: ['50대', '60대 이상'] },
  ];
  return buckets.map((b) => ({
    label: b.label,
    value: respondentProfile.age
      .filter((a) => b.keys.includes(a.label))
      .reduce((s, a) => s + a.value, 0),
  }));
}

export function buildPerformanceReportSlides(): PerformanceReportSlide[] {
  const slides: PerformanceReportSlide[] = [];

  slides.push({
    id: 'cover',
    layout: 'cover',
    title: `${festivalInfo.name}\n성과 분석 보고서`,
    summary: [
      festivalInfo.organizer,
      `${festivalInfo.period} · ${festivalInfo.location}`,
      '마케팅 · 데이터 분석 · 만족도 조사 통합 결과',
      DATA_SOURCE_NOTE,
    ],
  });

  slides.push(
    sectionSlide('executive', '종합', '행사 성과 종합 요약', [
      `해오름시 ${festivalInfo.name} 총 방문객 ${TOTAL_VISITORS.toLocaleString()}명 집계`,
      `홍보 클릭율 ${marketingKpis.clickRate}%, 만족도 ${satisfaction.overall}/5.0, 재방문 의향 ${revisitIntent.totalPositive}%`,
      '드론 라이트쇼·야간 경관 호평, 주차·교통·안내 개선이 핵심 과제',
      '외지인·가족 동반 방문 비중 높아 가족형·야간 체류 콘텐츠 확대 필요',
    ], [
      { label: '방문객', value: `${TOTAL_VISITORS.toLocaleString()}명` },
      { label: '홍보 클릭율', value: `${marketingKpis.clickRate}%` },
      { label: '설문 응답', value: '487명' },
      { label: 'NPS', value: `${nps.score}점` },
      { label: '추정 경제효과', value: economicEffect.estimatedEffect },
    ]),
  );

  // ── Ⅰ. 마케팅 ──
  const mkt = computeMarketingAggregates();

  slides.push(
    dividerSlide(
      'div-mkt',
      'Ⅰ',
      '마케팅 성과 분석',
      '홍보 푸쉬·설문 푸쉬·메인 배너 채널 통합 성과',
    ),
  );

  slides.push({
    id: 'mkt-summary',
    sectionLabel: 'Ⅰ. 마케팅',
    layout: 'marketing-summary',
    title: '마케팅 성과 요약',
    summary: [
      `타겟 Push 도달 ${mkt.pushReach.toLocaleString()}명, 클릭 ${mkt.pushClicks.toLocaleString()}건(클릭율 ${mkt.clickRate.toFixed(2)}%)`,
      `앱 노출 ${mkt.impressions.toLocaleString()}건, PV클릭 ${mkt.bannerClicks.toLocaleString()}건`,
      `전체 클릭 ${mkt.totalClicks.toLocaleString()}건 — 푸쉬·배너 채널 통합 성과`,
    ],
    dataTable: buildMarketingSummaryDataTable(mkt),
    images: allMarketingImages(),
  });

  promoMaterials.forEach((material) => {
    const clickKpi = material.kpis.find((k) => k.label.includes('클릭율'));
    const targetRows = pushMaterialTable(material);
    slides.push({
      id: `mkt-${material.id}`,
      sectionLabel: 'Ⅰ. 마케팅',
      layout: 'marketing',
      title: material.reportHeading,
      summary: [
        material.description,
        `${material.schedule.label} ${material.schedule.period}`,
        clickKpi
          ? `클릭율 ${formatKpi(clickKpi.value, clickKpi.unit, clickKpi.decimals)} · ${clickKpi.changeLabel ?? '전년 대비'} ${clickKpi.change ?? ''}${clickKpi.change ? '%p' : ''}`
          : '채널별 노출·클릭 성과',
        ...targetRows.map((t) => `${t.label} ${t.value}`),
      ],
      dataTable: getMaterialDataTable(material),
      images: materialImages(material),
    });
  });

  // ── Ⅱ. 데이터 분석 ──
  slides.push(
    dividerSlide(
      'div-data',
      'Ⅱ',
      '데이터 분석',
      'SK텔레콤 위치데이터 기반 방문객·유입·관심사·체류·이동 분석',
    ),
  );

  slides.push(
    sectionSlide('data-summary', 'Ⅱ. 데이터 분석', '데이터 분석 요약', [
      'SK텔레콤 위치데이터 기반 방문객 특성·유입·관심사·체류·이동 종합 분석',
      `총 ${TOTAL_VISITORS.toLocaleString()}명, 여성 55%·광역권 거주 54%, 1~3시간 체류 42%`,
      '식음료·컨텐츠·ART/전시 관심 높음, 방문 후 먹거리 상권 연계 이동 38%',
    ], [
      { label: '방문객', value: `${TOTAL_VISITORS.toLocaleString()}명` },
      { label: '1위 유입', value: `${topInflowRegions[0].city} ${topInflowRegions[0].pct}%` },
      { label: '평균 체류', value: '1~3시간 42%' },
      { label: '관심 1위', value: `식음료 ${visitorDemographics.interests[0].value}%` },
    ]),
  );

  slides.push(
    sectionSlide('data-profile-sum', 'Ⅱ. 데이터 분석', '방문객 프로파일 요약', [
      '여성 55%·남성 45%, 가족·연인 동반 방문 비중 높음',
      '광역권 거주 54%, 야간·주말 방문 집중',
      '20~30대 초반 연령층 비중 상대적으로 높음',
    ], [
      { label: '여성', value: '55%' },
      { label: '남성', value: '45%' },
      { label: '광역권', value: '54%' },
      { label: '인근권', value: '26%' },
    ]),
  );

  slides.push(
    detailSlide('data-profile-detail', 'Ⅱ. 데이터 분석', '방문객 프로파일 세부 분석', {
      insights: [
        '여성·30대 초반 비중이 높아 가족·커플 타깃 야간 프로그램 적합',
        '광역권 거주 비중 54%로 외지 유입 홍보·교통 안내 강화 필요',
      ],
      recommendations: [
        '2050 여성·가족 세그먼트 맞춤 푸쉬·SNS 채널 분리 운영',
        '주말·야간 시간대 혼잡 구간 안내 및 셔틀 연계 검토',
      ],
      charts: [
        {
          id: 'gender',
          title: '성별 분포',
          type: 'donut',
          items: visitorDemographics.gender.map((g, i) => ({
            label: g.label,
            value: g.value,
            color: i === 0 ? '#f47725' : '#adb5bd',
          })),
        },
        {
          id: 'residence',
          title: '거주지 분포',
          type: 'donut',
          items: visitorDemographics.residence.map((r) => ({ label: r.label, value: r.value })),
        },
        {
          id: 'age-visitor',
          title: '연령 분포 (방문객)',
          type: 'line',
          items: visitorDemographics.age
            .slice()
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)
            .map((a) => ({ label: a.label.replace(' ', ''), value: a.value })),
        },
      ],
    }),
  );

  slides.push(
    sectionSlide('data-inflow-sum', 'Ⅱ. 데이터 분석', '유입지역 분석 요약', [
      `1위 ${topInflowRegions[0].city} ${topInflowRegions[0].pct}%, 2~3위 ${topInflowRegions[1].city}·${topInflowRegions[2].city}`,
      '광역권·인근 도시 유입 중심, 해오름시 거주 방문객 6.4% 포함',
      interestsAnalysis.summary[0],
    ]),
  );

  slides.push(
    detailSlide('data-inflow-detail', 'Ⅱ. 데이터 분석', '유입지역 TOP 10 세부 분석', {
      insights: [
        '가온·서림·동원 등 광역권 도시 순 유입, 당일·1박 방문 패턴 혼재',
        '유입 상위 3개 도시가 전체의 약 31% 차지',
      ],
      recommendations: [
        '상위 유입 도시별 맞춤 홍보(교통·주차 안내) 콘텐츠 제작',
        'KTX·버스터미널 연계 셔틀 시간표 사전 안내',
      ],
      charts: [
        {
          id: 'inflow-top10',
          title: '유입지역 TOP 10 (%)',
          type: 'vertical',
          items: topInflowRegions.map((r) => ({ label: r.city, value: r.pct })),
        },
      ],
      table: topInflowRegions.slice(0, 5).map((r) => ({
        label: `${r.rank}위 ${r.city}`,
        value: `${r.count.toLocaleString()}명`,
      })),
    }),
  );

  slides.push(
    sectionSlide('data-interest-sum', 'Ⅱ. 데이터 분석', '관심사·체류·이동 요약', [
      interestsAnalysis.summary[1],
      '체류 1~3시간 42%, 5시간 이상 15%',
      '방문 후 먹거리 상권 38%·카페거리 22% 이동',
    ]),
  );

  slides.push(
    detailSlide('data-interest-detail', 'Ⅱ. 데이터 분석', '관심사·체류·이동 세부 분석', {
      insights: [
        '식음료·컨텐츠 관심 높음 → 축제 먹거리·미디어아트 연계 효과',
        '방문 후 상권 이동 활발 → 지역경제 파급 기대, 동선 안내 필요',
      ],
      recommendations: [
        '먹거리존·야시장과 인근 상권 연계 쿠폰·안내',
        '체류 연장형 야간 체험 프로그랸 추가 검토',
      ],
      charts: [
        {
          id: 'interests',
          title: '관심사 점유율',
          items: visitorDemographics.interests.slice(0, 6).map((i) => ({
            label: i.label,
            value: i.value,
          })),
        },
        {
          id: 'stay',
          title: '체류시간',
          type: 'donut',
          items: stayTimeAnalysis.map((s) => ({ label: s.label, value: s.value })),
        },
        {
          id: 'after-move',
          title: '방문 후 이동지',
          type: 'donut',
          items: movementAnalysis.after.items.map((p) => ({ label: p.label, value: p.overall })),
        },
      ],
      crossCharts: [
        {
          id: 'after-by-age',
          title: '연령별 방문 후 이동지 (교차분석)',
          categories: movementAnalysis.after.items.map((p) => p.label),
          series: movementAnalysis.after.series.slice(0, 4),
        },
      ],
    }),
  );

  // ── Ⅲ. 만족도 조사 ──
  slides.push(
    dividerSlide(
      'div-svy',
      'Ⅲ',
      '만족도 조사',
      '현장 설문 487명 · 만족도·소비·재방문 의향 분석',
    ),
  );

  slides.push(
    sectionSlide('svy-summary', 'Ⅲ. 만족도 조사', '만족도 조사 종합 요약', [
      ...surveySectionSummaries.overview,
      `${surveyOverview.period} · ${surveyOverview.target}`,
    ], surveyOverview.kpis.map((k) => ({
      label: k.label,
      value: `${k.value}${k.unit}`,
    }))),
  );

  slides.push(
    sectionSlide('svy-profile-sum', 'Ⅲ. 만족도 조사', '응답자 프로파일 요약', [
      ...surveySectionSummaries.profile,
    ], [
      { label: '여성 / 남성', value: '52% / 48%' },
      { label: '외지인', value: '68%' },
      { label: '가족 동반', value: '43%' },
      { label: '해오름시 거주', value: '32%' },
    ]),
  );

  slides.push(
    detailSlide('svy-profile-detail', 'Ⅲ. 만족도 조사', '응답자 프로파일 세부 분석', {
      insights: [
        '외지인 68%·가족 동반 43%로 외지·가족 단위 방문이 주류',
        '30대·40대 비중 높아 가족형·야간 체류 프로그램 적합',
      ],
      recommendations: [
        '외지인 대상 교통·주차·숙박 패키지 안내 강화',
        '가족 동반족 대기시간·휴게 공간 확대',
      ],
      charts: [
        {
          id: 'svy-gender',
          title: '성별',
          type: 'donut',
          items: respondentProfile.gender.map((g, i) => ({
            label: g.label,
            value: g.value,
            color: g.color ?? (i === 1 ? '#f47725' : '#adb5bd'),
          })),
        },
        {
          id: 'svy-companion',
          title: '동반 유형',
          type: 'donut',
          items: respondentProfile.companion.map((c) => ({
            label: c.label,
            value: c.value,
            color: c.color,
          })),
        },
        {
          id: 'svy-age',
          title: '연령',
          type: 'line',
          items: aggregateAgeForChart(),
        },
      ],
      crossCharts: [
        {
          id: 'companion-by-age',
          title: '연령별 동반 유형 (교차분석)',
          categories: respondentProfile.unified.companion.items.map((c) => c.label),
          series: respondentProfile.unified.companion.series,
        },
      ],
    }),
  );

  slides.push(
    sectionSlide('svy-sat-sum', 'Ⅲ. 만족도 조사', '행사 만족도 요약', [
      ...surveySectionSummaries.satisfaction,
    ], satisfaction.byProgram.slice(0, 4).map((p) => ({
      label: p.label,
      value: `${p.score.toFixed(1)}점`,
    }))),
  );

  slides.push(
    detailSlide('svy-sat-detail', 'Ⅲ. 만족도 조사', '프로그램별 만족도 세부 분석', {
      insights: [
        '드론 라이트쇼 4.8점으로 최고 호평, 야간 경관·볼거리 만족 높음',
        '교통 3.4점·안내 3.8점 낮아 인프라 개선 시급',
      ],
      recommendations: [
        '드론쇼·미디어아트 시간대 분산 및 예약제 검토',
        '교통·주차·화장실·안내 표지판 우선 보강',
      ],
      charts: [
        {
          id: 'program-sat',
          title: '프로그램별 만족도 (5점 만점)',
          items: satisfaction.byProgram.map((p) => ({
            label: p.label,
            value: p.score,
            unit: `${p.score.toFixed(1)}점`,
          })),
          maxValue: 5,
          unit: '점',
        },
      ],
      crossCharts: [
        {
          id: 'sat-by-age',
          title: '연령별 프로그램 만족도 (교차분석)',
          categories: satisfaction.unified.items.map((p) => p.label.replace(' ', '')),
          series: satisfaction.unified.series,
        },
      ],
    }),
  );

  slides.push(
    sectionSlide('svy-awareness-sum', 'Ⅲ. 만족도 조사', '인지 경로·방문 목적 요약', [
      ...surveySectionSummaries.awareness.slice(0, 1),
      ...surveySectionSummaries.purpose.slice(0, 1),
    ]),
  );

  slides.push(
    detailSlide('svy-awareness-detail', 'Ⅲ. 만족도 조사', '인지 경로·방문 목적 세부 분석', {
      insights: awarenessChannels.aiInsights.slice(0, 2),
      recommendations: [
        '20~30대 SNS·유튜브, 50대+ 푸쉬 채널 분리 집행',
        '드론쇼·가족 나들이 키워드 중심 메시지 A/B 테스트',
      ],
      charts: [
        {
          id: 'awareness',
          title: '인지 경로',
          type: 'donut',
          items: awarenessChannels.overall.map((c) => ({ label: c.label, value: c.value })),
        },
        {
          id: 'purpose',
          title: '방문 목적',
          type: 'donut',
          items: visitPurpose.overall.map((p) => ({ label: p.label, value: p.value })),
        },
      ],
      crossCharts: [
        {
          id: 'awareness-by-age',
          title: '연령별 인지 경로 (교차분석)',
          categories: awarenessChannels.unified.items.map((c) => c.label),
          series: awarenessChannels.unified.series,
        },
      ],
    }),
  );

  slides.push(
    sectionSlide('svy-economic-sum', 'Ⅲ. 만족도 조사', '지역 경제 효과 요약', [
      ...surveySectionSummaries.economic,
    ], [
      { label: '추가 소비', value: '78%' },
      { label: '1인 평균 지출', value: economicEffect.avgSpending },
      { label: '추정 효과', value: economicEffect.estimatedEffect },
    ]),
  );

  slides.push(
    detailSlide('svy-economic-detail', 'Ⅲ. 만족도 조사', '소비행태·경제효과 세부 분석', {
      insights: economicEffect.aiInsights.slice(0, 3),
      recommendations: [
        '음식점·카페 연계 할인 및 야간 상권 이벤트 확대',
        '외지인 대상 1박 2일 패키지 상품 개발',
      ],
      charts: [
        {
          id: 'spending-places',
          title: '추가 소비 장소',
          type: 'donut',
          items: economicEffect.spendingPlaces.map((p) => ({ label: p.label, value: p.value })),
        },
        {
          id: 'spending-amount',
          title: '1인 지출액 분포',
          type: 'vertical',
          items: economicEffect.spendingAmount.map((p) => ({ label: p.label, value: p.value })),
        },
      ],
    }),
  );

  slides.push(
    sectionSlide('svy-revisit-sum', 'Ⅲ. 만족도 조사', '재방문·NPS 요약', [
      ...surveySectionSummaries.revisit,
    ], [
      { label: '재방문(긍정)', value: `${revisitIntent.totalPositive}%` },
      { label: 'NPS', value: `${nps.score}점` },
    ]),
  );

  slides.push(
    detailSlide('svy-revisit-detail', 'Ⅲ. 만족도 조사', '재방문·NPS·종합 제언', {
      insights: [
        ...aiFinalInsights.keyResults.slice(0, 3),
        aiInsights[2]?.content ?? '주차·교통 개선이 재방문 의향 제고 핵심',
      ],
      recommendations: [
        ...aiFinalInsights.policyRecommendations.operations.slice(0, 2),
        ...aiFinalInsights.policyRecommendations.content.slice(0, 1),
      ],
      charts: [
        {
          id: 'revisit',
          title: '재방문 의향',
          type: 'donut',
          items: revisitIntent.levels.map((l) => ({ label: l.label, value: l.value })),
        },
        {
          id: 'nps',
          title: '추천 의향(NPS)',
          type: 'donut',
          items: [
            { label: '추천', value: nps.promote, color: '#f47725' },
            { label: '중립', value: nps.passive, color: '#ffc078' },
            { label: '비추천', value: nps.detractor, color: '#adb5bd' },
          ],
        },
      ],
    }),
  );

  return slides;
}
