import { REPORT_FONT_STACK } from '../layout/constants';

/** 보고서 HTML head에 삽입 — Preview/Export 동일 폰트 */
export const REPORT_FONT_LINKS = `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
`;

/** html2canvas 캡처 시 descender clipping 방지 — line-height ≥ 1.4, overflow 제거 */
export const REPORT_TYPOGRAPHY_STYLES = `
  .slide-page,
  .slide-page * {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .rpt-kpi-card {
    overflow: visible;
  }

  .rpt-kpi-label {
    line-height: 1.4;
    overflow: visible;
    white-space: nowrap;
    text-overflow: clip;
  }

  .rpt-kpi-value-wrap {
    display: flex;
    align-items: center;
    line-height: 1.4;
    overflow: visible;
    min-height: 0;
  }

  .rpt-kpi-value {
    line-height: 1.4;
    overflow: visible;
    text-overflow: clip;
    display: block;
    flex-shrink: 0;
    min-width: 0;
  }

  .rpt-kpi-unit {
    line-height: 1.4;
    overflow: visible;
  }

  .rpt-headline,
  .rpt-topic,
  .rpt-section-label,
  .rpt-insight-item,
  .cover-title,
  .divider-title {
    line-height: 1.4;
    overflow: visible;
  }

  .rpt-insight-box,
  .rpt-insight-list {
    overflow: visible;
  }

  .rpt-insight-item {
    min-height: calc(1em * 1.4);
  }
`;

const KPI_LINE_HEIGHT = 1.4;
const PT_TO_PX = 96 / 72;

/** KPI 숫자 — fontSize × 1.4 기준 vertical box (padding-bottom 대신 메트릭) */
export function applyKpiTypographyMetrics(doc: Document): void {
  doc.querySelectorAll('.rpt-kpi-value').forEach((el) => {
    const valueEl = el as HTMLElement;
    const pt = parseFloat(valueEl.style.fontSize) || parseFloat(getComputedStyle(valueEl).fontSize) || 26;
    const boxPx = Math.ceil(pt * PT_TO_PX * KPI_LINE_HEIGHT);

    valueEl.style.lineHeight = String(KPI_LINE_HEIGHT);
    valueEl.style.overflow = 'visible';
    valueEl.style.display = 'block';

    const wrap = valueEl.closest('.rpt-kpi-value-wrap') as HTMLElement | null;
    if (wrap) {
      wrap.style.display = 'flex';
      wrap.style.alignItems = 'center';
      wrap.style.lineHeight = String(KPI_LINE_HEIGHT);
      wrap.style.overflow = 'visible';
      wrap.style.minHeight = `${boxPx}px`;
    }

    const card = valueEl.closest('.rpt-kpi-card') as HTMLElement | null;
    if (card) {
      card.style.overflow = 'visible';
    }
  });
}

/** Export 캡처 직전 — clipping 유발 overflow/line-height 정리 */
export function applyExportTypography(doc: Document): void {
  injectTypographyStyles(doc);
  applyKpiTypographyMetrics(doc);

  doc.querySelectorAll('.rpt-headline, .rpt-insight-item, .cover-title').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.overflow = 'visible';
    if (parseFloat(htmlEl.style.lineHeight || '0') < 1.35) {
      htmlEl.style.lineHeight = '1.4';
    }
  });
}

export function injectTypographyStyles(doc: Document): void {
  if (doc.getElementById('rpt-typography-styles')) return;
  const style = doc.createElement('style');
  style.id = 'rpt-typography-styles';
  style.textContent = `
    body { font-family: ${REPORT_FONT_STACK}; }
    ${REPORT_TYPOGRAPHY_STYLES}
  `;
  doc.head.appendChild(style);
}

export function injectReportFontLinks(doc: Document): void {
  if (doc.querySelector('link[data-rpt-font="noto"]')) return;

  const container = doc.createElement('div');
  container.innerHTML = REPORT_FONT_LINKS;
  container.querySelectorAll('link').forEach((link) => {
    link.setAttribute('data-rpt-font', 'noto');
    doc.head.appendChild(link.cloneNode(true));
  });
}

/** Preview/Export iframe — 웹폰트 로드 완료 대기 */
export async function ensureReportFontsLoaded(doc: Document): Promise<void> {
  injectReportFontLinks(doc);
  injectTypographyStyles(doc);

  if (!doc.fonts) {
    await new Promise((r) => setTimeout(r, 300));
    return;
  }

  const loads = [
    doc.fonts.load('400 11pt "Noto Sans KR"'),
    doc.fonts.load('600 10pt "Noto Sans KR"'),
    doc.fonts.load('700 18pt "Noto Sans KR"'),
    doc.fonts.load('700 28pt "Noto Sans KR"'),
    doc.fonts.load('700 28pt "Pretendard"'),
    doc.fonts.load('600 10pt "Pretendard"'),
  ];

  await Promise.allSettled(loads);
  await doc.fonts.ready;
  await new Promise((r) => setTimeout(r, 120));
}
