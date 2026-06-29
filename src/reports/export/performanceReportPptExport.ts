import type { PerformanceReportSlide, ReportKpiCard } from '../performanceReportSlides';
import { festivalInfo } from '../../data/mockData';
import { kpiValueFontSize, splitKpiValue } from '../layout/textFit';
import {
  CONTENT_W,
  FONT_FACE,
  FONT_FACE_FALLBACK,
  MARGIN_X,
  SK,
  SLIDE_H,
  SLIDE_W,
  textBoxHIn,
} from './exportTheme';
import { addChartPpt, addGroupedBarChartPpt } from './nativeCharts';
import { addTablePpt } from './nativeTables';
import { REPORT_GRID, resolveDetailGridVariant } from '../layout/gridLayout';

type PptSlide = ReturnType<import('pptxgenjs').default['addSlide']>;

const FONT = FONT_FACE;

function addAccentBar(slide: PptSlide): void {
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.06,
    fill: { color: SK.orange },
    line: { color: SK.orange, width: 0 },
  });
}

function addFooter(slide: PptSlide, pageNum: number): void {
  slide.addShape('line', {
    x: MARGIN_X,
    y: SLIDE_H - 0.38,
    w: CONTENT_W,
    h: 0,
    line: { color: 'EBEBEB', width: 0.5 },
  });
  slide.addText(`${festivalInfo.organizer} · ${festivalInfo.name}`, {
    x: MARGIN_X,
    y: SLIDE_H - 0.32,
    w: 5,
    h: textBoxHIn(8, 1.6),
    fontSize: 8,
    color: SK.textMuted,
    fontFace: FONT,
    valign: 'middle',
  });
  slide.addText(String(pageNum), {
    x: SLIDE_W - MARGIN_X - 0.5,
    y: SLIDE_H - 0.32,
    w: 0.5,
    h: textBoxHIn(8, 1.6),
    fontSize: 8,
    color: SK.textMuted,
    fontFace: FONT,
    align: 'right',
    valign: 'middle',
  });
}

function addKpiCard(slide: PptSlide, card: ReportKpiCard, x: number, y: number, w: number, h: number): void {
  slide.addShape('rect', {
    x,
    y,
    w,
    h,
    fill: { color: card.highlight ? SK.bgWarm : SK.white },
    line: { color: card.highlight ? SK.orange : SK.border, width: card.highlight ? 2 : 1 },
  });

  slide.addText(card.label, {
    x: x + 0.12,
    y: y + 0.1,
    w: w - 0.24,
    h: textBoxHIn(10, 1.6),
    fontSize: 10,
    bold: true,
    color: SK.textSub,
    fontFace: FONT,
    valign: 'top',
  });

  const { main, unit } = splitKpiValue(card.value);
  const valueSize = kpiValueFontSize(card.value);
  const valueColor = card.highlight ? SK.red : SK.orange;
  const valueY = y + 0.38;
  const valueH = textBoxHIn(valueSize, 1.6);

  const runs: { text: string; options: Record<string, unknown> }[] = [
    { text: main, options: { fontSize: valueSize, bold: true, color: valueColor } },
  ];
  if (unit) {
    runs.push({ text: ` ${unit}`, options: { fontSize: 10, color: SK.textSub } });
  }

  slide.addText(runs, {
    x: x + 0.12,
    y: valueY,
    w: w - 0.24,
    h: valueH,
    fontFace: FONT,
    valign: 'middle',
    wrap: false,
  });
}

function addKpiRow(slide: PptSlide, kpis: ReportKpiCard[], y: number): number {
  const n = kpis.length;
  const cols = n >= 4 ? 4 : n >= 3 ? 3 : n;
  const gap = 0.12;
  const cardW = (CONTENT_W - gap * (cols - 1)) / cols;
  const cardH = 0.92;

  kpis.slice(0, cols).forEach((card, i) => {
    addKpiCard(slide, card, MARGIN_X + i * (cardW + gap), y, cardW, cardH);
  });

  return cardH;
}

