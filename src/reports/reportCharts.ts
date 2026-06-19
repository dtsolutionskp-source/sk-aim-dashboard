import { escapeHtml } from './landscapeSlideStyles';

export interface ChartItem {
  label: string;
  value: number;
  color?: string;
  unit?: string;
}

export interface CrossChartSeries {
  label: string;
  color: string;
  values: number[];
}

export interface CrossChartSpec {
  id: string;
  title: string;
  categories: string[];
  series: CrossChartSeries[];
  type?: 'stacked' | 'grouped';
}

export interface ReportChartSpec {
  id: string;
  title: string;
  items: ChartItem[];
  maxValue?: number;
  unit?: string;
  type?: 'horizontal' | 'vertical' | 'donut' | 'line';
}

const DEFAULT_COLORS = ['#f47725', '#ff8c42', '#ffc078', '#ea002c', '#adb5bd', '#868e96', '#4e5968'];

function pickColor(item: ChartItem, idx: number): string {
  return item.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
}

export function renderHorizontalBarChart(chart: ReportChartSpec): string {
  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';

  const rows = chart.items
    .map((item, idx) => {
      const pct = Math.min(100, (item.value / max) * 100);
      const color = pickColor(item, idx);
      const display = item.unit ?? `${item.value}${unit}`;
      return `
        <div class="hbar-row">
          <span class="hbar-label" title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>
          <div class="hbar-track"><div class="hbar-fill" style="width:${pct}%;background:${color}"></div></div>
          <span class="hbar-value">${escapeHtml(display)}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div class="chart-panel">
      <p class="chart-panel-title">${escapeHtml(chart.title)}</p>
      <div class="hbar-chart">${rows}</div>
    </div>
  `;
}

export function renderVerticalBarChart(chart: ReportChartSpec): string {
  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';

  const bars = chart.items
    .map((item, idx) => {
      const pct = Math.min(100, (item.value / max) * 100);
      const color = pickColor(item, idx);
      return `
        <div class="vbar-item">
          <span class="vbar-value">${escapeHtml(item.unit ?? `${item.value}${unit}`)}</span>
          <div class="vbar-col"><div class="vbar-fill" style="height:${pct}%;background:${color}"></div></div>
          <span class="vbar-label">${escapeHtml(item.label)}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div class="chart-panel">
      <p class="chart-panel-title">${escapeHtml(chart.title)}</p>
      <div class="vbar-chart">${bars}</div>
    </div>
  `;
}

export function renderDonutChart(chart: ReportChartSpec): string {
  const total = chart.items.reduce((s, i) => s + i.value, 0) || 1;
  const unit = chart.unit ?? '%';
  let offset = 0;
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  const segments = chart.items
    .map((item, idx) => {
      const pct = item.value / total;
      const dash = pct * circumference;
      const color = pickColor(item, idx);
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="18"
        stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})" />`;
      offset += dash;
      return seg;
    })
    .join('');

  const legend = chart.items
    .map((item, idx) => {
      const color = pickColor(item, idx);
      const display = item.unit ?? `${item.value}${unit}`;
      return `
        <div class="donut-legend-item">
          <span class="donut-swatch" style="background:${color}"></span>
          <span class="donut-legend-label">${escapeHtml(item.label)}</span>
          <span class="donut-legend-value">${escapeHtml(display)}</span>
        </div>`;
    })
    .join('');

  return `
    <div class="chart-panel chart-panel-donut">
      <p class="chart-panel-title">${escapeHtml(chart.title)}</p>
      <div class="donut-layout">
        <svg class="donut-svg" viewBox="0 0 140 140" aria-hidden="true">${segments}</svg>
        <div class="donut-legend">${legend}</div>
      </div>
    </div>
  `;
}

export function renderLineChart(chart: ReportChartSpec): string {
  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';
  const w = 240;
  const h = 100;
  const pad = 8;
  const step = chart.items.length > 1 ? (w - pad * 2) / (chart.items.length - 1) : 0;

  const points = chart.items.map((item, idx) => {
    const x = pad + idx * step;
    const y = h - pad - ((item.value / max) * (h - pad * 2));
    return { x, y, item };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const dots = points
    .map(
      (p, idx) =>
        `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${pickColor(p.item, idx)}" />`,
    )
    .join('');
  const labels = points
    .map(
      (p) =>
        `<text x="${p.x}" y="${h + 2}" text-anchor="middle" class="line-label">${escapeHtml(p.item.label)}</text>`,
    )
    .join('');
  const values = points
    .map(
      (p) =>
        `<text x="${p.x}" y="${p.y - 6}" text-anchor="middle" class="line-value">${escapeHtml(p.item.unit ?? `${p.item.value}${unit}`)}</text>`,
    )
    .join('');

  return `
    <div class="chart-panel">
      <p class="chart-panel-title">${escapeHtml(chart.title)}</p>
      <svg class="line-svg" viewBox="0 0 ${w} ${h + 18}" aria-hidden="true">
        <polyline points="${polyline}" fill="none" stroke="#f47725" stroke-width="2" />
        ${dots}
        ${values}
        ${labels}
      </svg>
    </div>
  `;
}

export function renderGroupedBarChart(cross: CrossChartSpec): string {
  const max = Math.max(...cross.series.flatMap((s) => s.values), 1);

  const groups = cross.categories
    .map((cat, gi) => {
      const bars = cross.series
        .map((s) => {
          const pct = Math.min(100, (s.values[gi] / max) * 100);
          return `<div class="gbar" style="height:${pct}%;background:${s.color}" title="${escapeHtml(s.label)} ${s.values[gi]}"></div>`;
        })
        .join('');
      return `
        <div class="gbar-group">
          <div class="gbar-stack">${bars}</div>
          <span class="gbar-label">${escapeHtml(cat)}</span>
        </div>`;
    })
    .join('');

  const legend = cross.series
    .map(
      (s) =>
        `<span class="cross-legend-item"><i style="background:${s.color}"></i>${escapeHtml(s.label)}</span>`,
    )
    .join('');

  return `
    <div class="chart-panel chart-panel-cross">
      <p class="chart-panel-title">${escapeHtml(cross.title)}</p>
      <div class="cross-legend">${legend}</div>
      <div class="gbar-chart">${groups}</div>
    </div>
  `;
}

export function renderChart(chart: ReportChartSpec): string {
  switch (chart.type) {
    case 'vertical':
      return renderVerticalBarChart(chart);
    case 'donut':
      return renderDonutChart(chart);
    case 'line':
      return renderLineChart(chart);
    default:
      return renderHorizontalBarChart(chart);
  }
}

export function renderChartGrid(charts: ReportChartSpec[]): string {
  return `<div class="chart-grid">${charts.map((c) => renderChart(c)).join('')}</div>`;
}

export function renderCrossChartGrid(charts: CrossChartSpec[]): string {
  if (!charts.length) return '';
  return `<div class="chart-grid chart-grid-cross">${charts.map((c) => renderGroupedBarChart(c)).join('')}</div>`;
}

/** 분석 요약 + 제언을 한 줄 스트립으로 표시 */
export function renderInsightStrip(insights: string[], recommendations?: string[]): string {
  const merged = [...insights, ...(recommendations ?? [])].filter(Boolean);
  if (merged.length === 0) return '';
  return `
    <div class="insight-strip">
      <span class="insight-strip-badge">분석·제언</span>
      <p class="insight-strip-text">${merged.map((l) => escapeHtml(l)).join('<span class="insight-sep">·</span>')}</p>
    </div>
  `;
}
