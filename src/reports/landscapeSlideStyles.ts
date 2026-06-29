import { REPORT_FONT_STACK, REPORT_PAGE } from './layout/constants';
import { REPORT_GRID } from './layout/gridLayout';
import { REPORT_FONT_LINKS } from './typography/reportTypography';

/** 가로 PT 슬라이드 — 레이아웃 안정성 우선 (PDF/PPT 공통) */
export const LANDSCAPE_SLIDE_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sk-orange: #f47725;
    --sk-red: #ea002c;
    --sk-white: #ffffff;
    --sk-text: #191f28;
    --sk-text-sub: #4e5968;
    --sk-bg-warm: #fff5ef;
    --sk-border: #ffe0cc;
    --rpt-mt: ${REPORT_PAGE.marginTop}px;
    --rpt-mx: ${REPORT_PAGE.marginLeft}px;
    --rpt-mb: ${REPORT_PAGE.marginBottom}px;
    --rpt-footer-h: ${REPORT_PAGE.footerHeight}px;
    --rpt-gap: ${REPORT_PAGE.gap}px;
    --rpt-kpi-min: ${REPORT_PAGE.kpiCardMinHeight}px;
    --rpt-kpi-max: ${REPORT_PAGE.kpiCardMaxHeight}px;
    --rpt-summary-chart-h: ${REPORT_GRID.summary.chartZoneHeight}px;
    --rpt-summary-insight-h: ${REPORT_GRID.summary.insightHeight}px;
    --rpt-detail-main-h: ${REPORT_GRID.detail.mainHeight}px;
    --rpt-detail-stack-chart-h: ${REPORT_GRID.detail.stackChartHeight}px;
    --rpt-detail-interpret-h: ${REPORT_GRID.detail.interpretationHeight}px;
    --rpt-detail-insight-h: ${REPORT_GRID.detail.insightHeight}px;
    --rpt-table-row-h: ${REPORT_GRID.detail.tableRowHeight}px;
    --rpt-table-head-h: ${REPORT_GRID.detail.tableHeaderHeight}px;
  }

  body {
    font-family: ${REPORT_FONT_STACK};
    background: #ececec;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    -webkit-font-smoothing: antialiased;
  }

  .slide-deck { display: flex; flex-direction: column; gap: 16px; padding: 16px; }

  /* ── 페이지 프레임: 안전영역 + footer 분리 ── */
  .slide-page {
    width: ${REPORT_PAGE.width}px;
    height: ${REPORT_PAGE.height}px;
    background: var(--sk-white);
    position: relative;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
    display: flex;
    flex-direction: column;
    padding: var(--rpt-mt) var(--rpt-mx) 0 var(--rpt-mx);
  }

  .slide-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--sk-orange), var(--sk-red));
    z-index: 2;
  }

  .rpt-slide-inner {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: var(--rpt-gap);
  }

  .rpt-footer {
    flex-shrink: 0;
    height: var(--rpt-footer-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ebebeb;
    font-size: 8pt;
    line-height: 1.35;
    color: #a8b0b8;
    margin-bottom: var(--rpt-mb);
  }

  /* ── 표지 ── */
  .slide-cover {
    justify-content: center;
    padding-top: 56px;
    padding-bottom: var(--rpt-mb);
  }

  .slide-cover .rpt-slide-inner {
    justify-content: center;
    padding-bottom: 0;
  }

  .cover-brand {
    font-size: 10pt;
    font-weight: 700;
    color: var(--sk-orange);
    letter-spacing: 0.12em;
    margin-bottom: 28px;
    line-height: 1.35;
  }

  .cover-title {
    font-size: 34pt;
    font-weight: 700;
    color: var(--sk-text);
    line-height: 1.25;
    white-space: pre-line;
    margin-bottom: 32px;
  }

  .cover-meta { list-style: none; max-width: 520px; }

  .cover-meta li {
    font-size: 11pt;
    line-height: 1.55;
    color: var(--sk-text-sub);
    padding: 5px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .cover-meta li:last-child {
    border-bottom: none;
    font-size: 9pt;
    color: #8b95a1;
    margin-top: 6px;
  }

  .cover-deco {
    position: absolute;
    right: 56px;
    bottom: calc(var(--rpt-mb) + var(--rpt-footer-h) + 24px);
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 2px solid var(--sk-border);
    background: var(--sk-bg-warm);
    pointer-events: none;
  }

  /* ── 간지 ── */
  .slide-divider {
    background: var(--sk-text);
    text-align: center;
    padding-top: 48px;
    padding-bottom: var(--rpt-mb);
  }

  .slide-divider .rpt-slide-inner {
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
  }

  .divider-numeral {
    font-size: 72pt;
    font-weight: 700;
    color: rgba(244,119,37,0.28);
    line-height: 1;
    margin-bottom: 16px;
  }

  .divider-title {
    font-size: 28pt;
    font-weight: 700;
    color: var(--sk-white);
    line-height: 1.3;
    margin-bottom: 12px;
  }

  .divider-sub {
    font-size: 12pt;
    color: rgba(255,255,255,0.68);
    line-height: 1.5;
    max-width: 460px;
  }

  .divider-line {
    width: 40px;
    height: 3px;
    background: var(--sk-orange);
    margin: 20px auto 0;
  }

  .slide-divider .rpt-footer {
    color: rgba(255,255,255,0.38);
    border-top-color: rgba(255,255,255,0.12);
  }

  /* ── 섹션 헤더 ── */
  .rpt-header {
    flex-shrink: 0;
    margin-bottom: var(--rpt-gap);
  }

  .rpt-section-label {
    font-size: 9pt;
    font-weight: 700;
    color: var(--sk-orange);
    letter-spacing: 0.08em;
    line-height: 1.35;
    margin-bottom: 6px;
  }

  .rpt-page-topic {
    font-size: 11pt;
    font-weight: 600;
    color: var(--sk-text-sub);
    line-height: 1.35;
    margin-bottom: 8px;
  }

  .rpt-headline {
    font-size: 18pt;
    font-weight: 700;
    color: var(--sk-text);
    line-height: 1.4;
    padding-left: 14px;
    border-left: 4px solid var(--sk-orange);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: keep-all;
    max-height: calc(1.4em * 2 + 2px);
  }

  /* ── 본문 고정 Grid ── */
  .rpt-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .rpt-body--summary {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) var(--rpt-summary-insight-h);
    gap: var(--rpt-gap);
  }

  .rpt-body-main {
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: var(--rpt-gap);
    overflow: hidden;
  }

  .rpt-body--summary .rpt-chart-zone {
    height: var(--rpt-summary-chart-h);
    max-height: var(--rpt-summary-chart-h);
    flex: none;
  }

  .rpt-body--summary .rpt-insight-box {
    height: var(--rpt-summary-insight-h);
    min-height: var(--rpt-summary-insight-h);
    max-height: var(--rpt-summary-insight-h);
  }

  /* ── KPI 카드 (보고서 전용, 버튼 아님) ── */
  .rpt-kpi-row {
    display: grid;
    gap: var(--rpt-gap);
    flex-shrink: 0;
  }

  .rpt-kpi-row--3 { grid-template-columns: repeat(3, 1fr); }
  .rpt-kpi-row--4 { grid-template-columns: repeat(4, 1fr); }

  .rpt-kpi-card {
    min-height: var(--rpt-kpi-min);
    max-height: var(--rpt-kpi-max);
    padding: 12px 14px;
    border: 1px solid var(--sk-border);
    border-radius: 4px;
    background: var(--sk-white);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    overflow: hidden;
  }

  .rpt-kpi-card--highlight {
    background: var(--sk-bg-warm);
    border-color: var(--sk-orange);
    border-width: 2px;
  }

  .rpt-kpi-label {
    font-size: 10pt;
    font-weight: 600;
    color: var(--sk-text-sub);
    line-height: 1.4;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .rpt-kpi-value-wrap {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 3px;
    line-height: 1.4;
    min-height: 0;
  }

  .rpt-kpi-value {
    font-weight: 700;
    color: var(--sk-orange);
    line-height: 1.4;
    letter-spacing: -0.02em;
    white-space: nowrap;
    flex-shrink: 0;
    display: block;
  }

  .rpt-kpi-card--highlight .rpt-kpi-value { color: var(--sk-red); }

  .rpt-kpi-unit {
    font-size: 10pt;
    font-weight: 600;
    color: var(--sk-text-sub);
    line-height: 1.4;
    flex-shrink: 0;
  }

  /* ── 차트 영역 ── */
  .rpt-chart-zone {
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chart-panel--dense .hbar-row { margin-bottom: 3px; }
  .chart-panel--dense .hbar-chart { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }

  .rpt-chart-row {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--rpt-gap);
    overflow: hidden;
  }

  .rpt-chart-slot {
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .chart-panel {
    border: 1px solid var(--sk-border);
    border-radius: 4px;
    padding: 10px 12px 8px;
    background: var(--sk-white);
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chart-panel-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: var(--sk-text);
    line-height: 1.35;
    margin-bottom: 6px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--sk-border);
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hbar-chart { flex: 1; min-height: 0; overflow: hidden; }

  .hbar-row {
    display: grid;
    grid-template-columns: minmax(64px, 88px) 1fr 48px;
    gap: 6px;
    align-items: center;
    margin-bottom: 5px;
  }

  .hbar-label {
    font-size: 9pt;
    line-height: 1.35;
    color: var(--sk-text-sub);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hbar-track { height: 12px; background: var(--sk-bg-warm); border-radius: 3px; overflow: hidden; }
  .hbar-fill { height: 100%; border-radius: 3px; min-width: 2px; }
  .hbar-value { font-size: 9pt; font-weight: 700; color: var(--sk-orange); text-align: right; line-height: 1.35; }

  .vbar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    flex: 1;
    min-height: 80px;
    max-height: 120px;
    padding-top: 2px;
    overflow: hidden;
  }

  .vbar-item { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 56px; min-width: 0; }
  .vbar-col { width: 24px; height: 72px; background: var(--sk-bg-warm); border-radius: 3px 3px 0 0; display: flex; align-items: flex-end; overflow: hidden; }
  .vbar-fill { width: 100%; border-radius: 3px 3px 0 0; min-height: 2px; background: var(--sk-orange); }
  .vbar-label { font-size: 7.5pt; line-height: 1.3; color: var(--sk-text-sub); margin-top: 3px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
  .vbar-value { font-size: 7.5pt; font-weight: 700; color: var(--sk-orange); margin-bottom: 2px; line-height: 1.35; }

  .donut-layout { display: flex; align-items: center; gap: 10px; flex: 1; min-height: 0; overflow: hidden; }
  .donut-svg { width: 96px; height: 96px; flex-shrink: 0; }
  .donut-legend { flex: 1; min-width: 0; overflow: hidden; }
  .donut-legend-item { display: flex; align-items: center; gap: 5px; margin-bottom: 3px; font-size: 8.5pt; line-height: 1.35; }
  .donut-swatch { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .donut-legend-label { flex: 1; color: var(--sk-text-sub); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .donut-legend-value { font-weight: 700; color: var(--sk-orange); flex-shrink: 0; }

  .cross-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; flex-shrink: 0; }
  .cross-legend-item { font-size: 8pt; line-height: 1.35; color: var(--sk-text-sub); display: flex; align-items: center; gap: 4px; }
  .cross-legend-item i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }

  .gbar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    flex: 1;
    min-height: 0;
    max-height: 100px;
    gap: 4px;
    overflow: hidden;
    padding-bottom: 2px;
  }

  .gbar-group { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 0; }
  .gbar-stack { display: flex; align-items: flex-end; gap: 2px; height: 88px; }
  .gbar { width: 10px; border-radius: 2px 2px 0 0; min-height: 2px; }
  .gbar-label { font-size: 7pt; line-height: 1.25; color: var(--sk-text-sub); margin-top: 3px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }

  /* ── AI 인사이트 박스 ── */
  .rpt-insight-box {
    flex-shrink: 0;
    background: var(--sk-bg-warm);
    border: 1px solid var(--sk-border);
    border-left: 4px solid var(--sk-red);
    border-radius: 0 4px 4px 0;
    padding: 10px 14px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: start;
    overflow: hidden;
  }

  .rpt-insight-badge {
    flex-shrink: 0;
    font-size: 8.5pt;
    font-weight: 700;
    color: var(--sk-white);
    background: linear-gradient(135deg, var(--sk-orange), var(--sk-red));
    padding: 4px 10px;
    border-radius: 4px;
    line-height: 1.35;
    white-space: nowrap;
  }

  .rpt-insight-list {
    list-style: none;
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .rpt-insight-item {
    font-size: 9pt;
    line-height: 1.45;
    color: var(--sk-text);
    padding: 0 0 0 12px;
    position: relative;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: keep-all;
  }

  .rpt-insight-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--sk-orange);
  }

  /* ── 상세 분석 고정 Grid ── */
  .slide-report--detail .rpt-headline {
    max-height: calc(1.4em * 1 + 2px);
    -webkit-line-clamp: 1;
  }

  .rpt-body--detail {
    display: grid;
    grid-template-rows: var(--rpt-detail-main-h) var(--rpt-detail-interpret-h) var(--rpt-detail-insight-h);
    gap: var(--rpt-gap);
  }

  .rpt-body--detail:not(:has(.rpt-interpretation)) {
    grid-template-rows: var(--rpt-detail-main-h) var(--rpt-detail-insight-h);
  }

  .rpt-detail-main {
    height: var(--rpt-detail-main-h);
    min-height: var(--rpt-detail-main-h);
    max-height: var(--rpt-detail-main-h);
    overflow: hidden;
  }

  /* split: 차트 38% | 표 62% */
  .rpt-detail-grid--split .rpt-detail-main {
    display: grid;
    grid-template-columns: 38% 62%;
    gap: var(--rpt-gap);
  }

  /* stack: 차트 상단 | 표 하단 */
  .rpt-detail-grid--stack .rpt-detail-main {
    display: grid;
    grid-template-rows: var(--rpt-detail-stack-chart-h) 1fr;
    gap: var(--rpt-gap);
  }

  .rpt-detail-grid--stack:not(:has(.rpt-detail-viz)) .rpt-detail-main {
    grid-template-rows: 1fr;
  }

  /* dual-top: 차트 2열 상단 | 표 하단 */
  .rpt-detail-grid--dual-top .rpt-detail-main {
    display: grid;
    grid-template-rows: 118px 1fr;
    gap: var(--rpt-gap);
  }

  .rpt-detail-grid--dual-top .rpt-detail-viz {
    grid-column: 1 / -1;
  }

  .rpt-detail-grid--dual-top .rpt-detail-table {
    grid-column: 1 / -1;
  }

  .rpt-detail-grid--dual-top .rpt-detail-viz .rpt-chart-zone {
    height: 118px;
    max-height: 118px;
  }

  .rpt-detail-grid--dual-top .rpt-chart-row {
    height: 100%;
  }

  .rpt-detail-viz {
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .rpt-detail-grid--split .rpt-detail-viz .rpt-chart-zone {
    height: 100%;
    max-height: 100%;
  }

  .rpt-detail-grid--stack .rpt-detail-viz .rpt-chart-zone {
    height: var(--rpt-detail-stack-chart-h);
    max-height: var(--rpt-detail-stack-chart-h);
  }

  .rpt-detail-table {
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .rpt-table-wrap {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .rpt-table-title {
    font-size: 8.5pt;
    font-weight: 700;
    color: var(--sk-text-sub);
    margin-bottom: 4px;
    line-height: 1.3;
    flex-shrink: 0;
  }

  .rpt-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 7.5pt;
    line-height: 1.3;
  }

  .rpt-table th {
    background: #f0f2f5;
    color: var(--sk-text-sub);
    font-weight: 700;
    height: var(--rpt-table-head-h);
    padding: 0 4px;
    border: 1px solid #e5e8eb;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rpt-table td {
    height: var(--rpt-table-row-h);
    padding: 0 4px;
    border: 1px solid #e5e8eb;
    text-align: center;
    vertical-align: middle;
    color: var(--sk-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rpt-table tbody tr:nth-child(even) td {
    background: #fafbfc;
  }

  .rpt-table-highlight {
    color: var(--sk-orange) !important;
    font-weight: 700;
  }

  .rpt-interpretation {
    height: var(--rpt-detail-interpret-h);
    min-height: var(--rpt-detail-interpret-h);
    max-height: var(--rpt-detail-interpret-h);
    overflow: hidden;
    background: #fafbfc;
    border-left: 3px solid var(--sk-orange);
    padding: 8px 12px;
    border-radius: 0 4px 4px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .rpt-interpretation-title {
    font-size: 8.5pt;
    font-weight: 700;
    color: var(--sk-text-sub);
    margin-bottom: 4px;
    line-height: 1.3;
    flex-shrink: 0;
  }

  .rpt-interpretation-list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .rpt-interpretation-list li {
    font-size: 8.5pt;
    line-height: 1.4;
    color: var(--sk-text);
    padding: 1px 0 1px 10px;
    position: relative;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: keep-all;
  }

  .rpt-interpretation-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--sk-orange);
    font-weight: 700;
  }

  .rpt-body--detail .rpt-insight-box {
    height: var(--rpt-detail-insight-h);
    min-height: var(--rpt-detail-insight-h);
    max-height: var(--rpt-detail-insight-h);
  }

  /* ── Closing 고정 Grid ── */
  .rpt-closing {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: var(--rpt-gap);
    overflow: hidden;
  }

  .rpt-closing-diagnosis {
    min-height: 0;
    background: var(--sk-bg-warm);
    border: 1px solid var(--sk-border);
    border-radius: 4px;
    padding: 14px 16px;
    overflow: hidden;
  }

  .rpt-closing-diagnosis h4 {
    font-size: 10pt;
    font-weight: 700;
    color: var(--sk-red);
    line-height: 1.35;
    margin-bottom: 8px;
  }

  .rpt-closing-diagnosis ul { list-style: none; overflow: hidden; }

  .rpt-closing-diagnosis li {
    font-size: 10pt;
    line-height: 1.45;
    color: var(--sk-text);
    padding: 4px 0 4px 18px;
    position: relative;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .rpt-closing-diagnosis li::before {
    content: attr(data-n);
    position: absolute;
    left: 0;
    font-weight: 700;
    color: var(--sk-orange);
    font-size: 9pt;
  }

  .rpt-closing-policy {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--rpt-gap);
    height: 124px;
    min-height: 124px;
    max-height: 124px;
    overflow: hidden;
  }

  .rpt-closing-policy-card {
    border: 1px solid var(--sk-border);
    border-radius: 4px;
    padding: 10px 12px;
    background: var(--sk-white);
    border-top: 3px solid var(--sk-orange);
    overflow: hidden;
  }

  .rpt-closing-policy-card h5 {
    font-size: 9pt;
    font-weight: 700;
    color: var(--sk-orange);
    line-height: 1.35;
    margin-bottom: 6px;
  }

  .rpt-closing-policy-card ul { list-style: none; }

  .rpt-closing-policy-card li {
    font-size: 8.5pt;
    line-height: 1.4;
    color: var(--sk-text-sub);
    padding: 2px 0 2px 8px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rpt-closing-policy-card li::before {
    content: '·';
    position: absolute;
    left: 0;
    color: var(--sk-red);
    font-weight: 700;
  }

  @page { size: landscape; margin: 0; }

  /* ── Layout Debug Mode ── */
  .report-debug [data-export-id],
  .report-debug .rpt-header,
  .report-debug .rpt-kpi-card,
  .report-debug .rpt-chart-zone,
  .report-debug .rpt-insight-box {
    outline: 1px dashed rgba(234, 0, 44, 0.55);
    outline-offset: 1px;
  }

  .rpt-debug-label {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 99;
    font-size: 7px;
    line-height: 1.3;
    font-family: monospace;
    color: #fff;
    background: rgba(234, 0, 44, 0.88);
    padding: 2px 4px;
    border-radius: 2px;
    pointer-events: none;
    white-space: nowrap;
    max-width: 96%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function wrapLandscapeReportHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  ${REPORT_FONT_LINKS}
  <style>${LANDSCAPE_SLIDE_STYLES}</style>
</head>
<body><div class="slide-deck">${body}</div></body>
</html>`;
}