function addReportHeader(slide: PptSlide, data: PerformanceReportSlide): number {
  let y = 0.18;

  if (data.sectionLabel) {
    slide.addText(data.sectionLabel, {
      x: MARGIN_X,
      y,
      w: 4,
      h: textBoxHIn(9, 1.6),
      fontSize: 9,
      bold: true,
      color: SK.orange,
      fontFace: FONT,
      valign: 'middle',
    });
    y += 0.24;
  }

  slide.addText(data.title, {
    x: MARGIN_X,
    y,
    w: CONTENT_W,
    h: textBoxHIn(11, 1.6),
    fontSize: 11,
    bold: true,
    color: SK.textSub,
    fontFace: FONT,
    valign: 'middle',
  });
  y += 0.28;

  if (data.headline) {
    slide.addShape('rect', {
      x: MARGIN_X,
      y: y + 0.05,
      w: 0.05,
      h: 0.42,
      fill: { color: SK.orange },
      line: { width: 0 },
    });
    slide.addText(data.headline, {
      x: MARGIN_X + 0.14,
      y,
      w: CONTENT_W - 0.14,
      h: textBoxHIn(18, 1.6),
      fontSize: 18,
      bold: true,
      color: SK.text,
      fontFace: FONT,
      valign: 'middle',
    });
    y += 0.55;
  }

  return y;
}

function addInsightBox(slide: PptSlide, insights: string[], y: number, tall = false): void {
  const h = tall ? 1.05 : 0.88;
  slide.addShape('rect', {
    x: MARGIN_X,
    y,
    w: CONTENT_W,
    h,
    fill: { color: SK.bgWarm },
    line: { color: SK.border, width: 1 },
  });
  slide.addShape('rect', {
    x: MARGIN_X,
    y,
    w: 0.06,
    h,
    fill: { color: SK.red },
    line: { width: 0 },
  });

  slide.addText('AI 인사이트', {
    x: MARGIN_X + 0.18,
    y: y + 0.08,
    w: 1.2,
    h: textBoxHIn(8.5, 1.6),
    fontSize: 8.5,
    bold: true,
    color: SK.white,
    fontFace: FONT,
    fill: { color: SK.orange },
    valign: 'middle',
  });

  const bullets = insights.slice(0, tall ? 4 : 3).map((t) => ({
    text: t.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, ''),
    options: { bullet: true, breakLine: true, fontSize: 9.5, color: SK.text },
  }));

  slide.addText(bullets, {
    x: MARGIN_X + 1.5,
    y: y + 0.1,
    w: CONTENT_W - 1.65,
    h: h - 0.15,
    fontFace: FONT,
    valign: 'top',
  });
}

function addInterpretationBox(slide: PptSlide, lines: string[], y: number): number {
  const h = 0.42;
  slide.addShape('rect', {
    x: MARGIN_X,
    y,
    w: CONTENT_W,
    h,
    fill: { color: 'FAFBFC' },
    line: { color: 'E5E8EB', width: 0.5 },
  });
  slide.addShape('rect', {
    x: MARGIN_X,
    y,
    w: 0.06,
    h,
    fill: { color: SK.orange },
    line: { width: 0 },
  });

  slide.addText('분석 해석', {
    x: MARGIN_X + 0.18,
    y: y + 0.04,
    w: 1,
    h: textBoxHIn(8, 1.6),
    fontSize: 8,
    bold: true,
    color: SK.textSub,
    fontFace: FONT,
  });

  slide.addText(
    lines.slice(0, 3).map((t) => ({ text: t, options: { bullet: true, breakLine: true, fontSize: 8.5 } })),
    {
      x: MARGIN_X + 1.2,
      y: y + 0.06,
      w: CONTENT_W - 1.35,
      h: h - 0.08,
      fontFace: FONT,
      valign: 'top',
    },
  );

  return h + 0.06;
}

