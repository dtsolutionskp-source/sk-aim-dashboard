import type { ReportFormat } from '../types/report';
import type { PerformanceReportSlide } from '../reports/performanceReportSlides';
import type { ExportSource } from '../reports/reportRenderTypes';
import { exportPerformanceReportNativePdf } from '../reports/export/performanceReportPdfExport';
import { exportPerformanceReportNativePpt } from '../reports/export/performanceReportPptExport';
import { festivalInfo } from '../data/mockData';

interface ReportSlide {
  title: string;
  bullets: string[];
}

export interface ExportReportOptions {
  html: string;
  filenameBase: string;
  title: string;
  slides: ReportSlide[];
  /** 성과 리포트 — 데이터 기반 Export 소스 */
  performanceSlides?: PerformanceReportSlide[];
  landscape?: boolean;
  /** @deprecated html2canvas fallback only */
  exportSource?: ExportSource;
}

function assertBrowser() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('보고서 출력은 브라우저에서만 사용할 수 있습니다.');
  }
}

function triggerDownload(blob: Blob, filename: string) {
  assertBrowser();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** @deprecated html2canvas 캡처 — 사용 중단 */
export async function exportLandscapeSlidesPdfFromSource(): Promise<void> {
  throw new Error('캡처 기반 PDF는 더 이상 지원하지 않습니다.');
}

/** @deprecated html2canvas 캡처 — 사용 중단 */
export async function exportPerformanceReportPptFromSource(): Promise<void> {
  throw new Error('캡처 기반 PPT는 더 이상 지원하지 않습니다.');
}

/** @deprecated 만족도 조사 등 세로 HTML export용 */
export async function renderReportPreviewFrame(
  html: string,
  width = '1123px',
): Promise<HTMLIFrameElement> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = width;
  iframe.style.height = '20000px';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error('보고서 렌더링에 실패했습니다.');
  }

  doc.open();
  doc.write(html);
  doc.close();
  await doc.fonts?.ready;
  await new Promise((resolve) => setTimeout(resolve, 600));

  const { runLayoutFixInDocument } = await import('../reports/layout/layoutFix');
  await runLayoutFixInDocument(doc);
  await new Promise((resolve) => setTimeout(resolve, 80));

  return iframe;
}

/** 성과 리포트 PDF — 데이터 기반 (jsPDF + Noto Sans KR) */
export async function exportLandscapeSlidesPdf({
  performanceSlides,
  filenameBase,
}: ExportReportOptions) {
  assertBrowser();
  if (!performanceSlides?.length) {
    throw new Error('슬라이드 데이터가 없습니다.');
  }
  await exportPerformanceReportNativePdf(performanceSlides, filenameBase);
}

/** 성과 리포트 PPT — 데이터 기반 (pptxgenjs addText) */
export async function exportPerformanceReportPpt({
  performanceSlides,
  filenameBase,
  title,
}: ExportReportOptions) {
  assertBrowser();
  if (!performanceSlides?.length) {
    throw new Error('슬라이드 데이터가 없습니다.');
  }
  await exportPerformanceReportNativePpt(performanceSlides, filenameBase, title);
}

