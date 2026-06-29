import type { PerformanceReportSlide, ReportKpiCard } from '../performanceReportSlides';
import { festivalInfo } from '../../data/mockData';
import { kpiValueFontSize, splitKpiValue } from '../layout/textFit';
import {
  CONTENT_W,
  MARGIN_X,
  PDF_H_MM,
  PDF_W_MM,
  SK,
  textBoxHMm,
} from './exportTheme';
import { drawChartPdf, drawGroupedBarChartPdf } from './nativeCharts';
import { drawTablePdf } from './nativeTables';
import { REPORT_GRID, resolveDetailGridVariant } from '../layout/gridLayout';
import { drawPdfTextInBox, ensurePdfKoreanFont, setPdfFont } from './pdfFontLoader';

const MX = (MARGIN_X / 10) * PDF_W_MM;
const CW = (CONTENT_W / 10) * PDF_W_MM;

function xMm(inches: number): number {
  return (inches / 10) * PDF_W_MM;
}

function yMm(inches: number): number {
  return (inches / 5.625) * PDF_H_MM;
}

function addAccentBar(pdf: import('jspdf').jsPDF): void {
  pdf.setFillColor(244, 119, 37);
  pdf.rect(0, 0, PDF_W_MM, yMm(0.06), 'F');
}

function addFooter(pdf: import('jspdf').jsPDF, pageNum: number): void {
  pdf.setDrawColor(235, 235, 235);
  pdf.line(MX, PDF_H_MM - yMm(0.38), MX + CW, PDF_H_MM - yMm(0.38));
  drawPdfTextInBox(pdf, `${festivalInfo.organizer} · ${festivalInfo.name}`, MX, PDF_H_MM - yMm(0.32), CW * 0.5, 8, {
    color: SK.textMuted,
  });
  drawPdfTextInBox(pdf, String(pageNum), MX + CW - xMm(0.5), PDF_H_MM - yMm(0.32), xMm(0.5), 8, {
    align: 'right',
    color: SK.textMuted,
  });
}

function addKpiCard(
  pdf: import('jspdf').jsPDF,
  card: ReportKpiCard,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  if (card.highlight) {
    pdf.setFillColor(255, 245, 239);
    pdf.setDrawColor(244, 119, 37);
    pdf.setLineWidth(0.4);
  } else {
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(255, 224, 204);
    pdf.setLineWidth(0.2);
  }
  pdf.roundedRect(x, y, w, h, 1, 1, 'FD');

  drawPdfTextInBox(pdf, card.label, x + 2, y + 2, w - 4, 10, { bold: true, color: SK.textSub });

  const { main, unit } = splitKpiValue(card.value);
  const valueSize = kpiValueFontSize(card.value);
  const valueText = unit ? `${main} ${unit}` : main;
  const valueY = y + yMm(0.38);

  drawPdfTextInBox(pdf, valueText, x + 2, valueY, w - 4, valueSize, {
    bold: true,
    color: card.highlight ? SK.red : SK.orange,
  });
}

function addKpiRow(pdf: import('jspdf').jsPDF, kpis: ReportKpiCard[], y: number): number {
  const n = kpis.length;
  const cols = n >= 4 ? 4 : n >= 3 ? 3 : n;
  const gap = xMm(0.12);
  const cardW = (CW - gap * (cols - 1)) / cols;
  const cardH = yMm(0.92);

  kpis.slice(0, cols).forEach((card, i) => {
    addKpiCard(pdf, card, MX + i * (cardW + gap), y, cardW, cardH);
  });

  return cardH;
}

function addReportHeader(pdf: import('jspdf').jsPDF, data: PerformanceReportSlide): number {
  let y = yMm(0.18);

  if (data.sectionLabel) {
    drawPdfTextInBox(pdf, data.sectionLabel, MX, y, CW, 9, { bold: true, color: SK.orange });
    y += yMm(0.24);
  }

  drawPdfTextInBox(pdf, data.title, MX, y, CW, 11, { bold: true, color: SK.textSub });
  y += yMm(0.28);

  if (data.headline) {
    pdf.setFillColor(244, 119, 37);
    pdf.rect(MX, y + 1, 1.2, yMm(0.42), 'F');
    drawPdfTextInBox(pdf, data.headline, MX + 4, y, CW - 4, 18, { bold: true, color: SK.text });
    y += yMm(0.55);
  }

  return y;
}

function addInsightBox(pdf: import('jspdf').jsPDF, insights: string[], y: number, tall = false): void {
  const h = tall ? yMm(1.05) : yMm(0.88);
  pdf.setFillColor(255, 245, 239);
  pdf.setDrawColor(255, 224, 204);
  pdf.roundedRect(MX, y, CW, h, 1, 1, 'FD');
  pdf.setFillColor(234, 0, 44);
  pdf.rect(MX, y, 1.5, h, 'F');

  drawPdfTextInBox(pdf, 'AI 인사이트', MX + 4, y + 2, 20, 8.5, { bold: true, color: SK.orange });

  let iy = y + 5;
  insights.slice(0, tall ? 4 : 3).forEach((t) => {
    drawPdfTextInBox(pdf, `• ${t.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '')}`, MX + 22, iy, CW - 24, 9);
    iy += textBoxHMm(9, 1.25);
  });
}