async function renderDetailSlide(slide: PptSlide, data: PerformanceReportSlide): Promise<void> {
  addAccentBar(slide);
  let y = addReportHeader(slide, data);
  const variant = resolveDetailGridVariant(data);
  const charts = data.charts ?? [];
  const crossCharts = data.crossCharts ?? [];
  const table = data.tables?.[0];
  const chartGap = 0.1;
  const mainH = REPORT_GRID.detail.mainHeight / 96 * 5.625 * 0.42;

  if (variant === 'dual-top') {
    const chartH = 1.15;
    if (charts.length === 2) {
      const cw = (CONTENT_W - chartGap) / 2;
      await addChartPpt(slide, charts[0], MARGIN_X, y, cw, chartH, FONT);
      await addChartPpt(slide, charts[1], MARGIN_X + cw + chartGap, y, cw, chartH, FONT);
    }
    y += chartH + 0.08;
    if (table) addTablePpt(slide, table, MARGIN_X, y, CONTENT_W, FONT);
    y += mainH - chartH;
  } else if (variant === 'stack') {
    const chartH = REPORT_GRID.detail.stackChartHeight / 96 * 5.625 * 0.38;
    if (crossCharts.length) {
      addGroupedBarChartPpt(slide, crossCharts[0], MARGIN_X, y, CONTENT_W, chartH, FONT);
      y += chartH + 0.08;
    } else if (charts.length) {
      await addChartPpt(slide, charts[0], MARGIN_X, y, CONTENT_W, chartH, FONT);
      y += chartH + 0.08;
    }
    if (table) addTablePpt(slide, table, MARGIN_X, y, CONTENT_W, FONT);
    y += mainH * 0.55;
  } else {
    const chartW = CONTENT_W * (REPORT_GRID.detail.chartColPct / 100);
    const tableW = CONTENT_W * (REPORT_GRID.detail.tableColPct / 100) - chartGap;
    const chartH = mainH;

    if (charts.length === 2) {
      const cw = (chartW - chartGap) / 2;
      await addChartPpt(slide, charts[0], MARGIN_X, y, cw, chartH * 0.46, FONT);
      await addChartPpt(slide, charts[1], MARGIN_X + cw + chartGap, y, cw, chartH * 0.46, FONT);
    } else if (charts.length === 1) {
      await addChartPpt(slide, charts[0], MARGIN_X, y, chartW, chartH, FONT);
    } else if (crossCharts.length) {
      addGroupedBarChartPpt(slide, crossCharts[0], MARGIN_X, y, chartW, chartH, FONT);
    }
    if (table) addTablePpt(slide, table, MARGIN_X + chartW + chartGap, y, tableW, FONT);
    y += chartH + 0.08;
  }

  if (data.interpretation?.length) {
    y += addInterpretationBox(slide, data.interpretation, y);
  }

  if (data.aiInsights?.length) {
    addInsightBox(slide, data.aiInsights, y, true);
  }
}

async function renderReportSlide(slide: PptSlide, data: PerformanceReportSlide): Promise<void> {
  addAccentBar(slide);
  let y = addReportHeader(slide, data);

  if (data.kpis?.length) {
    addKpiRow(slide, data.kpis, y);
    y += 1.0;
  }

  const charts = data.charts ?? [];
  const crossCharts = data.crossCharts ?? [];
  const chartGap = 0.12;

  if (charts.length === 2) {
    const cw = (CONTENT_W - chartGap) / 2;
    await addChartPpt(slide, charts[0], MARGIN_X, y, cw, 1.55, FONT);
    await addChartPpt(slide, charts[1], MARGIN_X + cw + chartGap, y, cw, 1.55, FONT);
    y += 1.65;
  } else if (charts.length === 1) {
    await addChartPpt(slide, charts[0], MARGIN_X, y, CONTENT_W, 1.55, FONT);
    y += 1.65;
  }

  if (crossCharts.length) {
    addGroupedBarChartPpt(slide, crossCharts[0], MARGIN_X, y, CONTENT_W, 1.55, FONT);
    y += 1.65;
  }

  if (data.aiInsights?.length) {
    addInsightBox(slide, data.aiInsights, Math.min(y, 4.05));
  }
}

function renderCoverSlide(slide: PptSlide, data: PerformanceReportSlide): void {
  addAccentBar(slide);
  slide.addText('SK AIM · 성과 분석 보고서', {
    x: 0.6,
    y: 1.0,
    w: 8,
    h: textBoxHIn(10, 1.6),
    fontSize: 10,
    bold: true,
    color: SK.orange,
    fontFace: FONT,
    valign: 'middle',
  });
  slide.addText(data.title.replace('\n', ' '), {
    x: 0.6,
    y: 1.55,
    w: 8.8,
    h: textBoxHIn(34, 1.6),
    fontSize: 34,
    bold: true,
    color: SK.text,
    fontFace: FONT,
    valign: 'middle',
  });

  if (data.summary?.length) {
    slide.addText(
      data.summary.map((line) => ({ text: line, options: { bullet: false, breakLine: true } })),
      {
        x: 0.6,
        y: 3.0,
        w: 7.5,
        h: 1.8,
        fontSize: 11,
        color: SK.textSub,
        fontFace: FONT,
        valign: 'top',
      },
    );
  }
}

