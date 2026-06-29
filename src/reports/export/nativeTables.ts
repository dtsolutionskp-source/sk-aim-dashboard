import type { ReportTableSpec } from '../reportTableTypes';
import { SK } from './exportTheme';
import { drawPdfTextInBox } from './pdfFontLoader';

const MAX_ROWS = 8;
const HEADER_H_MM = 5.5;
const ROW_H_MM = 4.8;

export function tableHeightMm(rowCount: number, hasTitle: boolean): number {
  const rows = Math.min(rowCount, MAX_ROWS);
  return (hasTitle ? 5 : 0) + HEADER_H_MM + rows * ROW_H_MM + 1;
}

/** PDF 표 렌더 — 헤더 연회색, 핵심 수치 오렌지 */
export function drawTablePdf(
  pdf: import('jspdf').jsPDF,
  table: ReportTableSpec,
  x: number,
  y: number,
  w: number,
  maxRows = MAX_ROWS,
): number {
  const rows = table.rows.slice(0, maxRows);
  const cols = table.headers.length;
  const colW = w / cols;
  let cy = y;

  if (table.title) {
    drawPdfTextInBox(pdf, table.title, x, cy, w, 8, { bold: true, color: SK.textSub });
    cy += 4.5;
  }

  pdf.setFillColor(240, 242, 245);
  pdf.rect(x, cy, w, HEADER_H_MM, 'F');
  pdf.setDrawColor(229, 232, 235);
  pdf.setLineWidth(0.15);
  pdf.rect(x, cy, w, HEADER_H_MM, 'S');

  table.headers.forEach((h, i) => {
    if (i > 0) pdf.line(x + i * colW, cy, x + i * colW, cy + HEADER_H_MM);
    drawPdfTextInBox(pdf, h, x + i * colW + 0.8, cy + 1.2, colW - 1.6, 6.5, {
      bold: true,
      color: SK.textSub,
      align: 'center',
    });
  });
  cy += HEADER_H_MM;

  rows.forEach((row, ri) => {
    if (ri % 2 === 1) {
      pdf.setFillColor(250, 251, 252);
      pdf.rect(x, cy, w, ROW_H_MM, 'F');
    }
    pdf.rect(x, cy, w, ROW_H_MM, 'S');
    row.cells.forEach((cell, ci) => {
      if (ci > 0) pdf.line(x + ci * colW, cy, x + ci * colW, cy + ROW_H_MM);
      const highlight = row.highlightCol === ci;
      drawPdfTextInBox(pdf, cell, x + ci * colW + 0.8, cy + 1.2, colW - 1.6, 6.5, {
        bold: highlight,
        color: highlight ? SK.orange : SK.text,
        align: 'center',
      });
    });
    cy += ROW_H_MM;
  });

  return cy - y;
}

type PptSlide = ReturnType<import('pptxgenjs').default['addSlide']>;

/** PPT 표 렌더 */
export function addTablePpt(
  slide: PptSlide,
  table: ReportTableSpec,
  x: number,
  y: number,
  w: number,
  fontFace: string,
  maxRows = MAX_ROWS,
): number {
  const rows = table.rows.slice(0, maxRows);
  const colCount = table.headers.length;
  const colW = Array(colCount).fill(w / colCount) as number[];
  const rowH = 0.22;

  let tableY = y;
  if (table.title) {
    slide.addText(table.title, {
      x,
      y: tableY,
      w,
      h: 0.2,
      fontSize: 8,
      bold: true,
      color: SK.textSub,
      fontFace,
      valign: 'middle',
    });
    tableY += 0.22;
  }

  const headerRow = table.headers.map((h) => ({
    text: h,
    options: {
      fill: { color: 'F0F2F5' },
      color: SK.textSub,
      bold: true,
      align: 'center' as const,
      fontSize: 7,
      fontFace,
      border: { type: 'solid' as const, color: 'E5E8EB', pt: 0.5 },
    },
  }));

  const bodyRows = rows.map((row, ri) =>
    row.cells.map((cell, ci) => {
      const highlight = row.highlightCol === ci;
      return {
        text: cell,
        options: {
          fill: { color: ri % 2 === 1 ? 'FAFBFC' : SK.white },
          color: highlight ? SK.orange : SK.text,
          bold: highlight,
          align: 'center' as const,
          fontSize: 7,
          fontFace,
          border: { type: 'solid' as const, color: 'E5E8EB', pt: 0.5 },
        },
      };
    }),
  );

  slide.addTable([headerRow, ...bodyRows], {
    x,
    y: tableY,
    w,
    colW,
    rowH,
    margin: 0,
    autoPage: false,
  });

  return tableY + rowH * (1 + rows.length) - y + 0.05;
}
