import type { PerformanceReportSlide } from '../performanceReportSlides';
import { BLOCK_ESTIMATE, REPORT_CONTENT_HEIGHT, REPORT_PAGE } from './constants';
import { clampHeadline, clampInsights, estimateHeadlineLines } from './textFit';

export interface LayoutBlock {
  type: 'header' | 'kpi' | 'chart' | 'insight' | 'closing-body';
  estimatedHeight: number;
}

export interface SlideLayoutPlan {
  slideId: string;
  blocks: LayoutBlock[];
  totalHeight: number;
  overflows: boolean;
  overflowPx: number;
}

function estimateSlideHeight(slide: PerformanceReportSlide): number {
  if (slide.layout === 'cover' || slide.layout === 'divider') {
    return REPORT_CONTENT_HEIGHT;
  }

  let h = 0;
  const gap = REPORT_PAGE.gap;

  if (slide.layout === 'closing') {
    h += BLOCK_ESTIMATE.sectionLabel + gap;
    h += BLOCK_ESTIMATE.topic + gap;
    if (slide.headline) h += estimateHeadlineLines(slide.headline) * BLOCK_ESTIMATE.headlineLine + gap;
    h += BLOCK_ESTIMATE.closingDiagnosis + gap;
    h += BLOCK_ESTIMATE.closingPolicy;
    return h;
  }

  if (slide.layout !== 'report' && slide.layout !== 'detail') return 0;

  if (slide.sectionLabel) h += BLOCK_ESTIMATE.sectionLabel + gap;
  h += BLOCK_ESTIMATE.topic + gap;
  if (slide.headline) {
    h += estimateHeadlineLines(slide.headline) * BLOCK_ESTIMATE.headlineLine + gap;
  }

  if (slide.layout === 'detail') {
    if (slide.charts?.length) {
      h += (slide.charts.length > 1 ? BLOCK_ESTIMATE.chartDual : BLOCK_ESTIMATE.chartSingle) + gap;
    }
    if (slide.crossCharts?.length) h += BLOCK_ESTIMATE.chartSingle + gap;
    if (slide.tables?.length) h += BLOCK_ESTIMATE.detailTable + gap;
    if (slide.interpretation?.length) h += BLOCK_ESTIMATE.interpretation + gap;
    if (slide.aiInsights?.length) h += BLOCK_ESTIMATE.insightBox;
    return h;
  }

  if (slide.kpis?.length) h += BLOCK_ESTIMATE.kpiRow + gap;
  if (slide.charts?.length) {
    h += (slide.charts.length > 1 ? BLOCK_ESTIMATE.chartDual : BLOCK_ESTIMATE.chartSingle) + gap;
  }
  if (slide.crossCharts?.length) h += BLOCK_ESTIMATE.chartSingle + gap;
  if (slide.aiInsights?.length) h += BLOCK_ESTIMATE.insightBox;

  return h;
}

/** collision check — 초과 시 차트 또는 인사이트를 줄인 슬라이드 반환 */
export function stabilizeSlide(slide: PerformanceReportSlide): PerformanceReportSlide {
  if (slide.layout === 'detail') {
    return {
      ...slide,
      headline: slide.headline ? clampHeadline(slide.headline) : slide.headline,
      interpretation: slide.interpretation?.slice(0, 3),
      aiInsights: slide.aiInsights ? clampInsights(slide.aiInsights) : slide.aiInsights,
      tables: slide.tables?.map((t) => ({
        ...t,
        rows: t.rows.slice(0, 8),
      })),
    };
  }

  if (slide.layout !== 'report') {
    if (slide.headline) {
      return { ...slide, headline: clampHeadline(slide.headline) };
    }
    if (slide.aiInsights) {
      return { ...slide, aiInsights: clampInsights(slide.aiInsights) };
    }
    return slide;
  }

  let stabilized: PerformanceReportSlide = {
    ...slide,
    headline: slide.headline ? clampHeadline(slide.headline) : slide.headline,
    aiInsights: slide.aiInsights ? clampInsights(slide.aiInsights) : slide.aiInsights,
  };

  let height = estimateSlideHeight(stabilized);

  if (height > REPORT_CONTENT_HEIGHT && stabilized.charts && stabilized.charts.length > 1) {
    stabilized = { ...stabilized, charts: stabilized.charts.slice(0, 1) };
    height = estimateSlideHeight(stabilized);
  }

  if (height > REPORT_CONTENT_HEIGHT && stabilized.charts?.length) {
    stabilized = { ...stabilized, charts: undefined };
    height = estimateSlideHeight(stabilized);
  }

  if (height > REPORT_CONTENT_HEIGHT && stabilized.crossCharts?.length) {
    stabilized = { ...stabilized, crossCharts: undefined };
    height = estimateSlideHeight(stabilized);
  }

  if (height > REPORT_CONTENT_HEIGHT && stabilized.aiInsights && stabilized.aiInsights.length > 2) {
    stabilized = {
      ...stabilized,
      aiInsights: clampInsights(stabilized.aiInsights, 2),
    };
  }

  return stabilized;
}

export function stabilizeAllSlides(slides: PerformanceReportSlide[]): PerformanceReportSlide[] {
  return slides.map(stabilizeSlide);
}

export function planSlideLayout(slide: PerformanceReportSlide): SlideLayoutPlan {
  const totalHeight = estimateSlideHeight(slide);
  return {
    slideId: slide.id,
    blocks: [],
    totalHeight,
    overflows: totalHeight > REPORT_CONTENT_HEIGHT,
    overflowPx: Math.max(0, totalHeight - REPORT_CONTENT_HEIGHT),
  };
}
