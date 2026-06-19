import { useMemo, useState } from 'react';
import { PageHeader, PageContent } from '../components/Layout';
import KpiCard, { Card, Tag } from '../components/ui';
import { PromoMaterialSelector, PromoPreview } from '../components/PromoMaterial';
import { CustomerProfileView } from '../components/CustomerProfile';
import LocationMap from '../components/LocationMap';
import MarketingDataTable from '../components/MarketingDataTable';
import {
  targetSegments,
  targetAudienceSize,
  promoMaterials,
  type PromoMaterialId,
} from '../data/mockData';
import {
  buildMarketingSummaryDataTable,
  computeMarketingAggregates,
  getMaterialDataTable,
  getPushTargetLabels,
} from '../data/marketingReportTables';
import { estimatedCustomerProfile } from '../data/customerProfiles';

function LocationSettingCard() {
  return (
    <Card title="위치 설정" subtitle="설문 발송 지역" className="overflow-visible">
      <LocationMap />
    </Card>
  );
}

function TargetSettingPanel() {
  return (
    <div className="space-y-5">
      <Card title="타겟 설정" subtitle="홍보 대상 고객 세그먼트" className="overflow-visible">
        <div className="flex flex-wrap gap-2 pt-1">
          {targetSegments.map((seg) => (
            <Tag key={seg.label} active={seg.active} tooltip={seg.tooltip}>
              {seg.label}
            </Tag>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 sm:mt-5 sm:p-5">
          <p className="text-xs font-medium text-sk-gray-500">타겟 고객 규모</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-sk-gray-800 sm:text-3xl">
            {targetAudienceSize.toLocaleString()}
            <span className="ml-1 text-sm font-normal text-sk-gray-400 sm:text-base">명</span>
          </p>
        </div>
      </Card>

      <Card
        title="추정 고객 프로필"
        subtitle={estimatedCustomerProfile.subtitle}
        variant="accent"
        className="overflow-visible"
      >
        <CustomerProfileView profile={estimatedCustomerProfile} variant="compact" />
      </Card>
    </div>
  );
}

export default function Marketing() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<PromoMaterialId>('promo-push');
  const selectedMaterial = promoMaterials.find((m) => m.id === selectedMaterialId)!;

  const summaryTable = useMemo(
    () => buildMarketingSummaryDataTable(computeMarketingAggregates()),
    [],
  );
  const detailTable = useMemo(
    () => getMaterialDataTable(selectedMaterial),
    [selectedMaterial],
  );
  const targetLabels = getPushTargetLabels(selectedMaterial);

  const showTargetPanel = selectedMaterialId === 'promo-push';
  const showLocationPanel = selectedMaterialId === 'survey-push';
  const kpiGridClass =
    selectedMaterial.kpis.length === 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : 'grid-cols-2 lg:grid-cols-4';

  return (
    <>
      <PageHeader
        title="마케팅"
        description="어떤 고객에게 홍보했고 얼마나 반응했는지 확인합니다"
        breadcrumb="마케팅"
      />
      <PageContent>
        {/* 1. 소재 선택 — 상단 고정 (모바일 우선) */}
        <section className="mb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-sk-gray-400">
            홍보 소재 선택
          </p>
          <PromoMaterialSelector
            materials={promoMaterials}
            selectedId={selectedMaterialId}
            onSelect={setSelectedMaterialId}
          />
        </section>

        {/* 2. 통합 성과 요약 표 */}
        <Card title="마케팅 성과 요약" subtitle="푸쉬·배너 채널 통합" className="mb-5 overflow-visible">
          <MarketingDataTable table={summaryTable} />
        </Card>

        {/* 3. 선택 소재 헤더 + KPI */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sk-orange-light px-3 py-1 text-xs font-semibold text-sk-orange">
            {selectedMaterial.reportHeading}
          </span>
          <span className="text-xs text-sk-gray-400">{selectedMaterial.title}</span>
        </div>

        <div className={`grid gap-2.5 sm:gap-3 ${kpiGridClass}`}>
          {selectedMaterial.kpis.map((kpi, i) => (
            <KpiCard
              key={`${selectedMaterialId}-${kpi.label}`}
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              change={kpi.change}
              changeLabel={kpi.changeLabel}
              highlight={kpi.highlight}
              decimals={kpi.decimals}
              index={i}
            />
          ))}
        </div>

        {/* 4. 채널별 상세 성과 표 (SK플래닛 결과리포트 형식) */}
        {detailTable && (
          <Card
            title={selectedMaterial.reportHeading}
            subtitle={selectedMaterial.description}
            className="mt-5 overflow-visible"
            variant="accent"
          >
            <MarketingDataTable table={detailTable} />
            {targetLabels.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-sk-gray-100 pt-4">
                <span className="w-full text-xs font-medium text-sk-gray-500 sm:w-auto">적용 타겟</span>
                {targetLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-sk-orange/20 bg-sk-orange-light px-2.5 py-1 text-xs font-medium text-sk-orange"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* 5. 타겟/위치 + 소재 미리보기 */}
        <div
          className={`mt-6 grid gap-5 ${
            showTargetPanel || showLocationPanel ? 'lg:grid-cols-3 lg:gap-6' : ''
          }`}
        >
          {showTargetPanel && (
            <div className="lg:col-span-1">
              <TargetSettingPanel />
            </div>
          )}
          {showLocationPanel && (
            <div className="lg:col-span-1">
              <LocationSettingCard />
            </div>
          )}

          <div
            className={
              showTargetPanel || showLocationPanel ? 'min-w-0 lg:col-span-2' : 'min-w-0'
            }
          >
            <Card
              title="홍보 소재 미리보기"
              subtitle="알림 화면 · 배너 · 앱 화면"
              variant="accent"
              className="overflow-visible"
            >
              <PromoPreview material={selectedMaterial} />
            </Card>
          </div>
        </div>
      </PageContent>
    </>
  );
}
