import { festivalInfo } from '../data/mockData';
import { escapeHtml, wrapLandscapeReportHtml } from './landscapeSlideStyles';
import {
  renderChart,
  renderChartGrid,
  renderCrossChartGrid,
  renderInsightStrip,
} from './reportCharts';
import {
  buildPerformanceReportSlides,
  DATA_SOURCE_NOTE,
  type PerformanceReportSlide,
  type ReportDataTable,
  type ReportSlideImage,
  type ReportTableRow,
} from './performanceReportSlides';

function renderMetricGrid(rows: ReportTableRow[]): string {
  if (rows.length === 0) return '';
  return `
    <div class="metric-grid">
      ${rows
        .map(
          (r) => `
        <div class="metric-item">
          <span class="metric-label">${escapeHtml(r.label)}</span>
          <span class="metric-value">${escapeHtml(r.value)}</span>
        </div>`,
        )
        .join('')}
    </div>`;
}

function cellAlignClass(align?: 'left' | 'center' | 'right'): string {
  if (align === 'left') return 'cell-left';
  if (align === 'right') return 'cell-right';
  return 'cell-center';
}

function renderDataTable(table: ReportDataTable): string {
  const header = table.columns
    .map(
      (c) =>
        `<th class="${cellAlignClass(c.align)}"${c.width ? ` style="width:${c.width}"` : ''}>${escapeHtml(c.label)}</th>`,
    )
    .join('');

  const body = table.rows
    .map(
      (row) =>
        `<tr>${table.columns
          .map(
            (c) =>
              `<td class="${cellAlignClass(c.align)}">${escapeHtml(row[c.key] ?? '')}</td>`,
          )
          .join('')}</tr>`,
    )
    .join('');

  const total = table.totalRow
    ? `<tr class="total-row">${table.columns
        .map(
          (c) =>
            `<td class="${cellAlignClass(c.align)}">${escapeHtml(table.totalRow![c.key] ?? '')}</td>`,
        )
        .join('')}</tr>`
    : '';

  return `
    <div class="table-block">
      <table class="data-table">
        <thead><tr>${header}</tr></thead>
        <tbody>${body}${total}</tbody>
      </table>
    </div>`;
}

function renderTables(slide: PerformanceReportSlide): string {
  if (slide.dataTable) return renderDataTable(slide.dataTable);
  if (slide.tables?.length) {
    return slide.tables
      .map((b) => {
        const inner = b.heading ? `<h4>${escapeHtml(b.heading)}</h4>` : '';
        return `<div class="table-block">${inner}${renderMetricGrid(b.rows)}</div>`;
      })
      .join('');
  }
  if (slide.table?.length) return renderMetricGrid(slide.table);
  return '';
}

function renderSummary(items: string[] | undefined, compact = false): string {
  if (!items?.length) return '';
  return `<ul class="slide-summary${compact ? ' compact' : ''}">${items.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`;
}

function renderSectionLabel(label: string | undefined): string {
  return label ? `<p class="slide-section-label">${escapeHtml(label)}</p>` : '';
}

function renderFooter(index: number): string {
  return `
    <div class="slide-footer">
      <span>${escapeHtml(festivalInfo.organizer)} · ${escapeHtml(festivalInfo.name)}</span>
      <span>${index + 1}</span>
    </div>`;
}

function imageClass(img: ReportSlideImage): string {
  return img.variant ?? 'wide';
}

function renderMarketingImage(img: ReportSlideImage): string {
  const cls = imageClass(img);
  return `
    <div class="mkt-image-card">
      <img class="img-${cls}" src="${escapeHtml(img.src)}" alt="${escapeHtml(img.caption)}" crossorigin="anonymous" />
      <p>${escapeHtml(img.caption)}</p>
    </div>`;
}

function renderCharts(slide: PerformanceReportSlide): string {
  const chartHtml = slide.charts?.length
    ? slide.charts.length <= 2
      ? `<div class="chart-grid">${slide.charts.map((c) => renderChart(c)).join('')}</div>`
      : renderChartGrid(slide.charts)
    : '';
  const crossHtml = slide.crossCharts?.length ? renderCrossChartGrid(slide.crossCharts) : '';
  return chartHtml + crossHtml;
}

