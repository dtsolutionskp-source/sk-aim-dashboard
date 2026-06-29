import type { CrossChartSpec, ReportChartSpec } from '../reportCharts';
import { SK } from './exportTheme';

const DEFAULT_COLORS = ['#f47725', '#ea002c', '#ff8c42', '#ffc078'];

function pickColor(item: { color?: string }, idx: number): string {
  return (item.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]).replace('#', '').toUpperCase();
}

type PptSlide = ReturnType<import('pptxgenjs').default['addSlide']>;

export function addHorizontalBarChartPpt(
  slide: PptSlide,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
  fontFace: string,
): number {
  slide.addShape('rect', {
    x,
    y,
    w,
    h,
    fill: { color: SK.white },
    line: { color: SK.border, width: 1 },
  });
  slide.addText(chart.title, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.22,
    fontSize: 9.5,
    bold: true,
    color: SK.text,
    fontFace,
    valign: 'top',
  });

  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';
  const rowH = Math.min(0.28, (h - 0.45) / Math.max(chart.items.length, 1));
  let rowY = y + 0.38;

  chart.items.forEach((item, idx) => {
    const pct = Math.min(100, (item.value / max) * 100);
    const color = pickColor(item, idx);
    const display = item.unit ?? `${item.value}${unit}`;

    slide.addText(item.label, {
      x: x + 0.12,
      y: rowY,
      w: 1.35,
      h: rowH,
      fontSize: 9,
      color: SK.textSub,
      fontFace,
      valign: 'middle',
    });

    const trackX = x + 1.55;
    const trackW = w - 2.55;
    slide.addShape('rect', {
      x: trackX,
      y: rowY + rowH * 0.35,
      w: trackW,
      h: rowH * 0.35,
      fill: { color: SK.bgWarm },
      line: { color: SK.bgWarm, width: 0 },
    });
    slide.addShape('rect', {
      x: trackX,
      y: rowY + rowH * 0.35,
      w: trackW * (pct / 100),
      h: rowH * 0.35,
      fill: { color },
      line: { color, width: 0 },
    });

    slide.addText(display, {
      x: x + w - 0.95,
      y: rowY,
      w: 0.85,
      h: rowH,
      fontSize: 9,
      bold: true,
      color: SK.orange,
      fontFace,
      align: 'right',
      valign: 'middle',
    });

    rowY += rowH + 0.04;
  });

  return h;
}

export function addVerticalBarChartPpt(
  slide: PptSlide,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
  fontFace: string,
): number {
  slide.addShape('rect', { x, y, w, h, fill: { color: SK.white }, line: { color: SK.border, width: 1 } });
  slide.addText(chart.title, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.22,
    fontSize: 9.5,
    bold: true,
    color: SK.text,
    fontFace,
  });

  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';
  const n = chart.items.length;
  const barAreaY = y + 0.42;
  const barAreaH = h - 0.75;
  const colW = (w - 0.3) / n;

  chart.items.forEach((item, idx) => {
    const pct = Math.min(100, (item.value / max) * 100);
    const color = pickColor(item, idx);
    const cx = x + 0.15 + idx * colW;
    const barH = barAreaH * (pct / 100);

    slide.addText(item.unit ?? `${item.value}${unit}`, {
      x: cx,
      y: barAreaY,
      w: colW - 0.05,
      h: 0.18,
      fontSize: 7.5,
      bold: true,
      color: SK.orange,
      fontFace,
      align: 'center',
    });

    slide.addShape('rect', {
      x: cx + colW * 0.25,
      y: barAreaY + 0.22 + (barAreaH - barH),
      w: colW * 0.5,
      h: barH,
      fill: { color },
      line: { color, width: 0 },
    });

    slide.addText(item.label, {
      x: cx,
      y: y + h - 0.28,
      w: colW - 0.05,
      h: 0.22,
      fontSize: 7.5,
      color: SK.textSub,
      fontFace,
      align: 'center',
    });
  });

  return h;
}

