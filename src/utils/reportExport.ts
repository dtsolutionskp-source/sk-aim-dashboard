import type { ReportFormat } from '../types/report';

interface ReportSlide {
  title: string;
  bullets: string[];
}

interface ExportReportOptions {
  html: string;
  filenameBase: string;
  title: string;
  slides: ReportSlide[];
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

async function waitForDocumentFonts(doc: Document) {
  await doc.fonts?.ready;
  await new Promise((resolve) => setTimeout(resolve, 400));
}

async function renderHtmlInFrame(html: string): Promise<HTMLIFrameElement> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.left = '-10000px';
  iframe.style.top = '0';
  iframe.style.width = '794px';
  iframe.style.height = '1123px';
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
  await waitForDocumentFonts(doc);
  return iframe;
}

export async function exportReportPdf({ html, filenameBase }: ExportReportOptions) {
  assertBrowser();
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const iframe = await renderHtmlInFrame(html);
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

export function exportReportPrint({ html, title }: ExportReportOptions) {
  assertBrowser();
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1200');
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
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword;charset=utf-8',
  });
  triggerDownload(blob, `${filenameBase}.doc`);
}

function toRtfUnicode(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code > 127) {
        return `\\u${code}?`;
      }
      if (char === '\\') return '\\\\';
      if (char === '{') return '\\{';
      if (char === '}') return '\\}';
      return char;
    })
    .join('');
}

export function exportReportHwp({ filenameBase, slides, title }: ExportReportOptions) {
  const paragraphs = [
    `{\\b\\fs32 ${toRtfUnicode(title)}}\\par\\par`,
    ...slides.flatMap((slide) => [
      `{\\b\\fs26 ${toRtfUnicode(slide.title)}}\\par`,
      ...slide.bullets.map((bullet) => `\\bullet ${toRtfUnicode(bullet)}\\par`),
      '\\par',
    ]),
  ];

  const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Malgun Gothic;}}\\f0\\fs22\n${paragraphs.join('\n')}\n}`;
  const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
  triggerDownload(blob, `${filenameBase}.rtf`);
}

export async function exportReportPpt({ filenameBase, slides, title }: ExportReportOptions) {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.author = 'SK AIM';
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
  titleSlide.addText('SK AIM 자동 생성 보고서', {
    x: 0.6,
    y: 2.6,
    w: 8.8,
    h: 0.5,
    fontSize: 14,
    color: '6B7684',
    fontFace: 'Malgun Gothic',
  });

  slides.forEach((slide) => {
    const pptSlide = pptx.addSlide();
    pptSlide.addText(slide.title, {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.7,
      fontSize: 22,
      bold: true,
      color: '191F28',
      fontFace: 'Malgun Gothic',
    });
    pptSlide.addText(
      slide.bullets.map((bullet) => ({
        text: bullet,
        options: { bullet: true, breakLine: true },
      })),
      {
        x: 0.7,
        y: 1.3,
        w: 8.8,
        h: 4.8,
        fontSize: 14,
        color: '4E5968',
        fontFace: 'Malgun Gothic',
      },
    );
  });

  await pptx.writeFile({ fileName: `${filenameBase}.pptx` });
}

export async function exportReport(format: ReportFormat, options: ExportReportOptions) {
  assertBrowser();
  switch (format) {
    case 'pdf':
      await exportReportPdf(options);
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
    case 'ppt':
      await exportReportPpt(options);
      break;
    default:
      throw new Error(`지원하지 않는 형식입니다: ${format}`);
  }
}

export function stripHtmlToText(html: string): string {
  assertBrowser();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

export function htmlToSlides(html: string, fallbackTitle: string): ReportSlide[] {
  assertBrowser();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const sections = Array.from(doc.querySelectorAll('.section'));

  if (sections.length === 0) {
    return [{ title: fallbackTitle, bullets: [stripHtmlToText(html)] }];
  }

  return sections.map((section, index) => {
    const title =
      section.querySelector('.section-title')?.textContent?.replace(/^\d+/, '').trim() ||
      `섹션 ${index + 1}`;
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
  if (error instanceof Error) {
    return error.message;
  }
  return '보고서 출력 중 오류가 발생했습니다.';
}
