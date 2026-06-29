import { useCallback, useState } from 'react';
import type { ReportFormat } from '../types/report';
import { buildStabilizedSlides } from '../reports/buildPerformanceReportDocument';

interface UseReportExportOptions {
  filenameBase: string;
  title: string;
  landscape?: boolean;
  /** 만족도 조사 등 세로 보고서용 */
  buildHtml?: () => string;
}

/** 성과 보고서: 데이터 기반 Export · 만족도: HTML 기반 */
export function useReportExport({
  filenameBase,
  title,
  landscape = false,
  buildHtml,
}: UseReportExportOptions) {
  const [exporting, setExporting] = useState<ReportFormat | null>(null);

  const handleExport = useCallback(
    async (format: ReportFormat) => {
      if (exporting) return;

      setExporting(format);
      try {
        const reportExport = await import('./reportExport');

        if (landscape) {
          const performanceSlides = buildStabilizedSlides();
          await reportExport.exportReport(format, {
            html: '',
            filenameBase,
            title,
            slides: [],
            landscape: true,
            performanceSlides,
          });
          return;
        }

        if (!buildHtml) {
          throw new Error('보고서 HTML 생성 함수가 필요합니다.');
        }

        const html = buildHtml();
        const slides = reportExport.htmlToSlides(html, title);

        await reportExport.exportReport(format, {
          html,
          filenameBase,
          title,
          slides,
          landscape: false,
        });
      } catch (error) {
        const { buildExportErrorMessage } = await import('./reportExport');
        window.alert(buildExportErrorMessage(error));
      } finally {
        setExporting(null);
      }
    },
    [buildHtml, exporting, filenameBase, landscape, title],
  );

  return { exporting, handleExport, isPreviewReady: true };
}
