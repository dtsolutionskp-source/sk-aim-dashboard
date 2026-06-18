import { useState } from 'react';
import { Upload, MapPin } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import KpiCard, { Card, Tag } from '../components/ui';
import {
  marketingKpis,
  targetSegments,
  promoMaterials,
  regionalResponse,
} from '../data/mockData';

export default function Marketing() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="마케팅"
        description="어떤 고객에게 홍보했고 얼마나 반응했는지 확인합니다"
        breadcrumb="마케팅"
      />
      <PageContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="푸쉬 발송 수" value={marketingKpis.pushSent} unit="건" change={12} changeLabel="전년 대비" />
          <KpiCard label="도달 고객 수" value={marketingKpis.reached} unit="명" change={8} changeLabel="전년 대비" />
          <KpiCard label="클릭 수" value={marketingKpis.clicks} unit="건" change={15} changeLabel="전년 대비" />
          <KpiCard label="CTR" value={marketingKpis.ctr} unit="%" highlight change={3.2} changeLabel="전년 대비" />
          <KpiCard label="참여 전환율" value={marketingKpis.conversionRate} unit="%" change={1.8} changeLabel="전년 대비" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card title="타겟 설정" subtitle="홍보 대상 고객 세그먼트">
            <div className="flex flex-wrap gap-2">
              {targetSegments.map((seg) => (
                <Tag key={seg.label} active={seg.active}>
                  {seg.label}
                </Tag>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-sk-gray-50 p-4">
              <p className="text-xs font-medium text-sk-gray-500">타겟 고객 규모</p>
              <p className="mt-1 text-2xl font-bold text-sk-gray-800">42,500<span className="text-sm font-normal text-sk-gray-400">명</span></p>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card
              title="홍보 소재"
              subtitle="푸쉬 및 배너 이미지"
              action={
                <button className="flex items-center gap-1.5 rounded-lg border border-sk-gray-200 px-3 py-1.5 text-xs font-medium text-sk-gray-600 hover:bg-sk-gray-50">
                  <Upload className="h-3.5 w-3.5" />
                  이미지 업로드
                </button>
              }
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {promoMaterials.map((material) => (
                  <div key={material.id} className="overflow-hidden rounded-lg border border-sk-gray-200">
                    <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${material.gradient}`}>
                      <span className="text-sm font-semibold text-white/90">{material.title}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-sk-gray-800">{material.title}</p>
                      <p className="mt-0.5 text-xs text-sk-gray-400">{material.description}</p>
                      <div className="mt-2 flex gap-3 text-xs text-sk-gray-500">
                        {material.stats.sent > 0 && <span>발송 {material.stats.sent.toLocaleString()}</span>}
                        {material.stats.clicks > 0 && <span>클릭 {material.stats.clicks.toLocaleString()}</span>}
                        {'impressions' in material.stats && material.stats.impressions && (
                          <span>노출 {material.stats.impressions.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Card title="지역별 반응 분석" subtitle="지도 기반 지역별 반응률">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="relative rounded-xl bg-sk-gray-50 p-6">
                <div className="relative mx-auto aspect-[4/3] max-w-md">
                  <svg viewBox="0 0 400 300" className="h-full w-full">
                    <rect width="400" height="300" fill="#f1f3f5" rx="12" />
                    {regionalResponse.map((region, idx) => {
                      const positions = [
                        { x: 120, y: 80, w: 80, h: 60 },
                        { x: 100, y: 150, w: 100, h: 70 },
                        { x: 60, y: 130, w: 50, h: 50 },
                        { x: 150, y: 180, w: 70, h: 60 },
                        { x: 200, y: 60, w: 120, h: 100 },
                        { x: 280, y: 120, w: 80, h: 80 },
                      ];
                      const pos = positions[idx];
                      const opacity = 0.3 + (region.rate / 30) * 0.7;
                      const isSelected = selectedRegion === region.region;
                      return (
                        <g key={region.region}>
                          <rect
                            x={pos.x}
                            y={pos.y}
                            width={pos.w}
                            height={pos.h}
                            rx="8"
                            fill={`rgba(244, 119, 37, ${opacity})`}
                            stroke={isSelected ? '#f47725' : 'transparent'}
                            strokeWidth="3"
                            className="cursor-pointer transition-all hover:opacity-100"
                            onClick={() => setSelectedRegion(region.region)}
                          />
                          <text
                            x={pos.x + pos.w / 2}
                            y={pos.y + pos.h / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="pointer-events-none text-xs font-semibold fill-white"
                          >
                            {region.region}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-sk-gray-400">
                    <MapPin className="h-3 w-3" />
                    수도권·강원 지역
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {regionalResponse.map((region) => (
                  <button
                    key={region.region}
                    onClick={() => setSelectedRegion(region.region)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      selectedRegion === region.region
                        ? 'border-sk-orange bg-sk-orange-light'
                        : 'border-sk-gray-200 hover:border-sk-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sk-gray-800">{region.region}</span>
                      <span className="text-lg font-bold text-sk-orange">{region.rate}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sk-gray-100">
                      <div
                        className="h-full rounded-full bg-sk-orange"
                        style={{ width: `${(region.rate / 30) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-sk-gray-500">
                      방문 전환 {region.visitors.toLocaleString()}명
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </PageContent>
    </>
  );
}
