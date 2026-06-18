import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import {
  HBarChart,
  WordCloud,
  InsightBox,
  CrossAnalysisGroup,
  AvgWithAgeChart,
  ProfileStackedChart,
  ScoreHighlight,
  TagList,
  SubCard,
  BackToSurvey,
} from '../components/survey/ReportCharts';
import { FreeResponsePanel } from '../components/survey/FreeResponsePanel';
import { NpsReasonPanel } from '../components/survey/NpsReasonPanel';
import {
  surveyOverview,
  respondentProfile,
  awarenessChannels,
  visitPurpose,
  satisfaction,
  economicEffect,
  revisitIntent,
  nps,
  freeResponse,
  surveyDetailMeta,
  TOTAL_RESPONDENTS,
  type SurveyDetailId,
} from '../data/surveyReportData';

const validIds = new Set<string>(Object.keys(surveyDetailMeta));

export default function SurveyDetail() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const isValid = Boolean(sectionId && validIds.has(sectionId));
  const id = isValid ? (sectionId as SurveyDetailId) : null;

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [id]);

  if (!isValid || !id) {
    return <Navigate to="/survey" replace />;
  }

  const meta = surveyDetailMeta[id];

  return (
    <>
      <PageHeader
        title={meta.title}
        description={meta.subtitle}
        breadcrumb="만족도 조사 · 상세분석"
      />
      <PageContent>
        <BackToSurvey />
        <p className="mb-6 text-xs text-sk-gray-400">
          총 응답자 {TOTAL_RESPONDENTS.toLocaleString()}명 기준 · 조사기간 {surveyOverview.period}
        </p>
        {id === 'profile' && <ProfileDetail />}
        {id === 'awareness' && <AwarenessDetail />}
        {id === 'purpose' && <PurposeDetail />}
        {id === 'satisfaction' && <SatisfactionDetail />}
        {id === 'economic' && <EconomicDetail />}
        {id === 'revisit' && <RevisitDetail />}
        {id === 'comments' && <CommentsDetail />}
      </PageContent>
    </>
  );
}

function ProfileDetail() {
  const u = respondentProfile.unified;
  return (
    <div className="space-y-6">
      <SubCard title="성별 구성" subtitle="연령대별 구성 비율">
        <ProfileStackedChart items={u.gender.items} series={u.gender.series} />
      </SubCard>
      <SubCard title="연령 구성">
        <HBarChart data={respondentProfile.age} />
      </SubCard>
      <SubCard title="동반 유형" subtitle="연령대별 구성 비율">
        <ProfileStackedChart
          items={u.companion.items}
          series={u.companion.series}
          genderSeries={u.companion.genderSeries}
        />
      </SubCard>
      <SubCard title="거주자 / 외지인" subtitle="연령대별 구성 비율">
        <ProfileStackedChart
          items={u.residenceType.items}
          series={u.residenceType.series}
          genderSeries={u.residenceType.genderSeries}
        />
      </SubCard>
      <SubCard title="거주지역" subtitle="연령대별 구성 비율">
        <ProfileStackedChart
          items={u.residence.items}
          series={u.residence.series}
          genderSeries={u.residence.genderSeries}
        />
      </SubCard>
      <SubCard title="외지인 출발 지역" subtitle="연령대별 구성 비율">
        <ProfileStackedChart
          items={u.nonResidentOrigins.items}
          series={u.nonResidentOrigins.series}
          genderSeries={u.nonResidentOrigins.genderSeries}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {respondentProfile.nonResidentByCategory.map((cat) => (
            <div key={cat.label} className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-3">
              <p className="text-xs font-semibold text-sk-gray-800">{cat.label}</p>
              <p className="mt-1 text-xl font-bold text-sk-orange">{cat.value}%</p>
              <p className="mt-1 text-[10px] leading-snug text-sk-gray-500">{cat.detail}</p>
            </div>
          ))}
        </div>
      </SubCard>
      <SubCard title="거주자 / 외지인별 동반 유형" subtitle="교차분석">
        <CrossAnalysisGroup groups={respondentProfile.byResidenceType.companion} />
      </SubCard>
      <InsightBox
        items={[
          '가족 단위 방문객 비중 43%로 가장 높음',
          '외지인은 연인·가족 동반 비율이 거주자 대비 높음',
          '거주자는 친구·혼자 방문 비중이 상대적으로 높음',
        ]}
      />
    </div>
  );
}

function AwarenessDetail() {
  return (
    <div className="space-y-6">
      <SubCard title="인지 경로" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={awarenessChannels.unified.items}
          series={awarenessChannels.unified.series}
          genderSeries={awarenessChannels.unified.genderSeries}
        />
      </SubCard>
      <SubCard title="성별별 인지 경로" subtitle="교차분석">
        <CrossAnalysisGroup groups={awarenessChannels.byGender} />
      </SubCard>
      <SubCard title="거주자 / 외지인별 인지 경로" subtitle="교차분석">
        <CrossAnalysisGroup groups={awarenessChannels.byResidenceType} />
      </SubCard>
      <InsightBox items={awarenessChannels.aiInsights} />
    </div>
  );
}

function PurposeDetail() {
  return (
    <div className="space-y-6">
      <SubCard title="방문 목적" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={visitPurpose.unified.purposes}
          series={visitPurpose.unified.series}
          genderSeries={visitPurpose.unified.genderSeries}
        />
      </SubCard>
      <SubCard title="성별별 방문 목적" subtitle="교차분석">
        <CrossAnalysisGroup groups={visitPurpose.byGender} />
      </SubCard>
      <SubCard title="거주자 / 외지인별 방문 목적" subtitle="교차분석">
        <CrossAnalysisGroup groups={visitPurpose.byResidenceType} />
      </SubCard>
      <InsightBox items={visitPurpose.aiInsights} />
    </div>
  );
}

