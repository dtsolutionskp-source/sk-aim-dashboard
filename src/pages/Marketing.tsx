import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageHeader, PageContent } from '../components/Layout';
import KpiCard, { Card, Tag } from '../components/ui';
import { PromoMaterialSelector, PromoPreview } from '../components/PromoMaterial';
import { CustomerProfileView } from '../components/CustomerProfile';
import LocationMap from '../components/LocationMap';
import {
  targetSegments,
  targetAudienceSize,
  promoMaterials,
  type PromoMaterialId,
} from '../data/mockData';
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
        <div className="flex flex-wrap gap-2.5 pt-1">
          {targetSegments.map((seg) => (
            <Tag key={seg.label} active={seg.active} tooltip={seg.tooltip}>
              {seg.label}
            </Tag>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-5">
          <p className="text-xs font-medium text-sk-gray-500">타겟 고객 규모</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-sk-gray-800">
            {targetAudienceSize.toLocaleString()}
            <span className="ml-1 text-base font-normal text-sk-gray-400">명</span>
          </p>
        </div>
      </Card>

      <Card
        title="추정 고객 프로필"
        subtitle={estimatedCustomerProfile.subtitle}
        variant="accent"
      >
        <CustomerProfileView profile={estimatedCustomerProfile} variant="compact" />
      </Card>
    </div>
  );
}

export default function Marketing() {
  const [selectedMaterialId, setSelectedMaterialId] = useState<PromoMaterialId>('promo-push');
  const selectedMaterial = promoMaterials.find((m) => m.id === selectedMaterialId)!;
  const kpiCount = selectedMaterial.kpis.length;
  const showTargetPanel = selectedMaterialId === 'promo-push';
  const showLocationPanel = selectedMaterialId === 'survey-push';
  const isFullWidth = selectedMaterialId === 'main-banner';

  return (
    <>
      <PageHeader
        title="마케팅"
        description="어떤 고객에게 홍보했고 얼마나 반응했는지 확인합니다"
        breadcrumb="마케팅"
      />
      <PageContent>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-sk-orange-light px-3 py-1 text-xs font-semibold text-sk-orange">
            {selectedMaterial.title} 반응
          </span>
        </div>
        <AnimatePresence mode="wait">
          <div
            key={selectedMaterialId}
            className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${
              kpiCount === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
            }`}
          >
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
        </AnimatePresence>

        <div className={`mt-6 grid gap-5 ${isFullWidth ? '' : 'lg:grid-cols-3 lg:gap-6'}`}>
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

          <div className={isFullWidth ? '' : 'lg:col-span-2'}>
            <Card
              title="홍보 소재"
              subtitle="소재를 선택하면 상단 반응 지표와 미리보기가 변경됩니다"
              variant="accent"
            >
              <PromoMaterialSelector
                materials={promoMaterials}
                selectedId={selectedMaterialId}
                onSelect={setSelectedMaterialId}
              />
              <div className="mt-6 border-t border-sk-gray-100 pt-6">
                <PromoPreview material={selectedMaterial} />
              </div>
            </Card>
          </div>
        </div>
      </PageContent>
    </>
  );
}
