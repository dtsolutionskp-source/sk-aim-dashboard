import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { buildPerformanceReportDocument } from './buildPerformanceReportDocument';
import {
  runLayoutFixInDocument,
  setLayoutDebugMode,
  validateExportLayout,
  type LayoutValidationIssue,
} from './layout/layoutFix';
import { getSlideElementsFromDocument } from './captureSlides';
import { applyExportTypography, ensureReportFontsLoaded } from './typography/reportTypography';
import { ReportRenderContext, type ExportSource } from './reportRenderTypes';

export type { ExportSource } from './reportRenderTypes';

export function ReportRenderProvider({ children }: { children: ReactNode }) {
  const html = useMemo(() => buildPerformanceReportDocument(), []);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [slideCount, setSlideCount] = useState(0);
  const [validationIssues, setValidationIssues] = useState<LayoutValidationIssue[]>([]);
  const [debugMode, setDebugModeState] = useState(false);

  const syncDeckState = useCallback(async (iframe: HTMLIFrameElement, debug: boolean) => {
    const doc = iframe.contentDocument;
    if (!doc) return;

    await doc.fonts?.ready;
    await ensureReportFontsLoaded(doc);
    await runLayoutFixInDocument(doc);
    applyExportTypography(doc);
    setLayoutDebugMode(doc, debug);

    const slides = getSlideElementsFromDocument(doc);
    setSlideCount(slides.length);
    setValidationIssues(validateExportLayout(doc));
    setIsReady(slides.length > 0);

    iframe.style.height = `${slides.length * (632 + 16) + 32}px`;
  }, []);

  const onDeckLoaded = useCallback(
    async (iframe: HTMLIFrameElement) => {
      iframeRef.current = iframe;
      await syncDeckState(iframe, debugMode);
    },
    [debugMode, syncDeckState],
  );

  const setDebugMode = useCallback((enabled: boolean) => {
    setDebugModeState(enabled);
    const iframe = iframeRef.current;
    if (iframe?.contentDocument) {
      setLayoutDebugMode(iframe.contentDocument, enabled);
      setValidationIssues(validateExportLayout(iframe.contentDocument));
    }
  }, []);

  const prepareExportSource = useCallback(async (): Promise<ExportSource> => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument || !iframe.contentWindow) {
      throw new Error('보고서 미리보기가 준비되지 않았습니다. 미리보기 로딩 후 다운로드해 주세요.');
    }

    await syncDeckState(iframe, debugMode);

    const issues = validateExportLayout(iframe.contentDocument);
    const errors = issues.filter((i) => i.severity === 'error');
    if (errors.length > 0) {
      console.warn('[Export 검증]', errors);
    }

    return {
      document: iframe.contentDocument,
      window: iframe.contentWindow,
      iframe,
    };
  }, [debugMode, syncDeckState]);

  const value = useMemo(
    () => ({
      html,
      isReady,
      slideCount,
      validationIssues,
      debugMode,
      setDebugMode,
      onDeckLoaded,
      prepareExportSource,
    }),
    [
      html,
      isReady,
      slideCount,
      validationIssues,
      debugMode,
      setDebugMode,
      onDeckLoaded,
      prepareExportSource,
    ],
  );

  return <ReportRenderContext.Provider value={value}>{children}</ReportRenderContext.Provider>;
}