export async function addDonutChartPpt(
  slide: PptSlide,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
  fontFace: string,
): Promise<number> {
  slide.addShape('rect', { x, y, w, h, fill: { color: SK.white }, line: { color: SK.border, width: 1 } });
  slide.addText(chart.title, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.22,
    fontSize: 9.5,
    bold: true,
    color: SK.text,
    fontFace,
  });

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
      const color = item.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="18"
        stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})" />`;
      offset += dash;
      return seg;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">${segments}</svg>`;
  const img = await svgToDataUrl(svg, 140, 140);
  slide.addImage({ data: img, x: x + 0.15, y: y + 0.35, w: 1.2, h: 1.2 });

  let legY = y + 0.42;
  chart.items.forEach((item, idx) => {
    const color = pickColor(item, idx);
    const display = item.unit ?? `${item.value}${unit}`;
    slide.addShape('rect', {
      x: x + 1.55,
      y: legY + 0.06,
      w: 0.12,
      h: 0.12,
      fill: { color },
      line: { color, width: 0 },
    });
    slide.addText(`${item.label}  ${display}`, {
      x: x + 1.72,
      y: legY,
      w: w - 1.9,
      h: 0.22,
      fontSize: 8.5,
      color: SK.textSub,
      fontFace,
      valign: 'middle',
    });
    legY += 0.24;
  });

  return h;
}

export function addGroupedBarChartPpt(
  slide: PptSlide,
  cross: CrossChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
  fontFace: string,
): number {
  slide.addShape('rect', { x, y, w, h, fill: { color: SK.white }, line: { color: SK.border, width: 1 } });
  slide.addText(cross.title, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.22,
    fontSize: 9.5,
    bold: true,
    color: SK.text,
    fontFace,
  });

  let legX = x + 0.12;
  cross.series.forEach((s) => {
    slide.addShape('rect', {
      x: legX,
      y: y + 0.32,
      w: 0.1,
      h: 0.1,
      fill: { color: s.color.replace('#', '') },
      line: { width: 0 },
    });
    slide.addText(s.label, {
      x: legX + 0.14,
      y: y + 0.28,
      w: 0.7,
      h: 0.18,
      fontSize: 8,
      color: SK.textSub,
      fontFace,
    });
    legX += 0.9;
  });

  const max = Math.max(...cross.series.flatMap((s) => s.values), 1);
  const n = cross.categories.length;
  const groupW = (w - 0.3) / n;
  const barAreaY = y + 0.55;
  const barAreaH = h - 0.95;

  cross.categories.forEach((cat, gi) => {
    const gx = x + 0.15 + gi * groupW;
    const barW = groupW * 0.18;
    cross.series.forEach((s, si) => {
      const pct = Math.min(100, (s.values[gi] / max) * 100);
      const barH = barAreaH * (pct / 100);
      slide.addShape('rect', {
        x: gx + si * (barW + 0.02),
        y: barAreaY + barAreaH - barH,
        w: barW,
        h: barH,
        fill: { color: s.color.replace('#', '') },
        line: { width: 0 },
      });
    });
    slide.addText(cat, {
      x: gx,
      y: y + h - 0.32,
      w: groupW - 0.05,
      h: 0.22,
      fontSize: 7,
      color: SK.textSub,
      fontFace,
      align: 'center',
    });
  });

  return h;
}

export async function addChartPpt(
  slide: PptSlide,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
  fontFace: string,
): Promise<number> {
  switch (chart.type) {
    case 'vertical':
      return addVerticalBarChartPpt(slide, chart, x, y, w, h, fontFace);
    case 'donut':
      return addDonutChartPpt(slide, chart, x, y, w, h, fontFace);
    case 'line':
      return addHorizontalBarChartPpt(slide, chart, x, y, w, h, fontFace);
    default:
      return addHorizontalBarChartPpt(slide, chart, x, y, w, h, fontFace);
  }
}

async function svgToDataUrl(svg: string, width: number, height: number): Promise<string> {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** jsPDF 차트 — 수평 막대 (mm) */
export function drawHorizontalBarChartPdf(
  pdf: import('jspdf').jsPDF,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  pdf.setDrawColor(255, 224, 204);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, w, h, 1, 1, 'FD');

  pdf.setFontSize(9.5);
  pdf.text(chart.title, x + 3, y + 5);

  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';
  const rowH = Math.min(7, (h - 12) / Math.max(chart.items.length, 1));
  let rowY = y + 10;

  chart.items.forEach((item, idx) => {
    const pct = Math.min(100, (item.value / max) * 100);
    const color = item.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    const rgb = hexToRgb(color);
    const display = item.unit ?? `${item.value}${unit}`;

    pdf.setFontSize(9);
    pdf.text(item.label, x + 3, rowY + rowH * 0.55);

    const trackX = x + 38;
    const trackW = w - 52;
    pdf.setFillColor(255, 245, 239);
    pdf.rect(trackX, rowY + rowH * 0.25, trackW, rowH * 0.45, 'F');
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.rect(trackX, rowY + rowH * 0.25, trackW * (pct / 100), rowH * 0.45, 'F');

    pdf.setFontSize(9);
    pdf.text(display, x + w - 3, rowY + rowH * 0.55, { align: 'right' });

    rowY += rowH + 1.5;
  });
}