/** 세로 문서 PDF (만족도 조사 등) — html2canvas 유지 */
export async function exportReportPdf({ html, filenameBase }: ExportReportOptions) {
  assertBrowser();
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const iframe = await renderReportPreviewFrame(html);
  const body = iframe.contentDocument?.body;

  if (!body) {
    document.body.removeChild(iframe);
    throw new Error('보고서 본문을 불러오지 못했습니다.');
  }

  try {
    const canvas = await html2canvas(body, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filenameBase}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}

type PptSlide = ReturnType<import('pptxgenjs').default['addSlide']>;

function addSlideTitle(slide: PptSlide, title: string) {
  slide.addText(title, {
    x: 0.5,
    y: 0.35,
    w: 9,
    h: 0.8,
    fontSize: 24,
    bold: true,
    color: '191F28',
    fontFace: 'Malgun Gothic',
  });
}

function addSlideSummary(slide: PptSlide, summary: string[] | undefined, y = 1.25) {
  if (!summary?.length) return;
  slide.addText(
    summary.map((line) => ({ text: line, options: { bullet: true, breakLine: true } })),
    {
      x: 0.55,
      y,
      w: 8.9,
      h: 2.2,
      fontSize: 13,
      color: '4E5968',
      fontFace: 'Malgun Gothic',
    },
  );
}

/** 만족도 조사 등 일반 PPT */
export async function exportReportPpt({ filenameBase, slides, title }: ExportReportOptions) {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.author = festivalInfo.organizer;
  pptx.title = title;

  const titleSlide = pptx.addSlide();
  titleSlide.addText(title, {
    x: 0.6,
    y: 1.4,
    w: 8.8,
    h: 1.2,
    fontSize: 28,
    bold: true,
    color: '191F28',
    fontFace: 'Malgun Gothic',
  });

  slides.forEach((s) => {
    const pptSlide = pptx.addSlide();
    addSlideTitle(pptSlide, s.title);
    addSlideSummary(pptSlide, s.bullets, 1.25);
  });

  await pptx.writeFile({ fileName: `${filenameBase}.pptx` });
}

export function exportReportPrint({ html, title }: ExportReportOptions) {
  assertBrowser();
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');
  if (!printWindow) {
    throw new Error('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.');
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.document.title = title;
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

export function exportReportDoc({ html, filenameBase }: ExportReportOptions) {
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  triggerDownload(blob, `${filenameBase}.doc`);
}

export function exportReportHwp({ filenameBase, slides, title }: ExportReportOptions) {
  const toRtf = (text: string) =>
    text
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code > 127) return `\\u${code}?`;
        if (char === '\\') return '\\\\';
        if (char === '{') return '\\{';
        if (char === '}') return '\\}';
        return char;
      })
      .join('');

  const paragraphs = [
    `{\\b\\fs32 ${toRtf(title)}}\\par\\par`,
    ...slides.flatMap((s) => [
      `{\\b\\fs26 ${toRtf(s.title)}}\\par`,
      ...s.bullets.map((b) => `\\bullet ${toRtf(b)}\\par`),
      '\\par',
    ]),
  ];
  const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Malgun Gothic;}}\\f0\\fs22\n${paragraphs.join('\n')}\n}`;
  triggerDownload(new Blob([rtf], { type: 'application/rtf;charset=utf-8' }), `${filenameBase}.rtf`);
}

export async function exportReport(format: ReportFormat, options: ExportReportOptions) {
  assertBrowser();
  switch (format) {
    case 'pdf':
      if (options.landscape) {
        await exportLandscapeSlidesPdf(options);
      } else {
        await exportReportPdf(options);
      }
      break;
    case 'ppt':
      if (options.landscape && options.performanceSlides?.length) {
        await exportPerformanceReportPpt(options);
      } else {
        await exportReportPpt(options);
      }
      break;
    case 'print':
      exportReportPrint(options);
      break;
    case 'docx':
      exportReportDoc(options);
      break;
    case 'hwp':
      exportReportHwp(options);
      break;
    default:
      throw new Error(`지원하지 않는 형식입니다: ${format}`);
  }
}

export function stripHtmlToText(html: string): string {
  assertBrowser();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

export function htmlToSlides(html: string, fallbackTitle: string): ReportSlide[] {
  assertBrowser();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const slideEls = doc.querySelectorAll('.slide-page');
  if (slideEls.length > 0) {
    return Array.from(slideEls).map((el, index) => {
      const title =
        el.querySelector('.rpt-headline')?.textContent?.trim() ||
        el.querySelector('.cover-title')?.textContent?.trim() ||
        el.querySelector('.divider-title')?.textContent?.trim() ||
        `슬라이드 ${index + 1}`;
      const bullets = Array.from(el.querySelectorAll('.rpt-insight-item, .cover-meta li'))
        .map((li) => li.textContent?.trim() ?? '')
        .filter(Boolean);
      return { title, bullets: bullets.length ? bullets : [stripHtmlToText(el.innerHTML)] };
    });
  }

  const sections = Array.from(doc.querySelectorAll('.section'));
  if (sections.length === 0) {
    return [{ title: fallbackTitle, bullets: [stripHtmlToText(html)] }];
  }

  return sections.map((section, index) => {
    const title =
      section.querySelector('.section-title')?.textContent?.trim() || `섹션 ${index + 1}`;
    const bullets = Array.from(section.querySelectorAll('li, p'))
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean);
    return {
      title,
      bullets: bullets.length > 0 ? bullets : [stripHtmlToText(section.innerHTML)],
    };
  });
}

export function buildExportErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return '보고서 출력 중 오류가 발생했습니다.';
}
