/** 가로 PT 슬라이드 (16:9) — PDF/PPT 공통 치수 */
export const REPORT_PAGE = {
  width: 1123,
  height: 632,
  marginTop: 40,
  marginRight: 40,
  marginBottom: 36,
  marginLeft: 40,
  footerHeight: 36,
  gap: 12,
  kpiCardMinHeight: 72,
  kpiCardMaxHeight: 90,
} as const;

export const REPORT_CONTENT_HEIGHT =
  REPORT_PAGE.height -
  REPORT_PAGE.marginTop -
  REPORT_PAGE.marginBottom -
  REPORT_PAGE.footerHeight;

export const REPORT_FONT_STACK =
  "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, sans-serif";

/** 블록별 예상 높이(px) — collision check용 */
export const BLOCK_ESTIMATE = {
  sectionLabel: 22,
  topic: 26,
  headlineLine: 30,
  kpiRow: REPORT_PAGE.kpiCardMaxHeight,
  chartSingle: 168,
  chartDual: 168,
  insightBox: 92,
  detailTable: 220,
  interpretation: 52,
  closingDiagnosis: 200,
  closingPolicy: 120,
} as const;