function SatisfactionDetail() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <SubCard title="전체 만족도">
          <ScoreHighlight value={satisfaction.overall} max={satisfaction.maxScore} />
        </SubCard>
        <SubCard title="성별 만족도" className="lg:col-span-2">
          <HBarChart
            data={satisfaction.byGender.map((g) => ({ label: g.label, value: 0, score: g.score }))}
            showScore
          />
        </SubCard>
      </div>
      <SubCard title="프로그램별 만족도" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={satisfaction.unified.items}
          series={satisfaction.unified.series}
          genderSeries={satisfaction.unified.genderSeries}
          showScore
          maxScore={satisfaction.maxScore}
        />
      </SubCard>
      <div className="grid gap-5 sm:grid-cols-2">
        <SubCard title="가장 만족한 부분">
          <TagList items={satisfaction.topSatisfied} variant="positive" />
        </SubCard>
        <SubCard title="개선이 필요한 부분">
          <TagList items={satisfaction.needsImprovement} variant="negative" />
        </SubCard>
      </div>
      <InsightBox
        items={[
          '외지인의 전체·드론쇼 만족도가 거주자 대비 높음',
          '연령이 높을수록 만족도 상승 경향',
          '교통·안내 서비스 항목은 개선 필요',
        ]}
      />
    </div>
  );
}

function EconomicDetail() {
  const u = economicEffect.unified;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-sk-orange/20 bg-sk-orange-light/30 p-4 text-center">
          <p className="text-xs text-sk-gray-500">추가 소비 비율</p>
          <p className="mt-1 text-2xl font-bold text-sk-orange">78%</p>
        </div>
        <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 text-center">
          <p className="text-xs text-sk-gray-500">1인 평균 지출액</p>
          <p className="mt-1 text-2xl font-bold text-sk-gray-800">{economicEffect.avgSpending}</p>
        </div>
        <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 text-center">
          <p className="text-xs text-sk-gray-500">지역 내 예상 소비효과</p>
          <p className="mt-1 text-2xl font-bold text-sk-gray-800">약 {economicEffect.estimatedEffect}</p>
        </div>
      </div>
      <SubCard title="추가 소비 여부" subtitle="연령대별 구성 비율">
        <ProfileStackedChart
          items={u.additionalSpending.items}
          series={u.additionalSpending.series}
          genderSeries={u.additionalSpending.genderSeries}
        />
      </SubCard>
      <SubCard title="소비 업종" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={u.spendingPlaces.items}
          series={u.spendingPlaces.series}
          genderSeries={u.spendingPlaces.genderSeries}
        />
      </SubCard>
      <SubCard title="평균 지출액" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={u.spendingAmount.items}
          series={u.spendingAmount.series}
          genderSeries={u.spendingAmount.genderSeries}
        />
      </SubCard>
      <SubCard title="거주자 / 외지인별 소비행태" subtitle="교차분석">
        <CrossAnalysisGroup groups={economicEffect.byResidenceType} />
      </SubCard>
      <InsightBox items={economicEffect.aiInsights} />
    </div>
  );
}

function RevisitDetail() {
  const u = revisitIntent.unified;
  return (
    <div className="space-y-6">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <SubCard title="재방문 의향" subtitle={`긍정 응답 합계 ${revisitIntent.totalPositive}%`}>
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
      <SubCard title="재방문 의향 상세" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={u.levels.items}
          series={u.levels.series}
          genderSeries={u.levels.genderSeries}
        />
      </SubCard>
      <SubCard title="추천 의향 (NPS) 상세" subtitle="전체 평균 및 연령대별">
        <AvgWithAgeChart
          items={u.nps.items}
          series={u.nps.series}
          genderSeries={u.nps.genderSeries}
        />
      </SubCard>
      <SubCard title="거주자 / 외지인별 재방문·추천" subtitle="교차분석">
        <CrossAnalysisGroup groups={revisitIntent.byResidenceType} />
      </SubCard>
      <SubCard title="추천 의향 사유" subtitle={nps.reason.question}>
        <NpsReasonPanel />
      </SubCard>
      <div className="rounded-xl border border-sk-gray-200 bg-sk-gray-25 p-5">
        <p className="text-sm font-semibold text-sk-gray-700">요약</p>
        <p className="mt-2 text-sm leading-relaxed text-sk-gray-600">{nps.reason.summary}</p>
      </div>
      <InsightBox
        items={[
          '외지인의 재방문·추천 의향이 거주자 대비 높음',
          '여성 응답자의 재방문 의향이 남성 대비 높음',
          '교통·주차 개선 시 재방문 의향 추가 상승 기대',
        ]}
      />
    </div>
  );
}

function CommentsDetail() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <SubCard title="긍정 키워드">
          <WordCloud words={freeResponse.positive} variant="positive" />
        </SubCard>
        <SubCard title="개선 키워드">
          <WordCloud words={freeResponse.negative} variant="negative" />
        </SubCard>
      </div>
      <SubCard title="주관식 응답 원문" subtitle="긍정/부정 필터">
        <FreeResponsePanel />
      </SubCard>
      <div className="rounded-xl border border-sk-orange/15 bg-gradient-to-br from-sk-orange-light/50 to-white p-6">
        <div className="flex items-center gap-2 text-sk-orange">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">AI 의견 요약</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-sk-gray-700">{freeResponse.aiSummary}</p>
      </div>
    </div>
  );
}
