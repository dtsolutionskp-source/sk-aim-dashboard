import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Bug, CheckCircle2, Eye, Loader2 } from 'lucide-react';
import { useReportRender } from '../reports/useReportRender';

const SLIDE_WIDTH = 1123;
const SLIDE_HEIGHT = 632;
const SLIDE_GAP = 16;
const PREVIEW_SCALE = 0.48;

/** Single Source of Truth — Preview iframe = PDF/PPT export DOM */
export default function PerformanceReportLayoutPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const {
    html,
    isReady,
    slideCount,
    validationIssues,
    debugMode,
    setDebugMode,
    onDeckLoaded,
  } = useReportRender();

  const deckHeight = slideCount > 0 ? slideCount * (SLIDE_HEIGHT + SLIDE_GAP) + 32 : SLIDE_HEIGHT + 32;
  const scaledW = SLIDE_WIDTH * PREVIEW_SCALE;
  const scaledH = deckHeight * PREVIEW_SCALE;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = async () => {
      setLoading(true);
      try {
        await onDeckLoaded(iframe);
      } finally {
        setLoading(false);
      }
    };

    iframe.addEventListener('load', handleLoad);
    if (iframe.contentDocument?.readyState === 'complete') {
      void handleLoad();
    }

    return () => iframe.removeEventListener('load', handleLoad);
  }, [html, onDeckLoaded]);

  const errorCount = validationIssues.filter((i) => i.severity === 'error').length;
  const warnCount = validationIssues.filter((i) => i.severity === 'warn').length;

  return (
    <div className="overflow-hidden rounded-2xl border border-sk-gray-200/80 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sk-gray-100 bg-sk-gray-25 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-sk-orange" />
          <span className="text-sm font-semibold text-sk-gray-800">출력 미리보기</span>
          <span className="text-xs text-sk-gray-400">미리보기 참고용 · Export는 데이터 기반 생성</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setDebugMode(!debugMode)}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              debugMode
                ? 'border-sk-orange bg-sk-orange-light text-sk-orange'
                : 'border-sk-gray-200 bg-white text-sk-gray-600 hover:border-sk-gray-300'
            }`}
          >
            <Bug className="h-3.5 w-3.5" />
            Layout Debug
          </button>
          {!loading && isReady && (
            <span
              className={`flex items-center gap-1 text-xs ${errorCount === 0 ? 'text-emerald-600' : 'text-amber-600'}`}
            >
              {errorCount === 0 ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
              {errorCount === 0
                ? warnCount > 0
                  ? `Export 가능 · 경고 ${warnCount}건`
                  : 'Export 검증 통과'
                : `${errorCount}건 오류`}
              {' · '}
              {slideCount}페이지
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-sk-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          미리보기 생성 중…
        </div>
      )}

      <div
        className={`max-h-[72vh] overflow-auto bg-sk-gray-100 p-4 sm:p-6 ${loading ? 'hidden' : ''}`}
      >
        <div
          className="mx-auto overflow-hidden rounded border border-sk-gray-200 bg-white shadow-sm"
          style={{ width: scaledW, height: loading ? 0 : scaledH }}
        >
          <div
            style={{
              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: 'top left',
              width: SLIDE_WIDTH,
              height: deckHeight,
            }}
          >
            <iframe
              ref={iframeRef}
              srcDoc={html}
              title="성과 보고서 미리보기 (Export Source)"
              className="block border-0"
              style={{
                width: SLIDE_WIDTH,
                height: deckHeight,
                display: 'block',
              }}
            />
          </div>
        </div>
        {validationIssues.length > 0 && (
          <ul className="mx-auto mt-4 max-w-lg space-y-1 text-xs text-amber-700">
            {validationIssues.map((issue) => (
              <li key={`${issue.slideId}-${issue.message}-${issue.elementId ?? ''}`}>
                [{issue.slideId}] {issue.message}
                {issue.elementId ? ` (${issue.elementId})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
