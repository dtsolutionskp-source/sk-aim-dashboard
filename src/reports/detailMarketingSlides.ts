import type { CrossChartSpec, ReportChartSpec } from './reportCharts';
import type { PerformanceReportSlide } from './performanceReportSlides';
import { computeMarketingAggregates } from '../data/marketingReportTables';
import {
  bannerDetailTable,
  channelCompareTable,
  creativeCompareTable,
  marketingInsightTable,
  pushDetailTable,
  segmentCrossTable,
} from './data/marketingDetailTables';
import { targetSegments } from '../data/mockData';

const CHART_ORANGE = '#f47725';

function mktDetailSlide(
  id: string,
  title: string,
  headline: string,
  opts: {
    charts?: ReportChartSpec[];
    crossCharts?: CrossChartSpec[];
    tables?: ReturnType<typeof pushDetailTable>[];
    interpretation?: string[];
    aiInsights: string[];
  },
): PerformanceReportSlide {
  return {
    id,
    sectionLabel: 'Ⅰ. 상세',
    layout: 'detail',
    title,
    headline,
    charts: opts.charts?.slice(0, 2),
    crossCharts: opts.crossCharts?.slice(0, 1),
    tables: opts.tables,
    interpretation: opts.interpretation,
    aiInsights: opts.aiInsights,
  };
}

