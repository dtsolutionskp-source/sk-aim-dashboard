/** 보고서 컴포넌트 고정 Grid 규칙 — 페이지별 자동 계산 없이 동일 치수 적용 */

export const REPORT_GRID = {
  gap: 10,
  /** 요약 페이지 */
  summary: {
    kpiRowHeight: 90,
    chartZoneHeight: 172,
    insightHeight: 96,
  },
  /** 상세 페이지 */
  detail: {
    mainHeight: 252,
    chartColPct: 38,
    tableColPct: 62,
    stackChartHeight: 142,
    interpretationHeight: 56,
    insightHeight: 92,
    tableRowHeight: 22,
    tableHeaderHeight: 24,
    tableMaxRows: 8,
  },
  /** 종합(Closing) 페이지 */
  closing: {
    diagnosisHeight: 210,
    policyHeight: 124,
  },
} as const;

export type DetailGridVariant = 'split' | 'stack' | 'dual-top';

/** 콘텐츠 조합 → 고정 Grid 변형 (규칙 기반, 페이지별 분기 없음) */
export function resolveDetailGridVariant(opts: {
  charts?: unknown[];
  crossCharts?: unknown[];
  tables?: unknown[];
}): DetailGridVariant {
  const chartCount = opts.charts?.length ?? 0;
  const hasCross = (opts.crossCharts?.length ?? 0) > 0;
  const hasTable = (opts.tables?.length ?? 0) > 0;

  if (chartCount >= 2 && hasTable) return 'dual-top';
  if (hasCross && chartCount === 0) return 'stack';
  if (!chartCount && !hasCross && hasTable) return 'stack';
  return 'split';
}
