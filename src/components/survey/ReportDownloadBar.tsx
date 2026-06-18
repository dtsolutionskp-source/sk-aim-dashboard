import { Download } from 'lucide-react';
import {
  buildSurveyReportDocument,
  SURVEY_REPORT_FILENAME_BASE,
} from '../../reports/buildSurveyReportDocument';
import type { ReportFormat } from '../../types/report';
import { useReportExport } from '../../utils/useReportExport';

const formats: { label: string; format: ReportFormat }[] = [
  { label: 'PDF', format: 'pdf' },
  { label: '인쇄', format: 'print' },
  { label: 'PPT', format: 'ppt' },
  { label: 'Word', format: 'docx' },
  { label: 'HWP', format: 'hwp' },
];

export function ReportDownloadBar() {
  const { exporting, handleExport } = useReportExport({
    buildHtml: buildSurveyReportDocument,
    filenameBase: SURVEY_REPORT_FILENAME_BASE,
    title: '축제 방문객 만족도 조사 결과 보고서',
  });

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((item) => (
        <button
          key={item.format}
          type="button"
          disabled={Boolean(exporting)}
          onClick={() => handleExport(item.format)}
          className="flex items-center gap-1.5 rounded-lg border border-sk-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-sk-gray-700 shadow-sm transition-all hover:border-sk-orange/30 hover:text-sk-orange disabled:cursor-wait disabled:opacity-60"
        >
          <Download className="h-3.5 w-3.5" />
          {exporting === item.format
            ? '생성 중…'
            : item.format === 'print'
              ? '인쇄'
              : `${item.label} 다운로드`}
        </button>
      ))}
    </div>
  );
}