function renderDividerSlide(slide: PptSlide, data: PerformanceReportSlide): void {
  slide.background = { color: SK.dividerBg };
  addAccentBar(slide);
  slide.addText(data.sectionLabel ?? '', {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: textBoxHIn(72, 1.6),
    fontSize: 72,
    bold: true,
    color: SK.orange,
    align: 'center',
    fontFace: FONT,
    valign: 'middle',
  });
  slide.addText(data.title, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: textBoxHIn(28, 1.6),
    fontSize: 28,
    bold: true,
    color: SK.white,
    align: 'center',
    fontFace: FONT,
    valign: 'middle',
  });
  if (data.summary?.[0]) {
    slide.addText(data.summary[0], {
      x: 1.2,
      y: 3.4,
      w: 7.6,
      h: textBoxHIn(12, 1.6),
      fontSize: 12,
      color: 'ADB5BD',
      align: 'center',
      fontFace: FONT,
      valign: 'middle',
    });
  }
}

function renderClosingSlide(slide: PptSlide, data: PerformanceReportSlide): void {
  addAccentBar(slide);
  const y = addReportHeader(slide, data);

  const insights = data.aiInsights ?? [];
  slide.addShape('rect', {
    x: MARGIN_X,
    y,
    w: CONTENT_W * 0.55,
    h: 2.0,
    fill: { color: SK.bgWarm },
    line: { color: SK.border, width: 1 },
  });
  slide.addText('공공·정책 관점 핵심 진단', {
    x: MARGIN_X + 0.15,
    y: y + 0.12,
    w: 4,
    h: textBoxHIn(10, 1.6),
    fontSize: 10,
    bold: true,
    color: SK.text,
    fontFace: FONT,
  });
  slide.addText(
    insights.map((t) => ({
      text: t.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, ''),
      options: { bullet: true, breakLine: true, fontSize: 10 },
    })),
    {
      x: MARGIN_X + 0.15,
      y: y + 0.38,
      w: CONTENT_W * 0.52,
      h: 1.5,
      fontFace: FONT,
      valign: 'top',
    },
  );

  const policies = data.summary ?? [];
  const cols = [
    { title: '콘텐츠·프로그램', items: policies.slice(0, 2) },
    { title: '마케팅·홍보', items: policies.slice(2, 4) },
    { title: '운영·인프라', items: policies.slice(4, 6) },
  ];
  const colW = CONTENT_W * 0.42 / 3;
  cols.forEach((col, i) => {
    const cx = MARGIN_X + CONTENT_W * 0.57 + i * (colW + 0.08);
    slide.addShape('rect', {
      x: cx,
      y,
      w: colW,
      h: 2.0,
      fill: { color: SK.white },
      line: { color: SK.border, width: 1 },
    });
    slide.addText(col.title, {
      x: cx + 0.08,
      y: y + 0.1,
      w: colW - 0.16,
      h: textBoxHIn(9, 1.6),
      fontSize: 9,
      bold: true,
      color: SK.orange,
      fontFace: FONT,
    });
    slide.addText(
      col.items.map((item) => ({ text: item, options: { bullet: true, breakLine: true, fontSize: 8.5 } })),
      {
        x: cx + 0.08,
        y: y + 0.35,
        w: colW - 0.16,
        h: 1.5,
        fontFace: FONT,
        valign: 'top',
      },
    );
  });
}

/** 데이터 기반 PPT — html2canvas 미사용, KPI는 addText */
export async function exportPerformanceReportNativePpt(
  slides: PerformanceReportSlide[],
  filenameBase: string,
  title: string,
): Promise<void> {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.author = festivalInfo.organizer;
  pptx.title = title;
  pptx.layout = 'LAYOUT_16x9';
  pptx.theme = { headFontFace: FONT, bodyFontFace: FONT };

  for (let i = 0; i < slides.length; i++) {
    const data = slides[i];
    const slide = pptx.addSlide();

    switch (data.layout) {
      case 'cover':
        renderCoverSlide(slide, data);
        break;
      case 'divider':
        renderDividerSlide(slide, data);
        break;
      case 'closing':
        renderClosingSlide(slide, data);
        break;
      case 'detail':
        await renderDetailSlide(slide, data);
        break;
      default:
        await renderReportSlide(slide, data);
    }

    addFooter(slide, i + 1);
  }

  await pptx.writeFile({ fileName: `${filenameBase}.pptx` });
}

export { FONT_FACE, FONT_FACE_FALLBACK };
