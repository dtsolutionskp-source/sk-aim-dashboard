import { useCallback, useState } from 'react';
import type { ReportFormat } from '../types/report';
import type { PerformanceReportSlide } from '../reports/performanceReportSlides';

interface UseReportExportOptions {
  buildHtml: () => string;
  buildPerformanceSlides?: () => PerformanceReportSlide[];
  filenameBase: string;
  title: string;
  landscape?: boolean;
}

export function useReportExport({
  buildHtml,
  buildPerformanceSlides,
  filenameBase,
  title,
  landscape = false,
}: UseReportExportOptions) {
  const [exporting, setExporting] = useState<ReportFormat | null>(null);

  const handleExport = useCallback(
    async (format: ReportFormat) => {
      if (exporting) return;

      setExporting(format);
      try {
        const reportExport = await import('./reportExport');
        const html = buildHtml();
        const slides = reportExport.htmlToSlides(html, title);
        const performanceSlides = buildPerformanceSlides?.();
        await reportExport.exportReport(format, {
          html,
          filenameBase,
          title,
          slides,
          performanceSlides,
          landscape,
        });
      } catch (error) {
        const { buildExportErrorMessage } = await import('./reportExport');
        window.alert(buildExportErrorMessage(error));
      } finally {
        setExporting(null);
      }
    },
    [buildHtml, buildPerformanceSlides, exporting, filenameBase, landscape, title],
  );

  return { exporting, handleExport };
}
