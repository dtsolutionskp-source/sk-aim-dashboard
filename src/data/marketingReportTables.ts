import { promoMaterials, targetSegments, type PromoMaterial } from './mockData';

export interface ReportDataTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface ReportDataTable {
  columns: ReportDataTableColumn[];
  rows: Record<string, string>[];
  totalRow?: Record<string, string>;
}

export function computeMarketingAggregates() {
  const pushes = promoMaterials.filter((m) => m.id !== 'main-banner');
  const banner = promoMaterials.find((m) => m.id === 'main-banner')!;
  const pushReach = pushes.reduce((s, m) => {
    const k = m.kpis.find((kpi) => kpi.label.includes('도달'));
    return s + (k?.value ?? 0);
  }, 0);
  const impressions = banner.kpis.find((k) => k.label.includes('노출'))?.value ?? 0;
  const pushClicks = pushes.reduce((s, m) => s + m.stats.clicks, 0);
  const bannerClicks = banner.stats.clicks;
  const totalClicks = pushClicks + bannerClicks;
  const clickRate = pushReach > 0 ? (pushClicks / pushReach) * 100 : 0;
  return { pushReach, impressions, totalClicks, pushClicks, bannerClicks, clickRate };
}

export function buildPushDataTable(material: PromoMaterial): ReportDataTable {
  const rows = material.pushRows ?? [];
  const totalSent = rows.reduce((s, r) => s + r.sent, 0);
  const totalReach = rows.reduce((s, r) => s + r.reach, 0);
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const totalRate = totalReach > 0 ? (totalClicks / totalReach) * 100 : 0;

  return {
    columns: [
      { key: 'media', label: 'Media 구분', align: 'left' },
      { key: 'date', label: '발송일자', align: 'center' },
      { key: 'sent', label: '발송건수', align: 'right' },
      { key: 'reach', label: 'Noti', align: 'right' },
      { key: 'clicks', label: '클릭수', align: 'right' },
      { key: 'rate', label: '클릭율', align: 'right' },
    ],
    rows: rows.map((r) => ({
      media: r.media,
      date: r.sendDate,
      sent: r.sent.toLocaleString(),
      reach: r.reach.toLocaleString(),
      clicks: r.clicks.toLocaleString(),
      rate: `${r.clickRate.toFixed(2)}%`,
    })),
    totalRow: {
      media: 'TOTAL',
      date: '',
      sent: totalSent.toLocaleString(),
      reach: totalReach.toLocaleString(),
      clicks: totalClicks.toLocaleString(),
      rate: `${totalRate.toFixed(2)}%`,
    },
  };
}

export function buildBannerDataTable(material: PromoMaterial): ReportDataTable {
  const rows = material.bannerRows ?? [];
  const totalPv = rows.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
  const totalRate = totalPv > 0 ? (totalClicks / totalPv) * 100 : 0;

  return {
    columns: [
      { key: 'media', label: 'Media 구분', align: 'left' },
      { key: 'period', label: '노출 일자', align: 'center' },
      { key: 'placement', label: '배너 구분', align: 'left' },
      { key: 'pv', label: '노출 PV', align: 'right' },
      { key: 'clicks', label: 'PV클릭', align: 'right' },
      { key: 'rate', label: 'PV클릭율', align: 'right' },
    ],
    rows: rows.map((r) => ({
      media: r.media,
      period: r.period,
      placement: r.placement,
      pv: r.impressions.toLocaleString(),
      clicks: r.clicks.toLocaleString(),
      rate: `${r.clickRate.toFixed(2)}%`,
    })),
    totalRow: {
      media: 'TOTAL',
      period: '',
      placement: '',
      pv: totalPv.toLocaleString(),
      clicks: totalClicks.toLocaleString(),
      rate: `${totalRate.toFixed(2)}%`,
    },
  };
}

export function buildMarketingSummaryDataTable(
  mkt: ReturnType<typeof computeMarketingAggregates>,
): ReportDataTable {
  const pushRate = mkt.clickRate.toFixed(2);
  const bannerRate =
    mkt.impressions > 0 ? ((mkt.bannerClicks / mkt.impressions) * 100).toFixed(2) : '0.00';
  const allReach = mkt.pushReach + mkt.impressions;
  const allClicks = mkt.totalClicks;
  const allRate = mkt.pushReach > 0 ? ((allClicks / mkt.pushReach) * 100).toFixed(2) : '0.00';

  return {
    columns: [
      { key: 'channel', label: '구분', align: 'left' },
      { key: 'reach', label: '도달/노출', align: 'right' },
      { key: 'clicks', label: '클릭', align: 'right' },
      { key: 'rate', label: '클릭율', align: 'right' },
    ],
    rows: [
      {
        channel: '타겟 Push',
        reach: `${mkt.pushReach.toLocaleString()}명`,
        clicks: `${mkt.pushClicks.toLocaleString()}건`,
        rate: `${pushRate}%`,
      },
      {
        channel: '앱 노출',
        reach: `${mkt.impressions.toLocaleString()}건`,
        clicks: `${mkt.bannerClicks.toLocaleString()}건`,
        rate: `${bannerRate}%`,
      },
    ],
    totalRow: {
      channel: 'TOTAL',
      reach: allReach.toLocaleString(),
      clicks: `${allClicks.toLocaleString()}건`,
      rate: `${allRate}%`,
    },
  };
}

export function getMaterialDataTable(material: PromoMaterial): ReportDataTable | undefined {
  if (material.pushRows?.length) return buildPushDataTable(material);
  if (material.bannerRows?.length) return buildBannerDataTable(material);
  return undefined;
}

export function getPushTargetLabels(material: PromoMaterial): string[] {
  if (material.id === 'main-banner') return [];
  return targetSegments.map((s) => s.label);
}
