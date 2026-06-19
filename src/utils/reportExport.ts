import type { ReportFormat } from '../types/report';
import type { PerformanceReportSlide } from '../reports/performanceReportSlides';
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
  performanceSlides?: PerformanceReportSlide[];
  landscape?: boolean;
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
  await new Promise((resolve) => setTimeout(resolve, 800));
}

async function renderHtmlInFrame(html: string, width = '1123px'): Promise<HTMLIFrameElement> {
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
  await waitForDocumentFonts(doc);

  const images = doc.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        }),
    ),
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
  return iframe;
}

async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** 가로 슬라이드별 PDF (A4 landscape) */
export async function exportLandscapeSlidesPdf({ html, filenameBase }: ExportReportOptions) {
  assertBrowser();
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const iframe = await renderHtmlInFrame(html, '1123px');
  const doc = iframe.contentDocument;
  const slideEls = doc?.querySelectorAll('.slide-page');

  if (!slideEls?.length) {
    document.body.removeChild(iframe);
    throw new Error('슬라이드를 찾을 수 없습니다.');
  }

  try {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slideEls.length; i++) {
      const el = slideEls[i] as HTMLElement;
      const w = el.offsetWidth || 1123;
      const h = el.offsetHeight || 632;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h,
        onclone: (clonedDoc) => {
          clonedDoc.body.style.fontFamily = "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const imgRatio = canvas.width / canvas.height;
      const pageRatio = pageWidth / pageHeight;

      let renderW: number;
      let renderH: number;
      let offsetX: number;
      let offsetY: number;

      if (imgRatio > pageRatio) {
        renderW = pageWidth;
        renderH = pageWidth / imgRatio;
        offsetX = 0;
        offsetY = (pageHeight - renderH) / 2;
      } else {
        renderH = pageHeight;
        renderW = pageHeight * imgRatio;
        offsetX = (pageWidth - renderW) / 2;
        offsetY = 0;
      }

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, renderW, renderH);
    }

    pdf.save(`${filenameBase}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
}

/** 세로 문서 PDF (만족도 조사 등) */
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

type PptSlide = ReturnType<import('pptxgenjs').default['addSlide']>;

async function getImageDimensions(base64: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = base64;
  });
}

function fitImageInBox(
  naturalW: number,
  naturalH: number,
  maxW: number,
  maxH: number,
): { w: number; h: number } {
  const ratio = naturalW / naturalH;
  let w = maxW;
  let h = maxW / ratio;
  if (h > maxH) {
    h = maxH;
    w = maxH * ratio;
  }
  return { w, h };
}

async function addSlideImageFit(
  slide: PptSlide,
  src: string,
  x: number,
  y: number,
  maxW: number,
  maxH: number,
  variant?: string,
) {
  const base64 = await imageUrlToBase64(src);
  const { w: nw, h: nh } = await getImageDimensions(base64);
  const isNotification = variant === 'notification';
  const boxMaxW = isNotification ? Math.min(maxW, 1.15) : maxW;
  const boxMaxH = isNotification ? Math.min(maxH, 3.2) : maxH;
  const { w, h } = fitImageInBox(nw, nh, boxMaxW, boxMaxH);
  const offsetX = x + (maxW - w) / 2;
  slide.addImage({ data: base64, x: offsetX, y, w, h });
  return { w, h };
}

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
  slide.addShape('rect', {
    x: 0.5,
    y: 1.05,
    w: 9,
    h: 0.03,
    fill: { color: '191F28' },
    line: { color: '191F28', width: 0 },
  });
}

function addSlideSummary(slide: PptSlide, summary: string[] | undefined, y = 1.25) {
  if (!summary?.length) return;
  if (summary.length === 0) return;
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

function addSlideTable(
  slide: PptSlide,
  rows: { label: string; value: string }[],
  x: number,
  y: number,
  w: number,
) {
  if (rows.length === 0) return;
  const allEmpty = rows.every((r) => !r.value);
  const lines = allEmpty
    ? rows.map((r) => `• ${r.label}`)
    : rows.map((r) => `${r.label}  ${r.value}`);

  slide.addText(lines.join('\n'), {
    x,
    y,
    w,
    h: Math.min(2.5, 0.28 * lines.length + 0.2),
    fontSize: 11,
    color: '4E5968',
    fontFace: 'Malgun Gothic',
    valign: 'top',
  });
}

/** 성과 리포트 PT (16:9) */
export async function exportPerformanceReportPpt({
  performanceSlides,
  filenameBase,
  title,
}: ExportReportOptions) {
  assertBrowser();
  if (!performanceSlides?.length) {
    throw new Error('슬라이드 데이터가 없습니다.');
  }

  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.author = festivalInfo.organizer;
  pptx.title = title;
  pptx.layout = 'LAYOUT_16x9';

  for (const data of performanceSlides) {
    const slide = pptx.addSlide();
    slide.addShape('rect', {
      x: 0,
      y: 0,
      w: 10,
      h: 0.06,
      fill: { color: 'F47725' },
      line: { color: 'F47725', width: 0 },
    });

    if (data.sectionLabel && data.layout !== 'cover' && data.layout !== 'divider') {
      slide.addText(data.sectionLabel, {
        x: 0.55,
        y: 0.2,
        w: 4,
        h: 0.25,
        fontSize: 10,
        color: 'F47725',
        fontFace: 'Malgun Gothic',
      });
    }

    if (data.layout === 'cover') {
      slide.addText('SK AIM · 성과 분석 보고서', {
        x: 0.6,
        y: 1.0,
        w: 8,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: 'F47725',
        fontFace: 'Malgun Gothic',
      });
      slide.addText(data.title.replace('\n', ' '), {
        x: 0.6,
        y: 1.55,
        w: 8.8,
        h: 1.4,
        fontSize: 30,
        bold: true,
        color: '191F28',
        fontFace: 'Malgun Gothic',
      });
      addSlideSummary(slide, data.summary, 3.1);
    } else if (data.layout === 'divider') {
      slide.background = { color: '191F28' };
      slide.addText(data.sectionLabel ?? '', {
        x: 0.5,
        y: 1.2,
        w: 9,
        h: 1.2,
        fontSize: 64,
        bold: true,
        color: 'F47725',
        align: 'center',
        fontFace: 'Malgun Gothic',
      });
      slide.addText(data.title, {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        fontFace: 'Malgun Gothic',
      });
      if (data.summary?.[0]) {
        slide.addText(data.summary[0], {
          x: 1.2,
          y: 3.4,
          w: 7.6,
          h: 0.6,
          fontSize: 14,
          color: 'ADB5BD',
          align: 'center',
          fontFace: 'Malgun Gothic',
        });
      }
    } else {
      addSlideTitle(slide, data.title.replace('\n', ' '));

      if (data.layout === 'section') {
        addSlideSummary(slide, data.summary, 1.2);
        addSlideTable(slide, data.table ?? [], 5.2, 1.2, 4.2);
      } else if (data.layout === 'marketing-summary') {
        addSlideSummary(slide, data.summary, 1.15);
        addSlideTable(slide, data.table ?? [], 5.2, 1.15, 4.2);
        const imgs = data.images ?? [];
        const slotW = 0.95;
        const startX = 0.55 + (9 - imgs.length * slotW) / 2;
        for (let i = 0; i < Math.min(imgs.length, 6); i++) {
          try {
            const { h } = await addSlideImageFit(
              slide,
              imgs[i].src,
              startX + i * slotW,
              3.35,
              slotW - 0.08,
              1.65,
              imgs[i].variant,
            );
            slide.addText(imgs[i].caption, {
              x: startX + i * slotW,
              y: 3.35 + h + 0.04,
              w: slotW - 0.08,
              h: 0.35,
              fontSize: 6,
              color: '6B7684',
              align: 'center',
              fontFace: 'Malgun Gothic',
            });
          } catch {
            /* skip missing image */
          }
        }
      } else if (data.layout === 'marketing') {
        addSlideSummary(slide, data.summary, 1.15);
        addSlideTable(slide, data.table ?? [], 0.55, 2.0, 3.8);
        const imgs = data.images ?? [];
        for (let i = 0; i < Math.min(imgs.length, 4); i++) {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 4.6 + col * 2.65;
          const y = 1.15 + row * 2.05;
          const maxW = 2.5;
          const maxH = imgs[i].variant === 'notification' ? 3.0 : 1.85;
          try {
            const { h } = await addSlideImageFit(slide, imgs[i].src, x, y, maxW, maxH, imgs[i].variant);
            slide.addText(imgs[i].caption, {
              x,
              y: y + h + 0.04,
              w: maxW,
              h: 0.22,
              fontSize: 8,
              color: '6B7684',
              align: 'center',
              fontFace: 'Malgun Gothic',
            });
          } catch {
            slide.addText(imgs[i].caption, { x, y: y + 0.8, w: maxW, h: 0.3, fontSize: 9, color: '9AA3AD' });
          }
        }
      } else if (data.layout === 'detail') {
        const merged = [...(data.insights ?? []), ...(data.recommendations ?? [])];
        if (merged.length) {
          slide.addText(`분석·제언  ${merged.join(' · ')}`, {
            x: 0.55,
            y: 1.15,
            w: 8.9,
            h: 0.55,
            fontSize: 9.5,
            color: '333D4B',
            fontFace: 'Malgun Gothic',
            valign: 'top',
          });
        }
        if (data.charts?.length) {
          const chartLines = data.charts.flatMap((c) => [
            `[${c.title}]`,
            ...c.items.slice(0, 5).map((item) => `  ${item.label}: ${item.unit ?? `${item.value}${c.unit ?? '%'}`}`),
          ]);
          slide.addText(chartLines.join('\n'), {
            x: 0.55,
            y: 2.5,
            w: 8.9,
            h: 2.6,
            fontSize: 10,
            color: '4E5968',
            fontFace: 'Malgun Gothic',
            valign: 'top',
          });
        }
        if (data.table?.length) {
          addSlideTable(slide, data.table, 0.55, 5.0, 4.5);
        }
      }
    }

    slide.addText(festivalInfo.organizer, {
      x: 0.5,
      y: 5.35,
      w: 5,
      h: 0.25,
      fontSize: 9,
      color: '9AA3AD',
      fontFace: 'Malgun Gothic',
    });
  }

  await pptx.writeFile({ fileName: `${filenameBase}.pptx` });
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
      if (options.performanceSlides?.length) {
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
      const title = el.querySelector('.slide-title')?.textContent?.trim() || `슬라이드 ${index + 1}`;
      const bullets = Array.from(el.querySelectorAll('.slide-summary li'))
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
