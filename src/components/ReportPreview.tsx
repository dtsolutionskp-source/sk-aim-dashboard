import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { festivalInfo } from '../data/mockData';
import { performanceReportPreview } from '../reports/buildPerformanceReportDocument';

const previewSections = [
  { num: '1', title: '마케팅 성과', desc: '푸쉬·배너 소재 이미지 및 채널별 클릭·노출 성과' },
  { num: '2', title: '데이터 분석', desc: '방문객 프로파일, 유입지역, 관심사, 체류·이동 패턴' },
  { num: '3', title: '만족도 조사', desc: '프로그램별 만족도, 인지경로, 경제효과, 재방문·NPS' },
];

export default function ReportPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-4 rounded-2xl bg-sk-gray-200/50" />
      <div className="absolute inset-2 rounded-2xl bg-sk-gray-100" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-sk-gray-200 bg-white shadow-elevated"
      >
        <div className="flex items-center justify-between border-b border-sk-gray-100 bg-sk-gray-25 px-6 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sk-orange" />
            <span className="text-xs font-medium text-sk-gray-500">보고서 미리보기</span>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10 sm:py-12">
          <div className="border-b-2 border-sk-gray-800 pb-6 text-center">
            <p className="text-xs tracking-widest text-sk-gray-400">{festivalInfo.organizer}</p>
            <h4 className="mt-3 text-xl font-bold tracking-tight text-sk-gray-800 sm:text-2xl">
              {festivalInfo.name}
            </h4>
            <p className="mt-1 text-base font-medium text-sk-gray-600">성과 분석 보고서</p>
            <p className="mt-3 text-sm text-sk-gray-400">{festivalInfo.period}</p>
          </div>

          <div className="mt-8">
            <h5 className="flex items-center gap-2 text-sm font-bold text-sk-gray-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sk-gray-800 text-xs text-white">요약</span>
              행사 성과 요약
            </h5>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-sk-gray-600">
              {performanceReportPreview.summaryLines.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-sk-orange">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h5 className="flex items-center gap-2 text-sm font-bold text-sk-gray-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sk-gray-800 text-xs text-white">★</span>
              핵심 성과 지표
            </h5>
            <div className="mt-4 overflow-hidden rounded-xl border border-sk-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sk-gray-200 bg-sk-gray-25">
                    <th className="px-4 py-2.5 text-left font-semibold text-sk-gray-600">지표</th>
                    <th className="px-4 py-2.5 text-right font-semibold text-sk-gray-600">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceReportPreview.kpis.map((kpi) => (
                    <tr key={kpi.label} className="border-b border-sk-gray-100 last:border-0">
                      <td className="px-4 py-3 text-sk-gray-600">{kpi.label}</td>
                      <td className="px-4 py-3 text-right font-bold text-sk-orange">{kpi.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {previewSections.map((section) => (
              <div key={section.num} className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 px-4 py-3">
                <p className="text-sm font-semibold text-sk-gray-800">
                  {section.num}. {section.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-sk-gray-500">{section.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border-l-2 border-sk-orange bg-sk-gray-25 px-4 py-3">
            <p className="text-[10px] font-semibold text-sk-gray-500">데이터 출처</p>
            <p className="mt-1 text-[11px] leading-relaxed text-sk-gray-500">
              {performanceReportPreview.dataSource}
            </p>
          </div>

          <div className="mt-10 border-t border-sk-gray-200 pt-6 text-center">
            <p className="text-[10px] text-sk-gray-400">
              {festivalInfo.organizer} · {festivalInfo.name} 성과 분석 보고서
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
