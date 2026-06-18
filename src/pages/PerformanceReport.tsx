import { Download, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import { Card } from '../components/ui';
import { festivalInfo, reportSections, aiInsights } from '../data/mockData';

const downloadFormats = [
  { label: 'PDF 다운로드', format: 'pdf', color: 'bg-red-500' },
  { label: 'PPT 다운로드', format: 'ppt', color: 'bg-orange-500' },
  { label: 'Word 다운로드', format: 'docx', color: 'bg-blue-500' },
  { label: 'HWP 다운로드', format: 'hwp', color: 'bg-sky-500' },
];

export default function PerformanceReport() {
  const handleDownload = (format: string) => {
    alert(`${format.toUpperCase()} 형식으로 보고서 다운로드를 시작합니다.\n(데모 버전에서는 실제 파일이 생성되지 않습니다.)`);
  };

  return (
    <>
      <PageHeader
        title="성과 리포트"
        description="공공기관 제출용 보고서를 자동 생성합니다"
        breadcrumb="성과 리포트"
      />
      <PageContent>
        <div className="rounded-xl border border-sk-orange/20 bg-gradient-to-r from-sk-orange-light/50 to-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sk-orange">자동 생성 보고서</p>
              <h3 className="mt-1 text-xl font-bold text-sk-gray-800">
                {festivalInfo.name} 성과 분석 보고서
              </h3>
              <p className="mt-1 text-sm text-sk-gray-500">
                {festivalInfo.period} · {festivalInfo.organizer}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              생성 완료
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {downloadFormats.map((dl) => (
            <button
              key={dl.format}
              onClick={() => handleDownload(dl.format)}
              className="flex items-center justify-center gap-2 rounded-xl border border-sk-gray-200 bg-white px-4 py-4 text-sm font-medium text-sk-gray-700 shadow-sm transition-all hover:border-sk-orange/30 hover:shadow-md"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${dl.color} text-white`}>
                <Download className="h-4 w-4" />
              </div>
              {dl.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card title="보고서 목차" subtitle="자동 생성된 보고서 구성">
              <div className="space-y-2">
                {reportSections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="flex items-center gap-3 rounded-lg border border-sk-gray-100 px-4 py-3 hover:bg-sk-gray-50"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sk-orange-light text-xs font-bold text-sk-orange">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-sk-gray-700">{section.title}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="첨부 이미지" subtitle="자동 삽입">
            <div className="space-y-3">
              {[
                { title: '홍보 푸쉬 이미지', gradient: 'from-orange-400 to-red-500' },
                { title: '설문 푸쉬 이미지', gradient: 'from-amber-400 to-orange-500' },
                { title: '항공뷰 분석 이미지', gradient: 'from-sky-400 to-blue-500' },
              ].map((img) => (
                <div key={img.title} className="overflow-hidden rounded-lg border border-sk-gray-200">
                  <div className={`flex h-20 items-center justify-center bg-gradient-to-br ${img.gradient}`}>
                    <FileText className="h-6 w-6 text-white/80" />
                  </div>
                  <p className="px-3 py-2 text-xs font-medium text-sk-gray-600">{img.title}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="AI 인사이트 및 개선 제안">
            <div className="grid gap-4 sm:grid-cols-2">
              {aiInsights.map((insight) => (
                <div key={insight.title} className="rounded-lg border border-sk-gray-100 bg-sk-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-sk-orange" />
                    <h4 className="font-semibold text-sk-gray-800">{insight.title}</h4>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-sk-gray-600">{insight.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-sk-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-sk-gray-800">보고서 미리보기</h3>
          <div className="mt-4 rounded-lg border border-sk-gray-200 bg-sk-gray-50 p-8">
            <div className="mx-auto max-w-2xl space-y-6 bg-white p-8 shadow-sm">
              <div className="border-b border-sk-gray-200 pb-4 text-center">
                <p className="text-xs text-sk-gray-400">{festivalInfo.organizer}</p>
                <h4 className="mt-2 text-xl font-bold text-sk-gray-800">
                  {festivalInfo.name} 성과 분석 보고서
                </h4>
                <p className="mt-1 text-sm text-sk-gray-500">{festivalInfo.period}</p>
              </div>

              <div>
                <h5 className="font-semibold text-sk-gray-800">1. 행사 개요</h5>
                <p className="mt-2 text-sm leading-relaxed text-sk-gray-600">
                  {festivalInfo.name}은(는) {festivalInfo.location}에서 개최되었으며, 총 23,060명이
                  방문하였습니다. SK AIM 플랫폼을 통해 홍보부터 방문 분석, 설문조사, 성과보고까지
                  통합 관리되었습니다.
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-sk-gray-800">2. 핵심 성과 요약</h5>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { label: '홍보 CTR', value: '15.0%' },
                    { label: '방문객 수', value: '23,060명' },
                    { label: '만족도', value: '4.3/5.0' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-lg bg-sk-orange-light p-3 text-center">
                      <p className="text-xs text-sk-gray-500">{kpi.label}</p>
                      <p className="mt-1 font-bold text-sk-orange">{kpi.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-sk-gray-800">3. AI 인사이트</h5>
                <p className="mt-2 text-sm leading-relaxed text-sk-gray-600">
                  드론쇼 만족도가 높으며, 주차 및 먹거리존 개선이 핵심 과제로 도출되었습니다.
                  경제적 파급효과는 총 12.3억원으로 추정됩니다.
                </p>
              </div>

              <p className="text-center text-xs text-sk-gray-400">
                본 보고서는 SK AIM 플랫폼에 의해 자동 생성되었습니다.
              </p>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