export async function drawChartPdf(
  pdf: import('jspdf').jsPDF,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
): Promise<void> {
  if (chart.type === 'donut') {
    await drawDonutChartPdf(pdf, chart, x, y, w, h);
    return;
  }
  if (chart.type === 'vertical') {
    drawVerticalBarChartPdf(pdf, chart, x, y, w, h);
    return;
  }
  drawHorizontalBarChartPdf(pdf, chart, x, y, w, h);
}

function drawVerticalBarChartPdf(
  pdf: import('jspdf').jsPDF,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  pdf.setDrawColor(255, 224, 204);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, w, h, 1, 1, 'FD');
  pdf.setFontSize(9.5);
  pdf.text(chart.title, x + 3, y + 5);

  const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);
  const unit = chart.unit ?? '%';
  const n = chart.items.length;
  const colW = (w - 6) / n;
  const barAreaY = y + 10;
  const barAreaH = h - 22;

  chart.items.forEach((item, idx) => {
    const pct = Math.min(100, (item.value / max) * 100);
    const color = item.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    const rgb = hexToRgb(color);
    const cx = x + 3 + idx * colW;

    pdf.setFontSize(7.5);
    pdf.text(item.unit ?? `${item.value}${unit}`, cx + colW / 2, barAreaY, { align: 'center' });

    const barH = barAreaH * (pct / 100);
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.rect(cx + colW * 0.25, barAreaY + 4 + (barAreaH - barH), colW * 0.5, barH, 'F');

    pdf.setFontSize(7.5);
    pdf.text(item.label, cx + colW / 2, y + h - 4, { align: 'center' });
  });
}

async function drawDonutChartPdf(
  pdf: import('jspdf').jsPDF,
  chart: ReportChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
): Promise<void> {
  pdf.setDrawColor(255, 224, 204);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, w, h, 1, 1, 'FD');
  pdf.setFontSize(9.5);
  pdf.text(chart.title, x + 3, y + 5);

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
      const color = item.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="18"
        stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})" />`;
      offset += dash;
      return seg;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140">${segments}</svg>`;
  const img = await svgToDataUrl(svg, 140, 140);
  pdf.addImage(img, 'PNG', x + 3, y + 10, 28, 28);

  let legY = y + 12;
  chart.items.forEach((item) => {
    const display = item.unit ?? `${item.value}${unit}`;
    pdf.setFontSize(8.5);
    pdf.text(`${item.label}  ${display}`, x + 34, legY);
    legY += 5;
  });
}

export function drawGroupedBarChartPdf(
  pdf: import('jspdf').jsPDF,
  cross: CrossChartSpec,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  pdf.setDrawColor(255, 224, 204);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x, y, w, h, 1, 1, 'FD');
  pdf.setFontSize(9.5);
  pdf.text(cross.title, x + 3, y + 5);

  const max = Math.max(...cross.series.flatMap((s) => s.values), 1);
  const n = cross.categories.length;
  const groupW = (w - 6) / n;
  const barAreaY = y + 14;
  const barAreaH = h - 24;

  cross.categories.forEach((cat, gi) => {
    const gx = x + 3 + gi * groupW;
    const barW = groupW * 0.18;
    cross.series.forEach((s, si) => {
      const pct = Math.min(100, (s.values[gi] / max) * 100);
      const rgb = hexToRgb(s.color);
      const barH = barAreaH * (pct / 100);
      pdf.setFillColor(rgb.r, rgb.g, rgb.b);
      pdf.rect(gx + si * (barW + 0.5), barAreaY + barAreaH - barH, barW, barH, 'F');
    });
    pdf.setFontSize(7);
    pdf.text(cat, gx + groupW / 2, y + h - 4, { align: 'center' });
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
