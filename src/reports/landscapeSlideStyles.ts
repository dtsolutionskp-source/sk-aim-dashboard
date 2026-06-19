/** 가로 PT 슬라이드 (16:9 · 1123×632px) — PDF 캡처 안정성을 위해 시스템 폰트 사용 */
export const LANDSCAPE_SLIDE_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    background: #eef0f3;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    -webkit-font-smoothing: antialiased;
  }

  .slide-deck { display: flex; flex-direction: column; gap: 12px; padding: 12px; }

  .slide-page {
    width: 1123px;
    height: 632px;
    background: #fff;
    padding: 36px 48px 32px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
    display: flex;
    flex-direction: column;
  }

  .slide-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, #f47725, #ea002c);
  }

  .slide-section-label {
    font-size: 10pt;
    font-weight: 600;
    color: #f47725;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }

  .slide-title {
    font-size: 24pt;
    font-weight: 700;
    color: #191f28;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 2px solid #191f28;
    white-space: pre-line;
  }

  /* ── 표지 ── */
  .slide-cover {
    background: linear-gradient(145deg, #ffffff 55%, #fff4ec 100%);
    justify-content: center;
  }

  .slide-cover .slide-accent { height: 8px; }

  .slide-cover .slide-title {
    font-size: 34pt;
    border-bottom: none;
    margin-top: 0;
    padding-bottom: 0;
    line-height: 1.25;
  }

  .cover-brand {
    font-size: 11pt;
    font-weight: 600;
    color: #f47725;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .cover-deco {
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(244,119,37,0.14) 0%, rgba(234,0,44,0.04) 55%, transparent 70%);
    pointer-events: none;
  }

  .cover-deco::after {
    content: '';
    position: absolute;
    inset: 30px;
    border: 2px solid rgba(244,119,37,0.2);
    border-radius: 50%;
  }

  .slide-cover .slide-summary { max-width: 620px; margin-top: 28px; }
  .slide-cover .slide-summary li { font-size: 12pt; color: #333d4b; }

  /* ── 간지 ── */
  .slide-divider {
    background: linear-gradient(135deg, #191f28 0%, #2d3744 55%, #3d4654 100%);
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 48px;
  }

  .slide-divider .slide-accent {
    height: 6px;
    background: linear-gradient(90deg, #f47725, #ffc078, #ea002c);
  }

  .divider-numeral {
    font-size: 72pt;
    font-weight: 700;
    color: rgba(244,119,37,0.35);
    line-height: 1;
    margin-bottom: 16px;
  }

  .divider-title {
    font-size: 32pt;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }

  .divider-sub {
    font-size: 13pt;
    color: rgba(255,255,255,0.72);
    line-height: 1.5;
    max-width: 560px;
    margin: 0 auto;
  }

  .divider-line {
    width: 64px;
    height: 3px;
    background: #f47725;
    margin: 20px auto 0;
    border-radius: 2px;
  }

  .slide-content { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }

  .slide-summary {
    list-style: none;
    margin-bottom: 12px;
  }

  .slide-summary li {
    position: relative;
    padding-left: 14px;
    margin-bottom: 6px;
    font-size: 11pt;
    line-height: 1.5;
    color: #4e5968;
  }

  .slide-summary li::before {
    content: '';
    position: absolute;
    left: 0; top: 8px;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #f47725;
  }

  .slide-summary.compact li { font-size: 10.5pt; margin-bottom: 4px; }

  /* ── 인사이트 한 줄 ── */
  .insight-strip {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: linear-gradient(90deg, #fff5ef 0%, #f7f8fa 100%);
    border-left: 4px solid #f47725;
    padding: 10px 14px;
    margin-bottom: 12px;
    border-radius: 0 6px 6px 0;
  }

  .insight-strip-badge {
    flex-shrink: 0;
    font-size: 9pt;
    font-weight: 700;
    color: #fff;
    background: #f47725;
    padding: 4px 10px;
    border-radius: 4px;
    white-space: nowrap;
    margin-top: 1px;
  }

  .insight-strip-text {
    font-size: 10pt;
    line-height: 1.55;
    color: #333d4b;
    flex: 1;
  }

  .insight-sep {
    display: inline-block;
    margin: 0 8px;
    color: #c9cdd2;
    font-weight: 700;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    table-layout: fixed;
  }

  /* KPI 요약 — div 그리드 (PDF 캡처 안정) */
  .metric-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: #f7f8fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    min-height: 36px;
  }

  .metric-label {
    font-size: 9.5pt;
    color: #495057;
    line-height: 1.35;
    flex: 1;
    min-width: 0;
  }

  .metric-value {
    font-size: 10pt;
    font-weight: 700;
    color: #f47725;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* SK플래닛 결과리포트형 데이터 표 */
  .data-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 9pt;
    line-height: 1.35;
  }

  .data-table th,
  .data-table td {
    border: 1px solid #ced4da;
    padding: 7px 6px;
    vertical-align: middle;
    overflow: visible;
    word-break: keep-all;
    white-space: nowrap;
  }

  .data-table th {
    background: #e9ecef;
    font-weight: 700;
    color: #343a40;
    font-size: 8.5pt;
  }

  .data-table .cell-left { text-align: left; padding-left: 10px; }
  .data-table .cell-center { text-align: center; }
  .data-table .cell-right { text-align: right; padding-right: 10px; }

  .data-table tr.total-row td {
    background: #fff3e8;
    font-weight: 700;
    color: #191f28;
    border-top: 2px solid #f47725;
  }

  .detail-metrics {
    margin-top: 8px;
    max-width: 480px;
  }

  .detail-metrics .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  th, td {
    border: 1px solid #e2e5ea;
    padding: 7px 12px;
    text-align: left;
    word-break: keep-all;
    line-height: 1.4;
  }

  th {
    background: #f7f8fa;
    font-weight: 600;
    color: #4e5968;
    font-size: 9.5pt;
    white-space: nowrap;
  }

  td.value {
    text-align: right;
    font-weight: 600;
    color: #f47725;
    white-space: nowrap;
  }

  .table-block { margin-bottom: 8px; flex-shrink: 0; }

  .table-block h4 {
    font-size: 10pt;
    font-weight: 700;
    color: #333d4b;
    margin-bottom: 6px;
  }

  .kpi-table th:first-child { width: 55%; }
  .kpi-table td:first-child { max-width: 280px; }

  .section-body-row {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    align-items: start;
  }

  .chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    flex: 1;
    min-height: 0;
  }

  .chart-grid-cross { grid-template-columns: 1fr; }

  .chart-panel {
    border: 1px solid #e2e5ea;
    border-radius: 6px;
    padding: 8px 10px;
    background: #fff;
    min-height: 0;
    overflow: hidden;
  }

  .chart-panel-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #333d4b;
    margin-bottom: 6px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eef0f3;
  }

  .hbar-row {
    display: grid;
    grid-template-columns: minmax(64px, 88px) 1fr 48px;
    gap: 6px;
    align-items: center;
    margin-bottom: 4px;
  }

  .hbar-label {
    font-size: 8.5pt;
    color: #4e5968;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hbar-track { height: 13px; background: #eef0f3; border-radius: 3px; overflow: hidden; }
  .hbar-fill { height: 100%; border-radius: 3px; min-width: 2px; }
  .hbar-value { font-size: 8.5pt; font-weight: 600; color: #f47725; text-align: right; }

  .vbar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 130px;
    padding-top: 4px;
  }

  .vbar-item { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 52px; }
  .vbar-col { width: 26px; height: 84px; background: #eef0f3; border-radius: 3px 3px 0 0; display: flex; align-items: flex-end; overflow: hidden; }
  .vbar-fill { width: 100%; border-radius: 3px 3px 0 0; min-height: 2px; }
  .vbar-label { font-size: 7.5pt; color: #6b7684; margin-top: 3px; text-align: center; line-height: 1.15; }
  .vbar-value { font-size: 7.5pt; font-weight: 600; color: #f47725; margin-bottom: 3px; }

  .donut-layout { display: flex; align-items: center; gap: 10px; }
  .donut-svg { width: 100px; height: 100px; flex-shrink: 0; }
  .donut-legend { flex: 1; min-width: 0; }
  .donut-legend-item { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; font-size: 8pt; }
  .donut-swatch { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .donut-legend-label { flex: 1; color: #4e5968; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .donut-legend-value { font-weight: 600; color: #f47725; white-space: nowrap; }

  .line-svg { width: 100%; height: auto; display: block; }
  .line-label { font-size: 7px; fill: #6b7684; font-family: 'Malgun Gothic', sans-serif; }
  .line-value { font-size: 7px; fill: #f47725; font-weight: 600; font-family: 'Malgun Gothic', sans-serif; }

  .cross-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
  .cross-legend-item { font-size: 8pt; color: #4e5968; display: flex; align-items: center; gap: 4px; }
  .cross-legend-item i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }

  .gbar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 120px;
    gap: 4px;
  }

  .gbar-group { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 0; }
  .gbar-stack { display: flex; align-items: flex-end; gap: 2px; height: 90px; }
  .gbar { width: 10px; border-radius: 2px 2px 0 0; min-height: 2px; }
  .gbar-label { font-size: 7pt; color: #6b7684; margin-top: 3px; text-align: center; line-height: 1.1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }

  /* ── 마케팅 상세 (SK플래닛 결과리포트형) ── */
  .marketing-channel-layout {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  .marketing-channel-main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
  }

  .marketing-layout {
    display: grid;
    grid-template-columns: minmax(280px, 340px) 1fr;
    gap: 20px;
    flex: 1;
    min-height: 0;
  }

  .marketing-images {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-content: flex-start;
    justify-content: center;
  }

  .mkt-image-card {
    border: 1px solid #e2e5ea;
    border-radius: 8px;
    overflow: hidden;
    background: #f7f8fa;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    flex: 0 1 auto;
  }

  .mkt-image-card img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    object-fit: contain;
    object-position: center;
    image-rendering: auto;
  }

  .mkt-image-card img.img-notification {
    max-height: 340px;
    max-width: 168px;
  }

  .mkt-image-card img.img-wide {
    max-height: 220px;
    max-width: 280px;
  }

  .mkt-image-card img.img-flyer {
    max-height: 260px;
    max-width: 180px;
  }

  .mkt-image-card p {
    margin-top: 6px;
    font-size: 8.5pt;
    color: #6b7684;
    text-align: center;
    line-height: 1.3;
  }

  /* ── 마케팅 요약 ── */
  .marketing-summary-layout {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    min-height: 0;
  }

  .mkt-gallery {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    justify-content: center;
    align-items: flex-end;
    padding: 8px 10px;
    background: #f7f8fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }

  .mkt-gallery .mkt-image-card {
    padding: 6px;
    background: #fff;
    flex-shrink: 0;
  }

  .mkt-gallery .mkt-image-card img.img-notification { max-height: 200px; max-width: 96px; }
  .mkt-gallery .mkt-image-card img.img-wide { max-height: 160px; max-width: 140px; }
  .mkt-gallery .mkt-image-card img.img-flyer { max-height: 180px; max-width: 110px; }
  .mkt-gallery .mkt-image-card p { font-size: 7.5pt; margin-top: 4px; }

  .slide-footer {
    position: absolute;
    bottom: 18px;
    left: 48px;
    right: 48px;
    font-size: 8.5pt;
    color: #9aa3ad;
    display: flex;
    justify-content: space-between;
  }

  .slide-divider .slide-footer { color: rgba(255,255,255,0.45); }

  .section-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    min-height: 0;
  }

  @page { size: landscape; margin: 0; }
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
  <style>${LANDSCAPE_SLIDE_STYLES}</style>
</head>
<body><div class="slide-deck">${body}</div></body>
</html>`;
}
