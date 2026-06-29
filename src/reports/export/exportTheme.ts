/** PPT 16:9 슬라이드 (inch) */
export const SLIDE_W = 10;
export const SLIDE_H = 5.625;
export const MARGIN_X = 0.55;
export const CONTENT_W = SLIDE_W - MARGIN_X * 2;

/** PDF 슬라이드 (mm) — 1123×632px @96dpi */
export const PDF_W_MM = (1123 / 96) * 25.4;
export const PDF_H_MM = (632 / 96) * 25.4;
export const PDF_MX_MM = (MARGIN_X / SLIDE_W) * PDF_W_MM;

export const SK = {
  orange: 'F47725',
  red: 'EA002C',
  text: '191F28',
  textSub: '4E5968',
  textMuted: '9AA3AD',
  white: 'FFFFFF',
  bgWarm: 'FFF5EF',
  border: 'FFE0CC',
  dividerBg: '191F28',
} as const;

export const FONT_FACE = 'Noto Sans KR';
export const FONT_FACE_FALLBACK = 'Malgun Gothic';

/** text box height — fontSize(pt) × multiplier → inch (pptx) */
export function textBoxHIn(fontSizePt: number, multiplier = 1.6): number {
  return (fontSizePt * multiplier) / 72;
}

/** text box height → mm (jsPDF) */
export function textBoxHMm(fontSizePt: number, multiplier = 1.6): number {
  return textBoxHIn(fontSizePt, multiplier) * 25.4;
}

export function inToMm(inches: number): number {
  return inches * 25.4;
}

export function contentX(): number {
  return MARGIN_X;
}

export function contentW(): number {
  return CONTENT_W;
}
