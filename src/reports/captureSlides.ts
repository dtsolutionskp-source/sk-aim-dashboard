import type { ExportSource } from './reportRenderTypes';
import { runLayoutFixInDocument } from './layout/layoutFix';
import { REPORT_PAGE } from './layout/constants';
import {
  applyExportTypography,
  ensureReportFontsLoaded,
  injectTypographyStyles,
} from './typography/reportTypography';

/** Preview DOM → PNG (PDF/PPT 공통 캡처) */
export async function captureSlideElements(
  slideEls: HTMLElement[],
  ownerWindow?: Window | null,
): Promise<string[]> {
  const { default: html2canvas } = await import('html2canvas');
  const images: string[] = [];

  for (const slideEl of slideEls) {
    const w = slideEl.offsetWidth || REPORT_PAGE.width;
    const h = slideEl.offsetHeight || REPORT_PAGE.height;

    const canvas = await html2canvas(slideEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      scrollX: 0,
      scrollY: 0,
      ...(ownerWindow ? { window: ownerWindow } : {}),
      onclone: (_clonedDoc, clonedEl) => {
        const clonedDoc = clonedEl.ownerDocument;
        clonedDoc.documentElement.classList.remove('report-debug');
        clonedDoc.querySelectorAll('.rpt-debug-label').forEach((n) => n.remove());
        injectTypographyStyles(clonedDoc);
        applyExportTypography(clonedDoc);
      },
    });

    const dataUrl = canvas.toDataURL('image/png');
    if (await isMostlyBlankImage(dataUrl)) {
      throw new Error(
        `슬라이드 캡처에 실패했습니다 (${slideEl.getAttribute('data-slide-id') ?? 'unknown'}). 미리보기를 새로고침 후 다시 시도해 주세요.`,
      );
    }
    images.push(dataUrl);
  }

  return images;
}

export function getSlideElementsFromDocument(doc: Document): HTMLElement[] {
  return Array.from(doc.querySelectorAll('.slide-page')) as HTMLElement[];
}

/** 미리보기 iframe DOM을 1:1 크기로 복제해 캡처 (transform/scale · 폰트 차이 제거) */
export async function captureSlidesFromExportSource(source: ExportSource): Promise<string[]> {
  const captureFrame = await mountCaptureFrame(source);
  try {
    const slideEls = getSlideElementsFromDocument(captureFrame.document);
    if (!slideEls.length) {
      throw new Error('캡처할 슬라이드를 찾을 수 없습니다.');
    }
    return await captureSlideElements(slideEls, captureFrame.window);
  } finally {
    captureFrame.cleanup();
  }
}

interface CaptureFrame {
  document: Document;
  window: Window;
  cleanup: () => void;
}

async function mountCaptureFrame(source: ExportSource): Promise<CaptureFrame> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'position:fixed;left:-12000px;top:0;width:1123px;height:24000px;border:0;opacity:0;pointer-events:none;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    document.body.removeChild(iframe);
    throw new Error('캡처용 프레임을 만들지 못했습니다.');
  }

  doc.open();
  doc.write(source.document.documentElement.outerHTML);
  doc.close();

  await ensureReportFontsLoaded(doc);
  await runLayoutFixInDocument(doc);
  applyExportTypography(doc);
  await new Promise((r) => setTimeout(r, 80));

  return {
    document: doc,
    window: win,
    cleanup: () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    },
  };
}

async function isMostlyBlankImage(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const sampleW = Math.min(img.width, 120);
      const sampleH = Math.min(img.height, 80);
      const canvas = document.createElement('canvas');
      canvas.width = sampleW;
      canvas.height = sampleH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }
      ctx.drawImage(img, 0, 0, sampleW, sampleH);
      const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data;
      let contentPixels = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const a = pixels[i + 3];
        if (a < 16) continue;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        if (r < 248 || g < 248 || b < 248) {
          contentPixels++;
        }
      }
      resolve(contentPixels < 8);
    };
    img.onerror = () => resolve(true);
    img.src = dataUrl;
  });
}
