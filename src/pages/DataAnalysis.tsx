import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import KpiCard, { Card, RankList, SectionLabel, StatBox } from '../components/ui';
import { CustomerProfileView } from '../components/CustomerProfile';
import { ProfileStackedChart } from '../components/survey/ReportCharts';
import {
  topInflowRegions,
  stayTimeAnalysis,
  movementAnalysis,
  TOTAL_VISITORS,
} from '../data/mockData';
import { topSegmentsByRank } from '../data/segmentData';
import { defaultVisitorProfile } from '../data/customerProfiles';

const kpiItems = [
  { label: '총 방문객', value: TOTAL_VISITORS, unit: '명', change: 18, highlight: true },
  { label: '평균 체류시간', value: 3.2, unit: '시간', change: 5 },
  { label: '수도권 유입', value: 52, unit: '%', change: 3 },
  { label: '추가 소비율', value: 68, unit: '%', change: 7 },
];

export default function DataAnalysis() {
  const navigate = useNavigate();
  const totalVisitors = topInflowRegions.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <PageHeader
        title="데이터 분석"
        description="누가 방문했고 어떻게 이동했는지 분석합니다"
        breadcrumb="데이터 분석"
      />
      <PageContent>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {kpiItems.map((kpi, i) => (
            <KpiCard key={kpi.label} {...kpi} index={i} />
          ))}
        </div>

        <div className="mt-6">
          <Card
            title="방문객 프로필"
            subtitle={defaultVisitorProfile.subtitle}
            variant="elevated"
          >
            <CustomerProfileView profile={defaultVisitorProfile} />
          </Card>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Card title="관심사 순위" subtitle="축제 방문객 점유율 상위">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-sk-gray-400">
                <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded-sm bg-sk-gray-300" />일반</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded-sm gradient-sk" />방문객</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/data-analysis/interests')}
                className="flex items-center gap-0.5 text-xs font-semibold text-sk-orange hover:underline"
              >
                전체 보기
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {topSegmentsByRank.slice(0, 6).map((s, idx) => {
                const max = 85;
                return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigate('/data-analysis/interests')}
                  className="flex w-full items-center gap-3 rounded-xl border border-sk-gray-100 bg-sk-gray-25/50 px-3 py-2.5 text-left transition-colors hover:border-sk-orange/20 hover:bg-sk-orange-light/20"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                      idx < 3 ? 'gradient-sk text-white' : 'bg-sk-gray-100 text-sk-gray-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-sk-gray-800">{s.label}</span>
                      <span className="shrink-0 text-xs font-semibold text-sk-orange">{s.targetPct}%</span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sk-gray-100">
                        <div
                          className="h-full rounded-full bg-sk-gray-300"
                          style={{ width: `${(s.benchmarkPct / max) * 100}%` }}
                        />
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-sk-gray-100">
                        <div
                          className="h-full rounded-full gradient-sk"
                          style={{ width: `${(s.targetPct / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          </Card>

          <Card title="방문객 유입 지역 TOP 10" subtitle={`총 ${totalVisitors.toLocaleString()}명 · 지역 클릭 시 연령·성별`}>
            <RankList
              items={topInflowRegions.map((r) => ({
                rank: r.rank,
                label: r.city,
                value: r.count,
                pct: r.pct,
                slug: r.slug,
              }))}
              onItemClick={(item) => {
                if (item.slug) navigate(`/data-analysis/region/${item.slug}`);
              }}
            />
          </Card>
        </div>

        <div className="mt-6">
          <Card title="체류시간 분석">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stayTimeAnalysis.map((item, i) => (
                <StatBox
                  key={item.label}
                  label={item.label}
                  value={`${item.value}%`}
                  sub={`${item.count.toLocaleString()}명`}
                  highlight={i === 1}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="방문 전·후 이동" subtitle="막대 내 성별 · 하단 연령 분포">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <SectionLabel>방문 전</SectionLabel>
                <ProfileStackedChart
                  items={movementAnalysis.before.items}
                  series={movementAnalysis.before.series}
                  genderSeries={movementAnalysis.before.genderSeries}
                  genderInBar
                  total={TOTAL_VISITORS}
                />
              </div>
              <div>
                <SectionLabel>방문 후</SectionLabel>
                <ProfileStackedChart
                  items={movementAnalysis.after.items}
                  series={movementAnalysis.after.series}
                  genderSeries={movementAnalysis.after.genderSeries}
                  genderInBar
                  total={TOTAL_VISITORS}
                />
              </div>
            </div>
          </Card>
        </div>
      </PageContent>
    </>
  );
}