function addInterpretationBox(pdf: import('jspdf').jsPDF, lines: string[], y: number): number {
  const h = yMm(0.42);
  pdf.setFillColor(250, 251, 252);
  pdf.setDrawColor(229, 232, 235);
  pdf.rect(MX, y, 2, h, 'F');
  pdf.setFillColor(244, 119, 37);
  pdf.rect(MX, y, 1.2, h, 'F');

  drawPdfTextInBox(pdf, '분석 해석', MX + 4, y + 1, 18, 8, { bold: true, color: SK.textSub });

  let iy = y + 1;
  lines.slice(0, 3).forEach((t) => {
    drawPdfTextInBox(pdf, `• ${t}`, MX + 22, iy, CW - 24, 8.5);
    iy += textBoxHMm(8.5, 1.35);
  });

  return h + 2;
}

async function renderDetailSlide(pdf: import('jspdf').jsPDF, data: PerformanceReportSlide): Promise<void> {
  addAccentBar(pdf);
  const headerY = addReportHeader(pdf, data);
  const variant = resolveDetailGridVariant(data);
  const charts = data.charts ?? [];
  const crossCharts = data.crossCharts ?? [];
  const table = data.tables?.[0];
  const chartGap = xMm(0.1);
  const mainH = yMm(REPORT_GRID.detail.mainHeight / 96 * 5.625 * 0.98);
  let y = headerY;

  if (variant === 'dual-top') {
    const chartH = yMm(1.15);
    if (charts.length === 2) {
      const cw = (CW - chartGap) / 2;
      await drawChartPdf(pdf, charts[0], MX, y, cw, chartH);
      await drawChartPdf(pdf, charts[1], MX + cw + chartGap, y, cw, chartH);
    }
    y += chartH + 2;
    if (table) drawTablePdf(pdf, table, MX, y, CW);
    y += mainH - chartH;
  } else if (variant === 'stack') {
    const chartH = yMm(REPORT_GRID.detail.stackChartHeight / 96 * 5.625);
    if (crossCharts.length) {
      drawGroupedBarChartPdf(pdf, crossCharts[0], MX, y, CW, chartH);
      y += chartH + 2;
    } else if (charts.length) {
      await drawChartPdf(pdf, charts[0], MX, y, CW, chartH);
      y += chartH + 2;
    }
    if (table) drawTablePdf(pdf, table, MX, y, CW);
    y += mainH * 0.55;
  } else {
    const chartW = CW * (REPORT_GRID.detail.chartColPct / 100);
    const tableW = CW * (REPORT_GRID.detail.tableColPct / 100) - chartGap;
    const chartH = mainH;

    if (charts.length === 2) {
      const cw = (chartW - chartGap) / 2;
      await drawChartPdf(pdf, charts[0], MX, y, cw, chartH * 0.46);
      await drawChartPdf(pdf, charts[1], MX + cw + chartGap, y, cw, chartH * 0.46);
    } else if (charts.length === 1) {
      await drawChartPdf(pdf, charts[0], MX, y, chartW, chartH);
    } else if (crossCharts.length) {
      drawGroupedBarChartPdf(pdf, crossCharts[0], MX, y, chartW, chartH);
    }
    if (table) drawTablePdf(pdf, table, MX + chartW + chartGap, y, tableW);
    y += chartH + 2;
  }

  if (data.interpretation?.length) {
    y += addInterpretationBox(pdf, data.interpretation, y);
  }

  if (data.aiInsights?.length) {
    addInsightBox(pdf, data.aiInsights, y, true);
  }
}

async function renderReportSlide(pdf: import('jspdf').jsPDF, data: PerformanceReportSlide): Promise<void> {
  addAccentBar(pdf);
  let y = addReportHeader(pdf, data);

  if (data.kpis?.length) {
    addKpiRow(pdf, data.kpis, y);
    y += yMm(1.0);
  }

  const charts = data.charts ?? [];
  const crossCharts = data.crossCharts ?? [];
  const chartGap = xMm(0.12);
  const chartH = yMm(1.55);

  if (charts.length === 2) {
    const cw = (CW - chartGap) / 2;
    await drawChartPdf(pdf, charts[0], MX, y, cw, chartH);
    await drawChartPdf(pdf, charts[1], MX + cw + chartGap, y, cw, chartH);
    y += chartH + 2;
  } else if (charts.length === 1) {
    await drawChartPdf(pdf, charts[0], MX, y, CW, chartH);
    y += chartH + 2;
  }

  if (crossCharts.length) {
    drawGroupedBarChartPdf(pdf, crossCharts[0], MX, y, CW, chartH);
    y += chartH + 2;
  }

  if (data.aiInsights?.length) {
    addInsightBox(pdf, data.aiInsights, Math.min(y, yMm(4.05)));
  }
}

