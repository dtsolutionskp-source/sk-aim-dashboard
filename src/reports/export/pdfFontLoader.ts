import type { jsPDF } from 'jspdf';

/** 프로젝트에 포함된 Noto Sans KR TTF (Google Fonts) */
const NOTO_REGULAR_PATH = '/fonts/NotoSansKR-Regular.ttf';
const NOTO_BOLD_PATH = '/fonts/NotoSansKR-Bold.ttf';

/** CDN fallback — 로컬 파일 실패 시 */
const NOTO_REGULAR_CDN =
  'https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLQ.ttf';
const NOTO_BOLD_CDN =
  'https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzg01eLQ.ttf';

const FONT_FAMILY = 'NotoSansKR';

interface CachedFonts {
  regular: string;
  bold: string;
}

let cachedFonts: CachedFonts | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.byteLength; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFontBase64(primaryPath: string, fallbackUrl: string): Promise<string> {
  try {
    const res = await fetch(primaryPath);
    if (res.ok) {
      return arrayBufferToBase64(await res.arrayBuffer());
    }
  } catch {
    /* local path unavailable — try CDN */
  }

  const res = await fetch(fallbackUrl);
  if (!res.ok) {
    throw new Error(
      `한글 폰트(Noto Sans KR)를 불러오지 못했습니다. PDF 한글 출력을 위해 네트워크 또는 /public/fonts/ 파일을 확인해 주세요.`,
    );
  }
  return arrayBufferToBase64(await res.arrayBuffer());
}

async function getCachedFonts(): Promise<CachedFonts> {
  if (cachedFonts) return cachedFonts;

  const [regular, bold] = await Promise.all([
    loadFontBase64(NOTO_REGULAR_PATH, NOTO_REGULAR_CDN),
    loadFontBase64(NOTO_BOLD_PATH, NOTO_BOLD_CDN),
  ]);

  cachedFonts = { regular, bold };
  return cachedFonts;
}

/** jsPDF 문서마다 Noto Sans KR TTF embed (복사·검색 가능한 UTF-8 한글) */
export async function ensurePdfKoreanFont(pdf: jsPDF): Promise<void> {
  const fonts = await getCachedFonts();

  const regularVfs = `${FONT_FAMILY}-Regular.ttf`;
  const boldVfs = `${FONT_FAMILY}-Bold.ttf`;

  if (!pdf.existsFileInVFS(regularVfs)) {
    pdf.addFileToVFS(regularVfs, fonts.regular);
    pdf.addFont(regularVfs, FONT_FAMILY, 'normal');
  }

  if (!pdf.existsFileInVFS(boldVfs)) {
    pdf.addFileToVFS(boldVfs, fonts.bold);
    pdf.addFont(boldVfs, FONT_FAMILY, 'bold');
  }

  pdf.setFont(FONT_FAMILY, 'normal');
}

export function setPdfFont(pdf: jsPDF, bold = false): void {
  pdf.setFont(FONT_FAMILY, bold ? 'bold' : 'normal');
}

/** jsPDF text — box 중앙 배치 */
export function drawPdfTextInBox(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  w: number,
  fontSizePt: number,
  opts?: { bold?: boolean; align?: 'left' | 'center' | 'right'; color?: string },
): void {
  const h = ((fontSizePt * 1.6) / 72) * 25.4;
  setPdfFont(pdf, opts?.bold);

  if (opts?.color) {
    const rgb = opts.color.match(/.{2}/g)?.map((hex) => parseInt(hex, 16)) ?? [25, 31, 40];
    pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
  } else {
    pdf.setTextColor(25, 31, 40);
  }

  pdf.setFontSize(fontSizePt);
  const lines = pdf.splitTextToSize(text, w) as string[];
  const lineHeight = ((fontSizePt * 1.4) / 72) * 25.4;
  const blockH = lines.length * lineHeight;
  let textY = y + Math.max(fontSizePt * 0.35, (h - blockH) / 2 + fontSizePt * 0.35);

  lines.forEach((line) => {
    pdf.text(
      line,
      opts?.align === 'center' ? x + w / 2 : opts?.align === 'right' ? x + w : x,
      textY,
      { align: opts?.align ?? 'left' },
    );
    textY += lineHeight;
  });
}

/** Export 직후 검증용 — PDF 텍스트에 한글이 포함되는지 */
export function assertKoreanPdfTextSample(text: string): void {
  if (!/[\uAC00-\uD7AF]/.test(text)) {
    throw new Error('PDF 텍스트 샘플에 한글이 없습니다. 폰트 embed를 확인해 주세요.');
  }
}