/** 마케팅 상세 6장 + 간지 1장 */
export function buildDetailMarketingSlides(): PerformanceReportSlide[] {
  const mkt = computeMarketingAggregates();
  const slides: PerformanceReportSlide[] = [];

  slides.push({
    id: 'div-detail-mkt',
    layout: 'divider',
    sectionLabel: 'Ⅰ-상세',
    title: '마케팅 성과 상세',
    summary: ['OK캐쉬백 · Push·배너 · 세그먼트 교차분석'],
  });

  slides.push(
    mktDetailSlide('det-mkt-push', 'Push 성과 상세', 'OK캐쉬백 타겟 Push CTR 12%대—18~21시 발송 효율 최고', {
      charts: [
        {
          id: 'mkt-seg-ctr',
          title: '세그먼트별 CTR',
          type: 'horizontal',
          items: targetSegments.map((s, i) => ({
            label: s.label,
            value: 14.2 - i * 0.8,
            unit: `${(14.2 - i * 0.8).toFixed(1)}%`,
          })),
          maxValue: 16,
        },
        {
          id: 'mkt-time-ctr',
          title: '시간대별 CTR',
          type: 'vertical',
          items: [
            { label: '09~12', value: 8.2 },
            { label: '12~18', value: 11.5 },
            { label: '18~21', value: 15.8 },
            { label: '21~24', value: 10.1 },
          ],
        },
      ],
      tables: [pushDetailTable()],
      interpretation: [
        `도달 ${mkt.pushReach.toLocaleString()}명·클릭 ${mkt.pushClicks.toLocaleString()}건—OK캐쉬백 Push 채널 검증`,
        '2050 여성·가족단위 세그먼트 CTR 상위—축제 방문객 프로파일과 정합',
      ],
      aiInsights: [
        '18~21시 발송 비중 확대 시 CTR 추가 상승 기대',
        '세그먼트별 메시지 이원화(가족 vs 연인)로 전환율 개선',
        '설문 Push는 현장 응답 확보 채널로 재활용 가치 높음',
      ],
    }),
  );

  slides.push(
    mktDetailSlide('det-mkt-banner', '배너 성과 상세', 'OK캐쉬백 앱 배너 노출 89만건·클릭 4.2만건', {
      charts: [
        {
          id: 'mkt-banner-h',
          title: '소재별 CTR',
          type: 'horizontal',
          items: [
            { label: '모바일전단지', value: 6.6, unit: '6.6%' },
            { label: '메인상단DA', value: 5.7, unit: '5.7%' },
            { label: '이벤트배너', value: 2.42, unit: '2.4%' },
            { label: '라이프스타일', value: 1.64, unit: '1.6%' },
          ],
          maxValue: 8,
        },
      ],
      tables: [bannerDetailTable()],
      interpretation: [
        '모바일 전단지·메인 DA 소재 CTR 5% 이상—시각적 임팩트 소재 우수',
        '라이프스타일 배너는 보조 노출—리타겟팅·빈도 조절 검토',
      ],
      aiInsights: [
        '고CTR 소재를 Push 썸네일·배너에 크로스 활용',
        '노출 대비 클릭은 Push 대비 낮으나 인지도 확보에 기여',
      ],
    }),
  );

  slides.push(
    mktDetailSlide('det-mkt-channel', '채널 비교 분석', 'Push CTR이 배너 대비 2.5배 이상—전환 중심 채널', {
      charts: [
        {
          id: 'mkt-ch-ctr',
          title: '채널별 CTR 비교',
          type: 'horizontal',
          items: [
            { label: '타겟Push', value: mkt.clickRate, unit: `${mkt.clickRate.toFixed(1)}%`, color: CHART_ORANGE },
            {
              label: '앱배너',
              value: mkt.impressions > 0 ? (mkt.bannerClicks / mkt.impressions) * 100 : 0,
              unit: `${mkt.impressions > 0 ? ((mkt.bannerClicks / mkt.impressions) * 100).toFixed(1) : 0}%`,
            },
          ],
          maxValue: 16,
        },
        {
          id: 'mkt-ch-click',
          title: '채널별 클릭',
          type: 'vertical',
          items: [
            { label: 'Push', value: mkt.pushClicks },
            { label: '배너', value: mkt.bannerClicks },
          ],
        },
      ],
      tables: [channelCompareTable()],
      interpretation: ['Push는 전환·설문 유도, 배너는 인지·도달 확대 역할 분담', '통합 클릭 1.4만건+—채널 믹스 전략 타당성 확인'],
      aiInsights: ['Push 예산 비중 유지·배너는 고CTR 소재 집중', '채널별 KPI(CTR vs 노출) 분리 관리 권장'],
    }),
  );

  slides.push(
    mktDetailSlide('det-mkt-segment', '세그먼트별 마케팅 성과', '여성·20~30대·식음료 관심층 CTR 상위', {
      crossCharts: [
        {
          id: 'mkt-cross-seg',
          title: '세그먼트별 CTR',
          categories: targetSegments.map((s) => s.label.slice(0, 6)),
          series: [{ label: 'CTR', color: CHART_ORANGE, values: [14.2, 13.1, 12.4, 11.8] }],
        },
      ],
      tables: [segmentCrossTable()],
      interpretation: [
        '성별·연령·관심사·지역 교차 시 2050 여성·식음료 관심 CTR 최고',
        '광역권 TOP 유입지역과 마케팅 반응 지역 정합',
      ],
      aiInsights: [
        '고반응 세그먼트에 예산·발송 빈도 우선 배분',
        '저반응 세그먼트는 메시지·소재 A/B 테스트',
      ],
    }),
  );

  slides.push(
    mktDetailSlide('det-mkt-creative', '소재별 성과 비교', '축제 홍보 Push CTR 최고·설문 Push는 현장 전환 특화', {
      charts: [
        {
          id: 'mkt-creative-ctr',
          title: '소재별 CTR',
          type: 'horizontal',
          items: [
            { label: '홍보Push', value: 12.0, unit: '12.0%' },
            { label: '설문Push', value: 11.3, unit: '11.3%' },
            { label: '메인배너', value: 4.8, unit: '4.8%' },
          ],
          maxValue: 14,
        },
      ],
      tables: [creativeCompareTable()],
      interpretation: [
        '홍보·설문 Push 모두 11% 이상 CTR—OK캐쉬백 타겟팅 정확도 우수',
        '배너는 도달 극대화·Push는 전환 극대화 역할',
      ],
      aiInsights: ['소재별 도달률·클릭률 동시 모니터링', '차기 축제 동일 소재 템플릿 재활용 검토'],
    }),
  );

  slides.push(
    mktDetailSlide('det-mkt-insight', '마케팅 종합 인사이트', 'Push·2050 여성 세그먼트가 가장 효율적—야간 시간대 집중 운영 권장', {
      tables: [marketingInsightTable()],
      interpretation: [
        'OK캐쉬백 단일 미디어로 Push·배너 통합 집행—성과 추적 일원화',
        '방문객 프로파일(30~40대 여성·가족)과 마케팅 타겟 정합성 높음',
      ],
      aiInsights: [
        '가장 효율적 채널: 타겟 Push (CTR 12%+)',
        '가장 반응 높은 고객군: 2050 여성·가족단위',
        '향후 추천 타겟: 광역권 30~40대 가족 + 식음료·컨텐츠 관심층',
        '운영 제안: 18~21시 발송·고CTR 배너 소재 Push 연계·설문 G/F Push 현장 활용',
      ],
    }),
  );

  return slides;
}
