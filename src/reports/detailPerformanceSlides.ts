import type { CrossChartSpec, ReportChartSpec } from './reportCharts';
import type { PerformanceReportSlide, ReportKpiCard } from './performanceReportSlides';
import type { ReportTableSpec } from './reportTableTypes';
import {
  freeResponseTable,
  genderAgeCrossTable,
  improvementAgeTable,
  inflowTop10Table,
  interestAgeTable,
  interestGenderTable,
  interestTop10Table,
  regionAgeMatrixTable,
  regionGenderTable,
  regionInterestMatrixTable,
  respondentProfileTable,
  revisitAgeTable,
  satisfactionAgeTable,
  satisfactionItemsTable,
  satisfactionPurposeTable,
} from './data/reportDetailTables';
import { visitorDemographics, topInflowRegions, interestsAnalysis } from '../data/mockData';
import { freeResponse, nps, respondentProfile, revisitIntent, satisfaction, visitPurpose } from '../data/surveyReportData';

const CHART_ORANGE = '#f47725';
const CHART_TINTS = ['#f47725', '#ea002c', '#ff8c42', '#ffc078'];
const CROSS_REGIONS = topInflowRegions.slice(0, 5);

const AGE_BUCKET_KEYS = [
  { label: '10대', keys: ['10대 이하', '10대 초반', '10대 후반'] },
  { label: '20대', keys: ['20대 초반', '20대 후반'] },
  { label: '30대', keys: ['30대 초반', '30대 후반'] },
  { label: '40대', keys: ['40대 초반', '40대 후반'] },
  { label: '50대+', keys: ['50대 이상'] },
];

function sumAgeBucket(age: { label: string; value: number }[], keys: string[]): number {
  return age.filter((a) => keys.includes(a.label)).reduce((s, a) => s + a.value, 0);
}

function detailSlide(
  id: string,
  sectionLabel: string,
  title: string,
  headline: string,
  opts: {
    kpis?: ReportKpiCard[];
    charts?: ReportChartSpec[];
    crossCharts?: CrossChartSpec[];
    tables?: ReportTableSpec[];
    interpretation?: string[];
    aiInsights: string[];
  },
): PerformanceReportSlide {
  return {
    id,
    sectionLabel,
    layout: 'detail',
    title,
    headline,
    kpis: opts.kpis,
    charts: opts.charts?.slice(0, 2),
    crossCharts: opts.crossCharts?.slice(0, 1),
    tables: opts.tables,
    interpretation: opts.interpretation,
    aiInsights: opts.aiInsights,
  };
}

function regionGenderCross(): CrossChartSpec {
  return {
    id: 'det-cross-gender',
    title: '유입 TOP5 × 성별',
    categories: CROSS_REGIONS.map((r) => r.city),
    series: [
      { label: '여성', color: CHART_ORANGE, values: CROSS_REGIONS.map((r) => r.gender.find((g) => g.label === '여성')!.value) },
      { label: '남성', color: CHART_TINTS[3], values: CROSS_REGIONS.map((r) => r.gender.find((g) => g.label === '남성')!.value) },
    ],
  };
}

function regionAgeCross(): CrossChartSpec {
  return {
    id: 'det-cross-age',
    title: '유입 TOP5 × 연령',
    categories: CROSS_REGIONS.map((r) => r.city),
    series: AGE_BUCKET_KEYS.map((b, i) => ({
      label: b.label,
      color: CHART_TINTS[i % CHART_TINTS.length],
      values: CROSS_REGIONS.map((r) => sumAgeBucket(r.age, b.keys)),
    })),
  };
}

