import { Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import KpiCard, { Card, ProgressItem } from '../components/ui';
import {
  surveyKpis,
  visitPurposes,
  awarenessChannels,
  spendingAnalysis,
  surveyComments,
  aiSummary,
} from '../data/mockData';

export default function SurveyAnalysis() {
  return (
    <>
      <PageHeader
        title="설문 분석"
        description="방문객이 어떻게 느꼈는지 확인합니다"
        breadcrumb="설문 분석"
      />
      <PageContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <KpiCard label="푸쉬 발송 수" value={surveyKpis.pushSent} unit="건" />
          <KpiCard label="설문 응답 수" value={surveyKpis.responses} unit="건" change={22} changeLabel="전년 대비" />
          <KpiCard label="응답률" value={surveyKpis.responseRate} unit="%" highlight />
          <KpiCard label="평균 만족도" value={surveyKpis.satisfaction} unit="/ 5.0" highlight />
          <KpiCard label="재방문 의향" value={surveyKpis.revisitIntent} unit="%" change={5} changeLabel="전년 대비" />
          <KpiCard label="NPS" value={surveyKpis.nps} unit="점" change={8} changeLabel="전년 대비" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="방문 목적">
            <div className="space-y-3">
              {visitPurposes.map((p) => (
                <ProgressItem key={p.label} label={p.label} value={p.value} />
              ))}
            </div>
          </Card>

          <Card title="행사 인지 경로">
            <div className="space-y-3">
              {awarenessChannels.map((c) => (
                <ProgressItem key={c.label} label={c.label} value={c.value} color="bg-orange-400" />
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="소비금액 분석" subtitle="설문 기반 경제적 파급효과">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-sk-gray-100 bg-sk-gray-50 p-4">
                <p className="text-xs font-medium text-sk-gray-500">행사장 소비 (평균)</p>
                <p className="mt-1 text-2xl font-bold text-sk-gray-800">
                  {spendingAnalysis.venueSpending.avg.toLocaleString()}
                  <span className="text-sm font-normal text-sk-gray-400">원</span>
                </p>
                <p className="mt-1 text-xs text-sk-gray-400">
                  총 {(spendingAnalysis.venueSpending.total / 100000000).toFixed(1)}억원
                </p>
              </div>
              <div className="rounded-lg border border-sk-gray-100 bg-sk-gray-50 p-4">
                <p className="text-xs font-medium text-sk-gray-500">지역 내 추가 소비 (평균)</p>
                <p className="mt-1 text-2xl font-bold text-sk-orange">
                  {spendingAnalysis.additionalSpending.avg.toLocaleString()}
                  <span className="text-sm font-normal text-sk-gray-400">원</span>
                </p>
                <p className="mt-1 text-xs text-sk-gray-400">
                  총 {(spendingAnalysis.additionalSpending.total / 100000000).toFixed(1)}억원
                </p>
              </div>
              <div className="rounded-lg border border-sk-gray-100 bg-sk-gray-50 p-4">
                <p className="text-xs font-medium text-sk-gray-500">숙박 여부</p>
                <p className="mt-1 text-2xl font-bold text-sk-gray-800">
                  {spendingAnalysis.accommodation.stayed}
                  <span className="text-sm font-normal text-sk-gray-400">%</span>
                </p>
                <p className="mt-1 text-xs text-sk-gray-400">
                  평균 {spendingAnalysis.accommodation.avg.toLocaleString()}원
                </p>
              </div>
              <div className="rounded-lg border border-sk-gray-100 bg-sk-gray-50 p-4">
                <p className="text-xs font-medium text-sk-gray-500">재방문 의향</p>
                <p className="mt-1 text-2xl font-bold text-sk-gray-800">
                  {spendingAnalysis.revisitIntent}
                  <span className="text-sm font-normal text-sk-gray-400">%</span>
                </p>
                <p className="mt-1 text-xs text-green-600">전년 대비 +5%p</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="자유 의견" subtitle="실제 설문 응답">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {surveyComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-lg border p-4 ${
                    comment.sentiment === 'positive'
                      ? 'border-green-100 bg-green-50/50'
                      : 'border-red-100 bg-red-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {comment.sentiment === 'positive' ? (
                      <ThumbsUp className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <ThumbsDown className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm text-sk-gray-700">"{comment.text}"</p>
                      <span className="mt-2 inline-block rounded-full bg-white px-2 py-0.5 text-xs text-sk-gray-500">
                        {comment.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="AI 의견 요약" subtitle="자동 생성">
            <div className="rounded-lg bg-gradient-to-br from-sk-orange-light to-white p-5">
              <div className="flex items-center gap-2 text-sk-orange">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">AI 분석 결과</span>
              </div>
              <ul className="mt-4 space-y-3">
                {aiSummary.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-sk-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sk-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </PageContent>
    </>
  );
}
