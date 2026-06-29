import { escapeHtml } from '../landscapeSlideStyles';
import type { ReportKpiCard } from '../performanceReportSlides';
import type { CrossChartSpec, ReportChartSpec } from '../reportCharts';
import type { ReportTableSpec } from '../reportTableTypes';
import { renderChart, renderGroupedBarChart } from '../reportCharts';
import { kpiValueFontSize, splitKpiValue } from '../layout/textFit';

export function reportSectionHeader(opts: {
  sectionLabel?: string;
  topic: string;
  headline?: string;
}): string {
  return `
    <header class="rpt-header" data-export-id="section-header">
      ${opts.sectionLabel ? `<p class="rpt-section-label">${escapeHtml(opts.sectionLabel)}</p>` : ''}
      <p class="rpt-page-topic">${escapeHtml(opts.topic)}</p>
      ${opts.headline ? `<h2 class="rpt-headline">${escapeHtml(opts.headline)}</h2>` : ''}
    </header>`;
}

export function reportKpiCard(card: ReportKpiCard): string {
  const { main, unit } = splitKpiValue(card.value);
  const valueSize = kpiValueFontSize(card.value);
  const highlight = card.highlight ? ' rpt-kpi-card--highlight' : '';

  return `
    <div class="rpt-kpi-card${highlight}" data-export-id="kpi-${escapeHtml(card.label)}">
      <span class="rpt-kpi-label">${escapeHtml(card.label)}</span>
      <span class="rpt-kpi-value-wrap">
        <span class="rpt-kpi-value" style="font-size:${valueSize}pt" data-fit="kpi-value">${escapeHtml(main)}</span>
        ${unit ? `<span class="rpt-kpi-unit">${escapeHtml(unit)}</span>` : ''}
      </span>
    </div>`;
}

export function reportKpiRow(cards: ReportKpiCard[]): string {
  if (!cards.length) return '';
  const cols = cards.length <= 3 ? 3 : 4;
  return `
    <div class="rpt-kpi-row rpt-kpi-row--${cols}" data-block="kpi">
      ${cards.map((c) => reportKpiCard(c)).join('')}
    </div>`;
}

export function reportInsightBox(insights: string[]): string {
  if (!insights.length) return '';
  return `
    <div class="rpt-insight-box" data-block="insight" data-export-id="insight-box">
      <span class="rpt-insight-badge">AI 인사이트</span>
      <ul class="rpt-insight-list">
        ${insights.slice(0, 4).map((l) => `<li class="rpt-insight-item">${escapeHtml(l)}</li>`).join('')}
      </ul>
    </div>`;
}

export function reportChartBlock(
  charts?: ReportChartSpec[],
  crossCharts?: CrossChartSpec[],
): string {
  const parts: string[] = [];

  if (charts?.length) {
    const slice = charts.slice(0, 2);
    if (slice.length === 1) {
      parts.push(`<div class="rpt-chart-slot" data-block="chart">${renderChart(slice[0])}</div>`);
    } else {
      parts.push(
        `<div class="rpt-chart-row" data-block="chart">${slice.map((c) => `<div class="rpt-chart-slot">${renderChart(c)}</div>`).join('')}</div>`,
      );
    }
  }

  if (crossCharts?.length) {
    parts.push(
      `<div class="rpt-chart-slot" data-block="chart">${renderGroupedBarChart(crossCharts[0])}</div>`,
    );
  }

  if (!parts.length) return '';
  return `<div class="rpt-chart-zone" data-export-id="chart-zone">${parts.join('')}</div>`;
}

export function reportFooter(left: string, pageNum: number): string {
  return `
    <footer class="rpt-footer" data-export-id="footer">
      <span class="rpt-footer-left">${escapeHtml(left)}</span>
      <span class="rpt-footer-page">${pageNum}</span>
    </footer>`;
}

export function reportSlideInner(body: string): string {
  return `<div class="rpt-slide-inner">${body}</div>`;
}

export function reportBodyZones(opts: {
  kpis?: ReportKpiCard[];
  charts?: ReportChartSpec[];
  crossCharts?: CrossChartSpec[];
  insights?: string[];
}): string {
  const kpi = opts.kpis?.length ? reportKpiRow(opts.kpis) : '';
  const chart = reportChartBlock(opts.charts, opts.crossCharts);
  const insight = opts.insights?.length ? reportInsightBox(opts.insights) : '';

  return `
    <div class="rpt-body rpt-body--summary">
      <div class="rpt-body-main">
        ${kpi}
        ${chart}
      </div>
      ${insight}
    </div>`;
}

import { REPORT_GRID, resolveDetailGridVariant } from '../layout/gridLayout';

export function reportTable(table: ReportTableSpec, maxRows = REPORT_GRID.detail.tableMaxRows): string {
  const rows = table.rows.slice(0, maxRows);
  return `
    <div class="rpt-table-wrap" data-block="table" data-export-id="table-${escapeHtml(table.id)}">
      ${table.title ? `<p class="rpt-table-title">${escapeHtml(table.title)}</p>` : ''}
      <table class="rpt-table">
        <thead>
          <tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>${row.cells
              .map(
                (cell, ci) =>
                  `<td${row.highlightCol === ci ? ' class="rpt-table-highlight"' : ''}>${escapeHtml(cell)}</td>`,
              )
              .join('')}</tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>`;
}

export function reportInterpretation(lines: string[]): string {
  if (!lines.length) return '';
  return `
    <div class="rpt-interpretation" data-block="interpretation" data-export-id="interpretation">
      <h4 class="rpt-interpretation-title">분석 해석</h4>
      <ul class="rpt-interpretation-list">
        ${lines.slice(0, 3).map((l) => `<li>${escapeHtml(l)}</li>`).join('')}
      </ul>
    </div>`;
}

/** 상세 분석 페이지 — 고정 Grid (split / stack / dual-top) */
export function reportDetailBody(opts: {
  charts?: ReportChartSpec[];
  crossCharts?: CrossChartSpec[];
  tables?: ReportTableSpec[];
  interpretation?: string[];
  insights?: string[];
}): string {
  const variant = resolveDetailGridVariant(opts);
  const chartHtml = reportChartBlock(opts.charts, opts.crossCharts);
  const tablesHtml = (opts.tables ?? []).slice(0, 1).map((t) => reportTable(t)).join('');

  return `
    <div class="rpt-body rpt-body--detail rpt-detail-grid--${variant}">
      <div class="rpt-detail-main">
        ${chartHtml ? `<div class="rpt-detail-viz">${chartHtml}</div>` : ''}
        ${tablesHtml ? `<div class="rpt-detail-table">${tablesHtml}</div>` : ''}
      </div>
      ${opts.interpretation?.length ? reportInterpretation(opts.interpretation) : ''}
      ${opts.insights?.length ? reportInsightBox(opts.insights) : ''}
    </div>`;
}