function renderCoverSlide(pdf: import('jspdf').jsPDF, data: PerformanceReportSlide): void {
  addAccentBar(pdf);
  drawPdfTextInBox(pdf, 'SK AIM · 성과 분석 보고서', xMm(0.6), yMm(1.0), xMm(8), 10, {
    bold: true,
    color: SK.orange,
  });
  drawPdfTextInBox(pdf, data.title.replace('\n', ' '), xMm(0.6), yMm(1.55), xMm(8.8), 34, {
    bold: true,
    color: SK.text,
  });

  if (data.summary?.length) {
    let sy = yMm(3.0);
    data.summary.forEach((line) => {
      drawPdfTextInBox(pdf, line, xMm(0.6), sy, xMm(7.5), 11, { color: SK.textSub });
      sy += textBoxHMm(11, 1.4);
    });
  }
}

function renderDividerSlide(pdf: import('jspdf').jsPDF, data: PerformanceReportSlide): void {
  pdf.setFillColor(25, 31, 40);
  pdf.rect(0, 0, PDF_W_MM, PDF_H_MM, 'F');
  addAccentBar(pdf);
  drawPdfTextInBox(pdf, data.sectionLabel ?? '', xMm(0.5), yMm(1.2), xMm(9), 72, {
    bold: true,
    color: SK.orange,
    align: 'center',
  });
  drawPdfTextInBox(pdf, data.title, xMm(0.5), yMm(2.5), xMm(9), 28, {
    bold: true,
    color: SK.white,
    align: 'center',
  });
  if (data.summary?.[0]) {
    drawPdfTextInBox(pdf, data.summary[0], xMm(1.2), yMm(3.4), xMm(7.6), 12, {
      color: 'ADB5BD',
      align: 'center',
    });
  }
}

function renderClosingSlide(pdf: import('jspdf').jsPDF, data: PerformanceReportSlide): void {
  addAccentBar(pdf);
  const y = addReportHeader(pdf, data);
  const insights = data.aiInsights ?? [];

  pdf.setFillColor(255, 245, 239);
  pdf.setDrawColor(255, 224, 204);
  pdf.roundedRect(MX, y, CW * 0.55, yMm(2.0), 1, 1, 'FD');
  drawPdfTextInBox(pdf, '공공·정책 관점 핵심 진단', MX + 3, y + 3, CW * 0.5, 10, { bold: true });

  let iy = y + 10;
  insights.forEach((t) => {
    drawPdfTextInBox(pdf, `• ${t.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '')}`, MX + 3, iy, CW * 0.52, 10);
    iy += textBoxHMm(10, 1.4);
  });

  const policies = data.summary ?? [];
  const cols = [
    { title: '콘텐츠·프로그램', items: policies.slice(0, 2) },
    { title: '마케팅·홍보', items: policies.slice(2, 4) },
    { title: '운영·인프라', items: policies.slice(4, 6) },
  ];
  const colW = (CW * 0.42) / 3;
  cols.forEach((col, i) => {
    const cx = MX + CW * 0.57 + i * (colW + xMm(0.08));
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(255, 224, 204);
    pdf.roundedRect(cx, y, colW, yMm(2.0), 1, 1, 'FD');
    drawPdfTextInBox(pdf, col.title, cx + 2, y + 3, colW - 4, 9, { bold: true, color: SK.orange });
    let py = y + 10;
    col.items.forEach((item) => {
      drawPdfTextInBox(pdf, `• ${item}`, cx + 2, py, colW - 4, 8.5);
      py += textBoxHMm(8.5, 1.4);
    });
  });
}

/** 데이터 기반 PDF — html2canvas 미사용, Noto Sans KR embed + addText */
export async function exportPerformanceReportNativePdf(
  slides: PerformanceReportSlide[],
  filenameBase: string,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [PDF_W_MM, PDF_H_MM],
  });

  await ensurePdfKoreanFont(pdf);

  for (let i = 0; i < slides.length; i++) {
    if (i > 0) pdf.addPage([PDF_W_MM, PDF_H_MM], 'landscape');
    setPdfFont(pdf, false);

    const data = slides[i];
    switch (data.layout) {
      case 'cover':
        renderCoverSlide(pdf, data);
        break;
      case 'divider':
        renderDividerSlide(pdf, data);
        break;
      case 'closing':
        renderClosingSlide(pdf, data);
        break;
      case 'detail':
        await renderDetailSlide(pdf, data);
        break;
      default:
        await renderReportSlide(pdf, data);
    }

    addFooter(pdf, i + 1);
  }

  pdf.save(`${filenameBase}.pdf`);
}
