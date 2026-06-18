import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileBarChart } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import {
  HBarChart,
  ReportSection,
  InsightBox,
  AvgWithAgeChart,
  ProfileStackedChart,
  ScoreHighlight,
  TagList,
  SubCard,
  DetailLink,
} from '../components/survey/ReportCharts';
import { ReportDownloadBar } from '../components/survey/ReportDownloadBar';
import { FreeResponsePanel } from '../components/survey/FreeResponsePanel';
import { NpsReasonKeywords } from '../components/survey/NpsReasonPanel';
import {
  surveyOverview,
  awarenessChannels,
  visitPurpose,
  satisfaction,
  economicEffect,
  revisitIntent,
  nps,
  aiFinalInsights,
  surveySectionSummaries,
} from '../data/surveyReportData';
import { restoreSurveyScroll } from '../utils/surveyScroll';

export default function SurveyAnalysis() {
  useEffect(() => {
    restoreSurveyScroll();
  }, []);
  return (
    <>
      <PageHeader
        title="방문객 만족도 조사 결과"
        description={surveyOverview.subtitle}
        breadcrumb="만족도 조사"
        action={<ReportDownloadBar />}
      />
      <PageContent>
        {/* 조사 개요 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-sk-gray-200/80 bg-white p-6 shadow-card"
        >
          <div className="mb-4 flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-sk-orange" />
            <h2 className="text-lg font-bold text-sk-gray-800">조사 개요</h2>
            <span className="ml-auto text-xs text-sk-gray-400">조사기간 {surveyOverview.period}</span>
          </div>

          <div className="mb-5 rounded-xl border border-sk-orange/15 bg-sk-orange-light/25 px-4 py-3">
            {surveySectionSummaries.overview.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-sk-gray-700">
                {line}
              </p>
            ))}
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 px-4 py-3">
              <p className="text-xs font-medium text-sk-gray-500">조사 대상</p>
              <p className="mt-1 text-sm font-semibold text-sk-gray-800">{surveyOverview.target}</p>
            </div>
            <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 px-4 py-3">
              <p className="text-xs font-medium text-sk-gray-500">조사 목적</p>
              <p className="mt-1 text-sm leading-relaxed text-sk-gray-700">{surveyOverview.purpose}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {surveyOverview.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-xl border p-4 text-center ${
                  kpi.highlight ? 'border-sk-orange/20 bg-sk-orange-light/40' : 'border-sk-gray-100 bg-sk-gray-25'
                }`}
              >
                <p className="text-xs text-sk-gray-500">{kpi.label}</p>
                <p className={`mt-1 text-xl font-bold ${kpi.highlight ? 'text-sk-orange' : 'text-sk-gray-800'}`}>
                  {kpi.value}
                  {kpi.unit && <span className="ml-0.5 text-sm font-medium">{kpi.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 space-y-6">
          {/* 01 응답자 프로파일 */}
          <ReportSection
            number="01"
            title="응답자 프로파일"
            subtitle="방문객 특성 분석"
            summary={surveySectionSummaries.profile}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: '여성', value: '52%' },
                { label: '남성', value: '48%' },
                { label: '외지인', value: '68%' },
                { label: '가족 동반', value: '43%' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 px-4 py-3 text-center"
                >
                  <p className="text-xs text-sk-gray-500">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-sk-orange">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <DetailLink to="/survey/detail/profile" label="응답자 프로파일 자세히 보기" />
            </div>
          </ReportSection>

          {/* 02 행사 인지 경로 */}
          <ReportSection
            number="02"
            title="행사 인지 경로"
            subtitle="어떻게 행사 정보를 알게 되었습니까?"
            summary={surveySectionSummaries.awareness}
            detailPath="/survey/detail/awareness"
          >
            <SubCard title="전체 인지 경로">
              <HBarChart data={awarenessChannels.overall} />
            </SubCard>
            <div className="mt-4">
              <InsightBox items={awarenessChannels.aiInsights.slice(0, 2)} />
            </div>
          </ReportSection>

          {/* 03 방문 목적 */}
          <ReportSection
            number="03"
            title="방문 목적 분석"
            subtitle="이번 방문의 주요 목적"
            summary={surveySectionSummaries.purpose}
            detailPath="/survey/detail/purpose"
          >
            <SubCard title="방문 목적">
              <AvgWithAgeChart
                items={visitPurpose.unified.purposes}
                series={visitPurpose.unified.series}
                showAgeBreakdown={false}
              />
            </SubCard>
            <div className="mt-4">
              <InsightBox items={visitPurpose.aiInsights.slice(0, 2)} title="시사점" />
            </div>
          </ReportSection>

          {/* 04 만족도 */}
          <ReportSection
            number="04"
            title="행사 만족도 분석"
            subtitle="5점 척도 기준"
            summary={surveySectionSummaries.satisfaction}
            detailPath="/survey/detail/satisfaction"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <SubCard title="전체 만족도">
                <ScoreHighlight value={satisfaction.overall} max={satisfaction.maxScore} />
              </SubCard>
              <SubCard title="프로그램별 만족도">
                <AvgWithAgeChart
                  items={satisfaction.unified.items}
                  series={satisfaction.unified.series}
                  showAgeBreakdown={false}
                  showScore
                  maxScore={satisfaction.maxScore}
                />
              </SubCard>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <SubCard title="가장 만족한 부분">
                <TagList items={satisfaction.topSatisfied} variant="positive" />
              </SubCard>
              <SubCard title="개선이 필요한 부분">
                <TagList items={satisfaction.needsImprovement} variant="negative" />
              </SubCard>
            </div>
          </ReportSection>

          {/* 05 지역 경제 */}
          <ReportSection
            number="05"
            title="지역 경제 효과 분석"
            subtitle="설문 기반 소비행태"
            summary={surveySectionSummaries.economic}
            detailPath="/survey/detail/economic"
          >
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-sk-orange/20 bg-sk-orange-light/30 p-4 text-center">
                <p className="text-xs text-sk-gray-500">추가 소비</p>
                <p className="mt-1 text-2xl font-bold text-sk-orange">78%</p>
              </div>
              <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 text-center">
                <p className="text-xs text-sk-gray-500">평균 지출</p>
                <p className="mt-1 text-2xl font-bold text-sk-gray-800">{economicEffect.avgSpending}</p>
              </div>
              <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 text-center">
                <p className="text-xs text-sk-gray-500">예상 소비효과</p>
                <p className="mt-1 text-2xl font-bold text-sk-gray-800">약 {economicEffect.estimatedEffect}</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <SubCard title="추가 소비 여부">
                <ProfileStackedChart
                  items={economicEffect.unified.additionalSpending.items}
                  series={economicEffect.unified.additionalSpending.series}
                  genderSeries={economicEffect.unified.additionalSpending.genderSeries}
                  showAgeBreakdown={false}
                />
              </SubCard>
              <SubCard title="소비 업종">
                <HBarChart data={economicEffect.spendingPlaces} />
              </SubCard>
            </div>
          </ReportSection>

          {/* 06 재방문 */}
          <ReportSection
            number="06"
            title="재방문 및 추천 의향"
            summary={surveySectionSummaries.revisit}
            detailPath="/survey/detail/revisit"
          >
            <div className="grid items-start gap-5 lg:grid-cols-2">
              <SubCard title="재방문 의향" subtitle={`긍정 ${revisitIntent.totalPositive}%`}>
                <HBarChart data={revisitIntent.levels} />
              </SubCard>
              <SubCard title="추천 의향 (NPS)" subtitle={`NPS ${nps.score}점`}>
                <HBarChart
                  data={[
                    { label: '추천 (Promoter)', value: nps.promote },
                    { label: '보통 (Passive)', value: nps.passive },
                    { label: '비추천 (Detractor)', value: nps.detractor },
                  ]}
                />
              </SubCard>
            </div>
            <SubCard title="추천 의향 사유" subtitle="키워드 분석" className="mt-5">
              <NpsReasonKeywords />
              <div className="mt-4 flex justify-end">
                <DetailLink to="/survey/detail/revisit" label="주관식 원문 보기" />
              </div>
            </SubCard>
          </ReportSection>

          {/* 07 자유 의견 */}
          <ReportSection
            number="07"
            title="자유 의견 분석"
            subtitle="주관식 응답"
            summary={surveySectionSummaries.comments}
            detailPath="/survey/detail/comments"
          >
            <SubCard title="주관식 응답" subtitle="긍정/부정 필터">
              <FreeResponsePanel compact />
            </SubCard>
            <div className="mt-4 flex justify-end">
              <DetailLink to="/survey/detail/comments" label="전체 의견 · 키워드 분석 보기" />
            </div>
          </ReportSection>

          {/* 08 종합 인사이트 */}
          <ReportSection
            number="08"
            title="종합 인사이트"
            subtitle="공공기관용 자동 생성"
            summary={surveySectionSummaries.insights}
          >
            <div className="rounded-xl border border-sk-orange/15 bg-gradient-to-br from-sk-orange-light/50 to-white p-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-sk text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-sk-gray-800">주요 인사이트</p>
                  <p className="text-xs text-sk-gray-400">설문 데이터 기반 자동 생성</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {aiFinalInsights.publicInsights.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-sk-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {(
                [
                  ['콘텐츠 전략', aiFinalInsights.policyRecommendations.content],
                  ['홍보 전략', aiFinalInsights.policyRecommendations.marketing],
                  ['운영 전략', aiFinalInsights.policyRecommendations.operations],
                ] as const
              ).map(([title, items]) => (
                <div key={title} className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4">
                  <p className="mb-3 text-sm font-bold text-sk-gray-800">{title}</p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-sk-gray-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sk-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ReportSection>
        </div>
      </PageContent>
    </>
  );
}
