import { REPORT_PAGE } from './constants';

/** PDF 캡처 전 iframe 내에서 실행 — KPI 값 폰트 자동 축소 (clipping 금지) */
export const REPORT_LAYOUT_FIX_SCRIPT = `
(function fitReportLayout() {
  var MIN_KPI = 18;
  var STEP = 1;
  var LH = 1.4;

  function shrinkUntilFits(el, minPt) {
    if (!el || !el.style) return;
    el.style.lineHeight = String(LH);
    el.style.overflow = 'visible';
    var size = parseFloat(el.style.fontSize) || 26;
    var guard = 0;
    while (guard < 16 && size > minPt && el.scrollHeight > el.clientHeight + 1) {
      size -= STEP;
      el.style.fontSize = size + 'pt';
      guard++;
    }
    var wrap = el.closest('.rpt-kpi-value-wrap');
    if (wrap) {
      var boxPx = Math.ceil(size * (96/72) * LH);
      wrap.style.minHeight = boxPx + 'px';
      wrap.style.alignItems = 'center';
      wrap.style.overflow = 'visible';
    }
  }

  document.querySelectorAll('[data-fit="kpi-value"]').forEach(function(el) {
    shrinkUntilFits(el, MIN_KPI);
  });

  document.querySelectorAll('.rpt-kpi-card').forEach(function(card) {
    var label = card.querySelector('.rpt-kpi-label');
    if (label && label.scrollHeight > label.clientHeight + 1) {
      label.style.fontSize = '9pt';
      label.style.lineHeight = '1.4';
    }
  });

  document.querySelectorAll('.rpt-insight-item').forEach(function(li) {
    if (li.scrollHeight > li.clientHeight + 2) {
      li.style.fontSize = '9pt';
      li.style.lineHeight = '1.4';
    }
  });
})();
`;

export interface LayoutValidationIssue {
  slideId: string;
  slideIndex: number;
  message: string;
  severity: 'error' | 'warn';
  elementId?: string;
}

/** Export 직전 검증 (overflow · page boundary · clipping) */
export function validateExportLayout(doc: Document): LayoutValidationIssue[] {
  const issues = validateReportLayout(doc);
  const slides = doc.querySelectorAll('.slide-page');

  slides.forEach((slideEl, index) => {
    const slideId = slideEl.getAttribute('data-slide-id') ?? `slide-${index}`;
    const slide = slideEl as HTMLElement;

    if (slide.offsetWidth > REPORT_PAGE.width + 2 || slide.offsetHeight > REPORT_PAGE.height + 2) {
      issues.push({
        slideId,
        slideIndex: index,
        message: '슬라이드가 페이지 경계를 초과했습니다',
        severity: 'error',
      });
    }

    slideEl.querySelectorAll('[data-export-id]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      const id = htmlEl.getAttribute('data-export-id') ?? '';
      if (htmlEl.scrollHeight > htmlEl.clientHeight + 2) {
        issues.push({
          slideId,
          slideIndex: index,
          message: `텍스트 클리핑: ${id}`,
          severity: 'warn',
          elementId: id,
        });
      }
    });
  });

  return issues.map((i) => ({ ...i, severity: i.severity ?? 'warn' }));
}

/** 브라우저 DOM 기준 오버플로우 검사 */
export function validateReportLayout(doc: Document): LayoutValidationIssue[] {
  const issues: LayoutValidationIssue[] = [];
  const slides = doc.querySelectorAll('.slide-page');

  slides.forEach((slideEl, index) => {
    const slideId = slideEl.getAttribute('data-slide-id') ?? `slide-${index}`;
    const inner = slideEl.querySelector('.rpt-slide-inner') as HTMLElement | null;
    const footer = slideEl.querySelector('.rpt-footer') as HTMLElement | null;

    if (inner && footer) {
      const innerBottom = inner.offsetTop + inner.offsetHeight;
      const footerTop = footer.offsetTop;
      if (innerBottom > footerTop + 2) {
        issues.push({
          slideId,
          slideIndex: index,
          message: '본문이 footer 영역과 겹칩니다',
          severity: 'error',
        });
      }
    }

    slideEl.querySelectorAll('.rpt-kpi-card').forEach((card) => {
      const value = card.querySelector('.rpt-kpi-value');
      if (value && value.scrollHeight > value.clientHeight + 2) {
        issues.push({
          slideId,
          slideIndex: index,
          message: 'KPI 카드 숫자가 영역을 벗어났습니다',
          severity: 'error',
          elementId: card.getAttribute('data-export-id') ?? undefined,
        });
      }
    });

    slideEl.querySelectorAll('.rpt-chart-slot .chart-panel').forEach((panel) => {
      if (panel.scrollHeight > panel.clientHeight + 4) {
        issues.push({
          slideId,
          slideIndex: index,
          message: '차트 패널이 잘렸습니다',
          severity: 'warn',
        });
      }
    });
  });

  return issues;
}

/** Layout Debug — 요소 bbox 표시 */
export function setLayoutDebugMode(doc: Document, enabled: boolean): void {
  doc.documentElement.classList.toggle('report-debug', enabled);
  doc.querySelectorAll('.rpt-debug-label').forEach((n) => n.remove());

  if (!enabled) return;

  const selectors =
    '.rpt-header, .rpt-kpi-card, .rpt-chart-zone, .rpt-insight-box, .rpt-footer, .rpt-closing-diagnosis, .rpt-closing-policy-card';

  doc.querySelectorAll(selectors).forEach((el, idx) => {
    const htmlEl = el as HTMLElement;
    const id = htmlEl.getAttribute('data-export-id') ?? `block-${idx}`;
    const rect = htmlEl.getBoundingClientRect();
    const label = doc.createElement('div');
    label.className = 'rpt-debug-label';
    label.textContent = `${id} · x${Math.round(rect.left)} y${Math.round(rect.top)} · ${Math.round(rect.width)}×${Math.round(rect.height)}`;
    htmlEl.style.position = htmlEl.style.position || 'relative';
    htmlEl.appendChild(label);
  });
}

export async function runLayoutFixInDocument(doc: Document): Promise<void> {
  const script = doc.createElement('script');
  script.textContent = REPORT_LAYOUT_FIX_SCRIPT;
  doc.body.appendChild(script);
  await new Promise((r) => setTimeout(r, 50));
  script.remove();
}