function renderSlide(slide: PerformanceReportSlide, index: number): string {
  if (slide.layout === 'cover') {
    return `
      <section class="slide-page slide-cover" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        <div class="cover-deco"></div>
        <p class="cover-brand">SK AIM · 성과 분석 보고서</p>
        <h1 class="slide-title">${escapeHtml(slide.title)}</h1>
        ${renderSummary(slide.summary)}
        ${renderFooter(index)}
      </section>`;
  }

  if (slide.layout === 'divider') {
    return `
      <section class="slide-page slide-divider" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        <p class="divider-numeral">${escapeHtml(slide.sectionLabel ?? '')}</p>
        <h2 class="divider-title">${escapeHtml(slide.title)}</h2>
        ${slide.summary?.[0] ? `<p class="divider-sub">${escapeHtml(slide.summary[0])}</p>` : ''}
        <div class="divider-line"></div>
        ${renderFooter(index)}
      </section>`;
  }

  if (slide.layout === 'marketing-summary') {
    const images = slide.images ?? [];
    return `
      <section class="slide-page" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        ${renderSectionLabel(slide.sectionLabel)}
        <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
        <div class="slide-content marketing-summary-layout">
          ${renderSummary(slide.summary, true)}
          ${renderTables(slide)}
          <div class="mkt-gallery">
            ${images.map((img) => renderMarketingImage(img)).join('')}
          </div>
        </div>
        ${renderFooter(index)}
      </section>`;
  }

  if (slide.layout === 'marketing') {
    const images = slide.images ?? [];
    return `
      <section class="slide-page" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        ${renderSectionLabel(slide.sectionLabel)}
        <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
        <div class="slide-content marketing-channel-layout">
          <div class="marketing-channel-main">
            ${renderSummary(slide.summary, true)}
            ${renderTables(slide)}
          </div>
          <div class="marketing-images">
            ${images.map((img) => renderMarketingImage(img)).join('')}
          </div>
        </div>
        ${renderFooter(index)}
      </section>`;
  }

  if (slide.layout === 'section') {
    return `
      <section class="slide-page" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        ${renderSectionLabel(slide.sectionLabel)}
        <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
        <div class="slide-content section-body">
          <div class="section-body-row">
            <div>${renderSummary(slide.summary, true)}</div>
            <div>${renderTables(slide)}</div>
          </div>
        </div>
        ${renderFooter(index)}
      </section>`;
  }

  return `
    <section class="slide-page" data-slide-id="${escapeHtml(slide.id)}">
      <div class="slide-accent"></div>
      ${renderSectionLabel(slide.sectionLabel)}
      <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
      <div class="slide-content">
        ${renderInsightStrip(slide.insights ?? [], slide.recommendations)}
        ${renderCharts(slide)}
        ${slide.table?.length ? `<div class="detail-metrics">${renderMetricGrid(slide.table)}</div>` : ''}
      </div>
      ${renderFooter(index)}
    </section>`;
}

export function buildPerformanceReportDocument(): string {
  const slides = buildPerformanceReportSlides();
  const body = slides.map((s, i) => renderSlide(s, i)).join('');
  return wrapLandscapeReportHtml(`${festivalInfo.name} 성과 분석 보고서`, body);
}

export { buildPerformanceReportSlides, DATA_SOURCE_NOTE };
export type { PerformanceReportSlide };

export const PERFORMANCE_REPORT_FILENAME_BASE = '해오름_야간문화축제_성과분석보고서';

export function performanceReportFilename(ext: string): string {
  return `${PERFORMANCE_REPORT_FILENAME_BASE}.${ext}`;
}

export const performanceReportPreview = {
  kpis: [
    { label: '홍보 클릭율', value: '15.0%' },
    { label: '방문객 수', value: '23,060명' },
    { label: '만족도', value: '4.4/5.0' },
    { label: '재방문 의향', value: '91%' },
  ],
  summaryLines: [
    '해오름 야간문화축제 · 마케팅·데이터·만족도 통합 보고',
    '요약 1장 + 세부 분석·그래프 구성',
    'PDF · PPT 가로 PT 형식',
  ],
  dataSource: DATA_SOURCE_NOTE,
};
