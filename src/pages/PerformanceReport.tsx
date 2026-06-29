import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, Sparkles, Image } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import { Card } from '../components/ui';
import { festivalInfo, reportSections, aiInsights } from '../data/mockData';
import { PERFORMANCE_REPORT_FILENAME_BASE } from '../reports/buildPerformanceReportDocument';
import { ReportRenderProvider } from '../reports/ReportRenderContext';
import PerformanceReportLayoutPreview from '../components/PerformanceReportLayoutPreview';
import { useReportExport } from '../utils/useReportExport';
import type { ReportFormat } from '../types/report';

const downloadFormats: { label: string; sub: string; format: ReportFormat }[] = [
  { label: 'PDF', sub: '가로 PT', format: 'pdf' },
  { label: 'PPT', sub: '16:9 슬라이드', format: 'ppt' },
];

const attachImages = [
  { title: '홍보 푸쉬 이미지', desc: '축제 개막 안내 푸쉬', type: 'push' },
  { title: '설문 푸쉬 이미지', desc: '방문 후 설문 독려', type: 'survey' },
];

export default function PerformanceReport() {
  return (
    <ReportRenderProvider>
      <PerformanceReportPage />
    </ReportRenderProvider>
  );
}

function PerformanceReportPage() {
  const reportTitle = useMemo(
    () => `${festivalInfo.name} 성과 분석 보고서`,
    [],
  );
  const { exporting, handleExport } = useReportExport({
    filenameBase: PERFORMANCE_REPORT_FILENAME_BASE,
    title: reportTitle,
    landscape: true,
  });

  return (
    <>
      <PageHeader
        title="성과 리포트"
        description="공공기관 제출용 보고서를 자동 생성합니다"
        breadcrumb="성과 리포트"
      />
      <PageContent>
        {/* Report header banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-sk-gray-200/80 bg-white shadow-card"
        >
          <div className="gradient-sk px-6 py-1" />
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sk-orange">자동 생성 보고서</p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-sk-gray-800 sm:text-2xl">
                {festivalInfo.name} 성과 분석 보고서
              </h3>
              <p className="mt-1.5 text-sm text-sk-gray-500">
                {festivalInfo.period} · {festivalInfo.organizer}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              생성 완료
            </div>
          </div>
        </motion.div>

        {/* Download buttons */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-2">
          {downloadFormats.map((dl, i) => {
            const isLoading = exporting === dl.format;
            return (
              <motion.button
                key={dl.format}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: exporting ? 0 : -2 }}
                whileTap={{ scale: exporting ? 1 : 0.98 }}
                disabled={Boolean(exporting)}
                onClick={() => handleExport(dl.format)}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-sk-gray-200/80 bg-white px-4 py-5 shadow-card transition-all hover:border-sk-orange/25 hover:shadow-card-hover disabled:cursor-wait disabled:opacity-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sk-gray-25 text-sk-gray-600 transition-colors group-hover:gradient-sk group-hover:text-white">
                  <Download className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-sk-gray-800">
                    {isLoading ? '생성 중…' : dl.label}
                  </p>
                  <p className="text-[11px] text-sk-gray-400">{dl.sub}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <Card title="보고서 목차" subtitle="자동 생성된 보고서 구성">
              <div className="space-y-1.5">
                {reportSections.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-sk-gray-25"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sk-gray-100 text-xs font-bold text-sk-gray-600">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-sk-gray-700">{section.title}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="첨부 이미지" subtitle="보고서에 자동 삽입">
            <div className="space-y-3">
              {attachImages.map((img, idx) => (
                <motion.div
                  key={img.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.01 }}
                  className="overflow-hidden rounded-xl border border-sk-gray-200/80 bg-white shadow-sm"
                >
                  <div className="relative flex h-24 items-center justify-center bg-sk-gray-800">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.03) 19px, rgba(255,255,255,0.03) 20px)',
                      }}
                    />
                    {img.type === 'aerial' ? (
                      <div className="grid grid-cols-3 gap-1 p-3">
                        {['A1', 'A2', 'A3', 'B1', 'B2', 'B3'].map((z) => (
                          <div
                            key={z}
                            className="flex h-6 w-8 items-center justify-center rounded bg-sk-orange/40 text-[8px] font-bold text-white"
                          >
                            {z}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mx-4 w-full max-w-[140px] rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded bg-sk-orange/60" />
                          <div className="flex-1 space-y-1">
                            <div className="h-1.5 w-full rounded-full bg-white/30" />
                            <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
                          </div>
                        </div>
                      </div>
                    )}
                    <Image className="absolute right-2 top-2 h-3.5 w-3.5 text-white/30" />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-sk-gray-800">{img.title}</p>
                    <p className="text-xs text-sk-gray-400">{img.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="AI 인사이트 및 개선 제안">
            <div className="grid gap-4 sm:grid-cols-2">
              {aiInsights.map((insight, idx) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-xl border border-sk-gray-200/80 bg-sk-gray-25 p-5"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sk-orange" />
                    <h4 className="font-semibold text-sk-gray-800">{insight.title}</h4>
                  </div>
                  <p className="mt-2.5 text-sm leading-[1.7] text-sk-gray-600">{insight.content}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-sk-orange" />
            <h3 className="text-base font-bold text-sk-gray-800">보고서 미리보기</h3>
          </div>
          <PerformanceReportLayoutPreview />
        </div>
      </PageContent>
    </>
  );
}
