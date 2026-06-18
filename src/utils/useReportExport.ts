import { useCallback, useState } from 'react';
import type { ReportFormat } from '../types/report';

interface UseReportExportOptions {
  buildHtml: () => string;
  filenameBase: string;
  title: string;
}

export function useReportExport({ buildHtml, filenameBase, title }: UseReportExportOptions) {
  const [exporting, setExporting] = useState<ReportFormat | null>(null);

  const handleExport = useCallback(
    async (format: ReportFormat) => {
      if (exporting) return;

      setExporting(format);
      try {
        const reportExport = await import('./reportExport');
        const html = buildHtml();
        const slides = reportExport.htmlToSlides(html, title);
        await reportExport.exportReport(format, { html, filenameBase, title, slides });
      } catch (error) {
        const { buildExportErrorMessage } = await import('./reportExport');
        window.alert(buildExportErrorMessage(error));
      } finally {
        setExporting(null);
      }
    },
    [buildHtml, exporting, filenameBase, title],
  );

  return { exporting, handleExport };
}
