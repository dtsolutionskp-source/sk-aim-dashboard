import { useState } from 'react';
import { PageHeader, PageContent } from '../components/Layout';
import KpiCard, { Card, ProgressItem, RankList } from '../components/ui';
import {
  visitorDemographics,
  topInflowRegions,
  stayTimeAnalysis,
  gridZones,
  beforeVisitPlaces,
  afterVisitPlaces,
  economicImpact,
} from '../data/mockData';

export default function DataAnalysis() {
  const [selectedZone, setSelectedZone] = useState(gridZones[4]);

  const totalVisitors = topInflowRegions.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <PageHeader
        title="데이터 분석"
        description="누가 방문했고 어떻게 이동했는지 분석합니다"
        breadcrumb="데이터 분석"
      />
      <PageContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="총 방문객" value={23060} unit="명" change={18} changeLabel="전년 대비" highlight />
          <KpiCard label="평균 체류시간" value={3.2} unit="시간" change={5} changeLabel="전년 대비" />
          <KpiCard label="수도권 유입" value={52} unit="%" change={3} changeLabel="전년 대비" />
          <KpiCard label="추가 소비율" value={68} unit="%" change={7} changeLabel="전년 대비" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="방문객 특성" subtitle="성별 · 연령 · 거주지 · 관심사">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sk-gray-400">성별</p>
                <div className="space-y-3">
                  {visitorDemographics.gender.map((g) => (
                    <ProgressItem key={g.label} label={g.label} value={g.value} count={g.count} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sk-gray-400">연령</p>
                <div className="space-y-3">
                  {visitorDemographics.age.map((a) => (
                    <ProgressItem key={a.label} label={a.label} value={a.value} color="bg-orange-400" />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sk-gray-400">거주지</p>
                <div className="space-y-3">
                  {visitorDemographics.residence.map((r) => (
                    <ProgressItem key={r.label} label={r.label} value={r.value} color="bg-amber-500" />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sk-gray-400">관심사</p>
                <div className="space-y-3">
                  {visitorDemographics.interests.map((i) => (
                    <ProgressItem key={i.label} label={i.label} value={i.value} color="bg-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="방문객 유입 지역 TOP 10" subtitle={`총 ${totalVisitors.toLocaleString()}명 분석`}>
            <RankList
              items={topInflowRegions.map((r) => ({
                rank: r.rank,
                label: r.city,
                value: r.count,
                pct: r.pct,
              }))}
            />
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card title="체류시간 분석">
            <div className="grid grid-cols-2 gap-4">
              {stayTimeAnalysis.map((item) => (
                <div key={item.label} className="rounded-lg border border-sk-gray-100 bg-sk-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-sk-orange">{item.value}%</p>
                  <p className="mt-1 text-sm font-medium text-sk-gray-700">{item.label}</p>
                  <p className="text-xs text-sk-gray-400">{item.count.toLocaleString()}명</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="항공뷰 기반 공간 분석" subtitle="구역 클릭 시 상세 정보 표시">
            <div className="grid grid-cols-3 gap-2">
              {gridZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`relative rounded-lg border-2 p-4 text-center transition-all ${
                    selectedZone.id === zone.id
                      ? 'border-sk-orange bg-sk-orange-light'
                      : 'border-sk-gray-200 bg-sk-gray-50 hover:border-sk-orange/50'
                  }`}
                  style={{
                    backgroundColor:
                      selectedZone.id === zone.id
                        ? undefined
                        : `rgba(244, 119, 37, ${0.1 + (zone.visitors / 5000) * 0.4})`,
                  }}
                >
                  <span className="text-lg font-bold text-sk-gray-800">{zone.id}</span>
                  <p className="mt-1 text-xs text-sk-gray-500">{zone.visitors.toLocaleString()}명</p>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-sk-orange/20 bg-sk-orange-light/50 p-4">
              <p className="text-sm font-semibold text-sk-orange">{selectedZone.id} 구역 상세</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-sk-gray-500">방문객 수</p>
                  <p className="font-bold text-sk-gray-800">{selectedZone.visitors.toLocaleString()}명</p>
                </div>
                <div>
                  <p className="text-sk-gray-500">평균 체류시간</p>
                  <p className="font-bold text-sk-gray-800">{selectedZone.avgStay}분</p>
                </div>
                <div>
                  <p className="text-sk-gray-500">성별</p>
                  <p className="font-bold text-sk-gray-800">
                    여 {selectedZone.gender.female}% / 남 {selectedZone.gender.male}%
                  </p>
                </div>
                <div>
                  <p className="text-sk-gray-500">주요 연령</p>
                  <p className="font-bold text-sk-gray-800">{selectedZone.age}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card title="방문 전 방문 장소">
            <div className="space-y-3">
              {beforeVisitPlaces.map((p) => (
                <ProgressItem key={p.label} label={p.label} value={p.value} />
              ))}
            </div>
          </Card>

          <Card title="방문 후 이동 장소">
            <div className="space-y-3">
              {afterVisitPlaces.map((p) => (
                <ProgressItem key={p.label} label={p.label} value={p.value} color="bg-orange-400" />
              ))}
            </div>
          </Card>

          <Card title="지역경제 연계 분석" subtitle="축제 방문 후 소비처">
            <div className="space-y-4">
              {economicImpact.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-sk-gray-700">{item.label}</span>
                    <span className="text-sk-gray-600">
                      {(item.amount / 100000000).toFixed(1)}억원
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sk-gray-100">
                    <div className="h-full rounded-full bg-sk-orange" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-2 rounded-lg bg-sk-gray-50 p-3 text-center">
                <p className="text-xs text-sk-gray-500">총 경제 파급효과</p>
                <p className="text-xl font-bold text-sk-orange">12.3억원</p>
              </div>
            </div>
          </Card>
        </div>
      </PageContent>
    </>
  );
}