/** 상세 분석 슬라이드 15장 + 구분 간지 2장 */
export function buildDetailPerformanceSlides(): PerformanceReportSlide[] {
  const slides: PerformanceReportSlide[] = [];

  slides.push({
    id: 'div-detail-data',
    layout: 'divider',
    sectionLabel: 'Ⅱ-상세',
    title: '데이터 분석 상세',
    summary: ['교차분석 · 근거 데이터 · 해석'],
  });

  slides.push(
    detailSlide('det-gender-age', 'Ⅱ. 상세', '방문객 성별 × 연령 교차분석', '30~40대 여성 중심 구조가 전체 방문객 프로파일과 일치합니다', {
      charts: [
        { id: 'gender-donut', title: '성별 분포', type: 'donut', items: visitorDemographics.gender.map((g, i) => ({ label: g.label, value: g.value, color: i === 0 ? CHART_ORANGE : CHART_TINTS[3] })) },
        { id: 'age-bar', title: '연령대 분포', type: 'vertical', items: AGE_BUCKET_KEYS.map((b) => ({ label: b.label, value: sumAgeBucket(visitorDemographics.age, b.keys) })) },
      ],
      tables: [genderAgeCrossTable()],
      interpretation: ['여성 55%·30~40대 비중이 높아 가족·2050 여성 타깃 전략과 정합', '20대는 SNS·체험형, 50대+는 접근성·안내 정보 수요가 상대적으로 큼'],
      aiInsights: ['성별·연령 교차 결과, 프로그램·홍보 메시지를 가족형/연인형으로 이원화할 근거 확보', '50대+ 비중 확대 시 주차·셔틀·휴게 인프라 우선순위 상향'],
    }),
  );

  slides.push(
    detailSlide('det-inflow-top10', 'Ⅱ. 상세', '유입지역 TOP10 상세', '광역권 3개 도시가 전체 유입의 약 31%를 차지합니다', {
      charts: [{ id: 'inflow10-bar', title: '유입지역 TOP10', type: 'vertical', items: topInflowRegions.map((r) => ({ label: r.city, value: r.pct })) }],
      tables: [inflowTop10Table()],
      interpretation: ['TOP10 중 9개 지역이 외지—관광·당일/1박 방문 패턴 혼재', '여성 비중 51~59%로 유입지역별 가족·2050 타깃 홍보 적합'],
      aiInsights: interestsAnalysis.summary,
    }),
  );

  slides.push(
    detailSlide('det-region-gender', 'Ⅱ. 상세', '유입지역 × 성별 교차분석', '무궁·동원 등 일부 지역에서 여성 비중 58% 이상', {
      crossCharts: [regionGenderCross()],
      tables: [regionGenderTable()],
      interpretation: ['여성 비중 상위 지역: 무궁·동원·남산—가족 프로그램·키즈존 홍보 우선', '북해(남성 48%)는 연인·친구 동반 SNS 채널 활용 여지'],
      aiInsights: ['지역별 성별 구성 차이에 따라 Push/SNS 메시지 A/B 테스트 권장', '여성 비중 높은 도시 KTX·주차 연계 콘텐츠 제작'],
    }),
  );

  slides.push(
    detailSlide('det-region-age', 'Ⅱ. 상세', '유입지역 × 연령 교차분석', '가온·서림은 30~40대, 온양·청계는 20대 비중 상대적 높음', {
      crossCharts: [regionAgeCross()],
      tables: [regionAgeMatrixTable()],
      interpretation: ['광역권 도시는 30~40대·가족 동반 패턴 뚜렷', '20대 비중 높은 권역은 SNS·유튜브·인플루언서 연계 효과 기대'],
      aiInsights: ['연령 구조에 맞춘 시간대별 프로그램·혼잡 분산 전략 수립', '50대+ 비중 높은 해오름시·인근 도시는 접근성·안내 강화'],
    }),
  );

  slides.push(
    detailSlide('det-region-interest', 'Ⅱ. 상세', '유입지역 × 관심사 교차분석', '전 지역 식음료·컨텐츠 관심 1~2위, 출산/육아는 가족 유입지에서 상대 고位', {
      crossCharts: [{
        id: 'det-cross-interest', title: 'TOP5 × 관심사', categories: CROSS_REGIONS.map((r) => r.city),
        series: visitorDemographics.interests.slice(0, 4).map((item, i) => ({
          label: item.label, color: CHART_TINTS[i],
          values: CROSS_REGIONS.map((r) => Math.max(8, Math.round(item.value * (0.88 + ((r.rank + i) % 8) / 40)))),
        })),
      }],
      tables: [regionInterestMatrixTable()],
      interpretation: ['식음료·컨텐츠 관심은 전 지역 공통—축제-먹거리존 연계 전략 타당', '출산/육아 관심은 가온·동원 등 가족 유입지에서 두드러짐'],
      aiInsights: interestsAnalysis.summary,
    }),
  );

  slides.push(
    detailSlide('det-interest-top10', 'Ⅱ. 상세', '관심사 TOP10 분석', '식음료 81%·컨텐츠 72%로 야간·체험형 콘텐츠 적합성 확인', {
      charts: [{ id: 'interest-hbar', title: '관심사 TOP6', type: 'horizontal', items: visitorDemographics.interests.map((i) => ({ label: i.label, value: i.value, unit: `${i.value}%` })) }],
      tables: [interestTop10Table()],
      interpretation: ['식음료·컨텐츠·여행 관심 상위—야간축제·미디어아트·먹거리 연계 적합', '출산/육아 관심은 일반 대비 높아 가족형 프로그램 확대 근거'],
      aiInsights: ['관심사 상위 3개(식음료·컨텐츠·여행) 중심 콘텐츠 기획', 'ART/전시·패션 관심층 대상 부대 프로그램·굿즈 확장 검토'],
    }),
  );

  slides.push(
    detailSlide('det-interest-gender', 'Ⅱ. 상세', '관심사 × 성별 교차분석', '식음료·컨텐츠는 여성, ART/전시는 남녀 격차 상대적 작음', {
      charts: [{ id: 'int-gender-h', title: '관심사별 여성 비중', type: 'horizontal', items: visitorDemographics.interests.slice(0, 6).map((i, idx) => ({ label: i.label, value: i.value + 3 - (idx % 2), unit: `${i.value + 3 - (idx % 2)}%` })) }],
      tables: [interestGenderTable()],
      interpretation: ['출산/육아·식음료는 여성 비중 높음—2050 여성·가족 메시지 강화', '컨텐츠·여행은 남녀 모두 높은 관심—공통 홍보 소재로 활용'],
      aiInsights: ['성별 관심사 차이를 반영한 채널·크리에이티브 분리', '공통 관심(컨텐츠) 중심 브랜드 메시지 + 세그먼트별 서브 메시지'],
    }),
  );

  slides.push(
    detailSlide('det-interest-age', 'Ⅱ. 상세', '관심사 × 연령 교차분석', '20~30대는 컨텐츠·여행, 40대+는 식음료·ART 비중 상대적 높음', {
      charts: [{ id: 'int-age-v', title: '연령별 관심(식음료)', type: 'vertical', items: [{ label: '20대', value: 78 }, { label: '30대', value: 84 }, { label: '40대', value: 82 }, { label: '50대+', value: 76 }] }],
      tables: [interestAgeTable()],
      interpretation: ['30대 식음료·컨텐츠 관심 최고—가족·체험 패키지 홍보 적합', '50대+ ART/전시·관광 관심 상대적 증가'],
      aiInsights: ['연령대별 관심사 차이를 반영한 프로그램·부스 구성', '20대 SNS·30대 가족·50대+ 접근성 정보 분리 제공'],
    }),
  );

  slides.push({ id: 'div-detail-svy', layout: 'divider', sectionLabel: 'Ⅲ-상세', title: '만족도 조사 상세', summary: ['응답자 프로파일 · 항목별·교차분석'] });

  slides.push(
    detailSlide('det-respondent', 'Ⅲ. 상세', '응답자 프로파일 상세', '여성 52%·30대 22%·가족 동반 43%—방문객 프로파일과 유사', {
      charts: [
        { id: 'resp-gender', title: '응답자 성별', type: 'donut', items: respondentProfile.gender.map((g) => ({ label: g.label, value: g.value, color: g.color })) },
        { id: 'resp-companion', title: '동반 유형', type: 'donut', items: respondentProfile.companion.slice(0, 4).map((c) => ({ label: c.label, value: c.value, color: c.color })) },
      ],
      tables: [respondentProfileTable()],
      interpretation: ['응답자 구성이 SK 위치데이터 방문객 프로파일과 정합—대표성 확보', '외지인 68%·가족 동반 43%—관광·가족형 축제 포지셔닝 확인'],
      aiInsights: ['설문 결과를 지역경제·재방문 정책에 연결할 수 있는 표본 대표성', '거주자·외지인 만족도 차이 분석으로 맞춤 개선 과제 도출'],
    }),
  );

  slides.push(
    detailSlide('det-satisfaction-items', 'Ⅲ. 상세', '만족도 항목별 상세', '드론쇼 4.8·교통 3.4—콘텐츠 vs 인프라 격차 뚜렷', {
      charts: [{ id: 'sat-program', title: '프로그램별 만족도', type: 'horizontal', items: satisfaction.byProgram.map((p) => ({ label: p.label.replace(' ', ''), value: p.score, unit: `${p.score.toFixed(1)}점` })), maxValue: 5, unit: '점' }],
      tables: [satisfactionItemsTable()],
      interpretation: ['드론·미디어아트 4.6점 이상—야간 콘텐츠가 축제 경쟁력 핵심', '교통·안내 3.4~3.8점—주차·표지판·혼잡 관리가 재방문 제약'],
      aiInsights: satisfaction.needsImprovement.map((k) => `${k} 개선이 NPS·재방문 제고의 단기 과제`),
    }),
  );

  slides.push(
    detailSlide('det-satisfaction-age', 'Ⅲ. 상세', '만족도 × 연령 교차분석', '50대+ 만족도·드론쇼 평가 상대적 높음, 20대 교통 불만 두드러짐', {
      crossCharts: [{ id: 'sat-age-cross', title: '연령 × 프로그램(드론·교통)', categories: ['20대', '30대', '40대', '50대+'], series: [{ label: '드론쇼', color: CHART_ORANGE, values: [4.6, 4.7, 4.8, 4.9] }, { label: '교통', color: CHART_TINTS[1], values: [3.2, 3.4, 3.5, 3.6] }] }],
      tables: [satisfactionAgeTable()],
      interpretation: ['연령 증가에 따라 전반 만족도·드론쇼 평가 상승', '20~30대 교통·혼잡 불만 집중—접근성·주차 개선 시급'],
      aiInsights: ['연령별 만족 격차는 인프라·안내 품질에서 기인', '20대 대상 교통·SNS 안내·셔틀 정보 강화'],
    }),
  );

  slides.push(
    detailSlide('det-satisfaction-purpose', 'Ⅲ. 상세', '만족도 × 방문 목적 교차분석', '드론쇼 목적 방문객의 프로그램 만족 최고, 먹거리 목적은 푸드존 만족 높음', {
      charts: [{ id: 'purpose-bar', title: '방문 목적 분포', type: 'horizontal', items: visitPurpose.overall.map((p) => ({ label: p.label, value: p.value, unit: `${p.value}%` })) }],
      tables: [satisfactionPurposeTable()],
      interpretation: ['목적별 만족 격차—드론쇼·가족·먹거리 목적 각각 강점 프로그램 존재', '교통·안내는 전 목적 공통 저점—인프라 개선 우선'],
      aiInsights: visitPurpose.aiInsights.slice(0, 2),
    }),
  );

  slides.push(
    detailSlide('det-revisit-age', 'Ⅲ. 상세', '재방문 의향 × 연령 교차분석', '40~50대 재방문·NPS 최고, 20대 NPS 상대적 낮음', {
      charts: [{ id: 'revisit-levels', title: '재방문 의향', type: 'donut', items: revisitIntent.levels.map((l, i) => ({ label: l.label, value: l.value, color: CHART_TINTS[i % CHART_TINTS.length] })) }],
      tables: [revisitAgeTable()],
      interpretation: ['재방문 91%·NPS 47—콘텐츠 만족이 충성도로 연결', '20대 NPS 42—교통·혼잡 개선 시 상승 여지'],
      aiInsights: [nps.reason.summary, '40~50대 추천·재방문 의향 높음—입소문·지인추천 채널 활용'],
    }),
  );

  slides.push(
    detailSlide('det-improvement-age', 'Ⅲ. 상세', '개선 의견 × 연령 교차분석', '주차·교통·혼잡 공통, 50대+ 화장실·대기시간 언급 상대적 높음', {
      charts: [{ id: 'imp-keywords', title: '개선 키워드', type: 'horizontal', items: satisfaction.needsImprovement.map((k, i) => ({ label: k, value: 40 - i * 5, unit: `${40 - i * 5}%`, color: CHART_TINTS[1] })) }],
      tables: [improvementAgeTable()],
      interpretation: ['전 연령 주차·교통 1~2순위—단기 실행 과제', '50대+ 화장실·대기시간—인프라·동선 개선 필요'],
      aiInsights: ['연령별 개선 우선순위 차이를 반영한 예산·일정 수립', '혼잡 시간대 분산·예약제로 대기·교통 동시 완화'],
    }),
  );

  slides.push(
    detailSlide('det-free-keywords', 'Ⅲ. 상세', '자유응답 키워드 상세', '긍정: 드론·야경·볼거리 / 개선: 주차·교통·혼잡', {
      charts: [
        { id: 'pos-kw', title: '긍정 TOP5', type: 'horizontal', items: freeResponse.positive.slice(0, 5).map((w) => ({ label: w.word, value: w.weight * 10, unit: `${w.weight}회` })) },
        { id: 'neg-kw', title: '개선 TOP5', type: 'horizontal', items: freeResponse.negative.slice(0, 5).map((w) => ({ label: w.word, value: w.weight * 10, unit: `${w.weight}회`, color: CHART_TINTS[1] })) },
      ],
      tables: [freeResponseTable()],
      interpretation: [freeResponse.aiSummary, '정량 키워드와 질적 응답이 일치—정책 우선순위 신뢰성 확보'],
      aiInsights: ['긍정 자산(드론·야경) 마케팅 메시지 핵심 소재화', '개선 키워드 기반 단기·중기 실행 로드맵 수립'],
    }),
  );

  return slides;
}
