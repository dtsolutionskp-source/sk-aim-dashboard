import { promoMaterials, targetSegments, topInflowRegions } from '../../data/mockData';
import { computeMarketingAggregates } from '../../data/marketingReportTables';
import type { ReportTableSpec } from '../reportTableTypes';

export const OKCASHBACK_MEDIA = 'OK캐쉬백';

/** Push 발송 상세 (홍보+설문 통합) */
export function pushDetailTable(): ReportTableSpec {
  const pushes = promoMaterials.filter((m) => m.pushRows?.length);
  const rows = pushes.flatMap((m) =>
    (m.pushRows ?? []).map((r) => ({
      cells: [
        m.title,
        r.sendDate,
        r.sent.toLocaleString(),
        r.reach.toLocaleString(),
        r.clicks.toLocaleString(),
        `${r.clickRate.toFixed(1)}%`,
      ],
      highlightCol: r.clickRate >= 12 ? 5 : undefined,
    })),
  );
  return {
    id: 'mkt-push-detail',
    title: 'Push 발송·성과 상세 (OK캐쉬백)',
    headers: ['소재', '발송일', '발송', '도달', '클릭', 'CTR'],
    rows,
  };
}

/** 세그먼트별 CTR */
export function pushSegmentCtrTable(): ReportTableSpec {
  const base = [14.2, 13.1, 12.4, 11.8];
  return {
    id: 'mkt-segment-ctr',
    title: '세그먼트별 CTR (%)',
    headers: ['세그먼트', '도달', '클릭', 'CTR', '전체 대비'],
    rows: targetSegments.map((s, i) => {
      const reach = Math.round(28000 - i * 3200);
      const ctr = base[i];
      const clicks = Math.round(reach * (ctr / 100));
      return {
        cells: [s.label, reach.toLocaleString(), clicks.toLocaleString(), `${ctr}%`, i === 0 ? '+1.2p' : `${(ctr - 12).toFixed(1)}p`],
        highlightCol: i === 0 ? 3 : undefined,
      };
    }),
  };
}

/** 시간대별 CTR */
export function pushTimeCtrTable(): ReportTableSpec {
  return {
    id: 'mkt-time-ctr',
    title: '시간대별 CTR (%)',
    headers: ['시간대', '발송 비중', '클릭', 'CTR'],
    rows: [
      { cells: ['09~12시', '18%', '1,240', '8.2%'] },
      { cells: ['12~18시', '32%', '3,680', '11.5%'] },
      { cells: ['18~21시', '35%', '5,420', '15.8%'], highlightCol: 3 },
      { cells: ['21~24시', '15%', '1,390', '10.1%'] },
    ],
  };
}

/** 배너 노출 상세 */
export function bannerDetailTable(): ReportTableSpec {
  const banner = promoMaterials.find((m) => m.id === 'main-banner')!;
  return {
    id: 'mkt-banner-detail',
    title: '배너 노출·클릭 상세 (OK캐쉬백)',
    headers: ['노출기간', '배너 구분', '노출', '클릭', 'CTR'],
    rows: (banner.bannerRows ?? []).map((r) => ({
      cells: [r.period, r.placement, r.impressions.toLocaleString(), r.clicks.toLocaleString(), `${r.clickRate.toFixed(2)}%`],
      highlightCol: r.clickRate >= 5 ? 4 : undefined,
    })),
  };
}

/** 채널 비교 */
export function channelCompareTable(): ReportTableSpec {
  const mkt = computeMarketingAggregates();
  const bannerRate = mkt.impressions > 0 ? ((mkt.bannerClicks / mkt.impressions) * 100).toFixed(2) : '0';
  return {
    id: 'mkt-channel-compare',
    title: '채널별 성과 비교',
    headers: ['채널', '도달/노출', '클릭', 'CTR', '효율'],
    rows: [
      {
        cells: ['타겟 Push', `${mkt.pushReach.toLocaleString()}명`, `${mkt.pushClicks.toLocaleString()}건`, `${mkt.clickRate.toFixed(1)}%`, '높음'],
        highlightCol: 3,
      },
      {
        cells: ['앱 배너', `${mkt.impressions.toLocaleString()}건`, `${mkt.bannerClicks.toLocaleString()}건`, `${bannerRate}%`, '보통'],
      },
      {
        cells: ['통합', `${(mkt.pushReach + mkt.impressions).toLocaleString()}`, `${mkt.totalClicks.toLocaleString()}건`, `${mkt.clickRate.toFixed(1)}%`, '-'],
      },
    ],
  };
}

/** 세그먼트 교차 — 성별·연령·관심사·지역 CTR */
export function segmentCrossTable(): ReportTableSpec {
  return {
    id: 'mkt-segment-cross',
    title: '세그먼트별 CTR 교차분석 (%)',
    headers: ['구분', '세그먼트', '도달', 'CTR', '순위'],
    rows: [
      { cells: ['성별', '여성', '58,200', '14.8%', '1'], highlightCol: 3 },
      { cells: ['성별', '남성', '48,400', '11.2%', '4'] },
      { cells: ['연령', '20~30대', '42,100', '13.6%', '2'] },
      { cells: ['연령', '40~50대', '38,600', '12.9%', '3'] },
      { cells: ['관심사', '식음료', '35,200', '14.1%', '2'], highlightCol: 3 },
      { cells: ['관심사', '컨텐츠', '31,800', '13.4%', '3'] },
      { cells: ['지역', topInflowRegions[0].city, '12,400', '13.9%', '2'] },
      { cells: ['지역', topInflowRegions[1].city, '10,200', '12.7%', '4'] },
    ],
  };
}

/** 소재별 성과 비교 */
export function creativeCompareTable(): ReportTableSpec {
  const promo = promoMaterials.find((m) => m.id === 'promo-push')!;
  const survey = promoMaterials.find((m) => m.id === 'survey-push')!;
  const banner = promoMaterials.find((m) => m.id === 'main-banner')!;
  const promoReach = promo.kpis.find((k) => k.label.includes('도달'))?.value ?? 72800;
  const surveyReach = survey.kpis.find((k) => k.label.includes('도달'))?.value ?? 33600;
  const promoCtr = promo.kpis.find((k) => k.label.includes('클릭율'))?.value ?? 12;
  const surveyCtr = survey.kpis.find((k) => k.label.includes('클릭율'))?.value ?? 11.3;
  const bannerCtr = banner.kpis.find((k) => k.label.includes('클릭율'))?.value ?? 4.8;

  return {
    id: 'mkt-creative-compare',
    title: '소재별 성과 비교',
    headers: ['소재', '유형', '도달/노출', '클릭', 'CTR'],
    rows: [
      { cells: ['축제 홍보 Push', 'Push', `${promoReach.toLocaleString()}명`, `${promo.stats.clicks.toLocaleString()}건`, `${promoCtr}%`], highlightCol: 4 },
      { cells: ['설문 Push', 'G/F Push', `${surveyReach.toLocaleString()}명`, `${survey.stats.clicks.toLocaleString()}건`, `${surveyCtr}%`] },
      { cells: ['메인 배너', '배너', `${(banner.stats.impressions ?? 0).toLocaleString()}건`, `${banner.stats.clicks.toLocaleString()}건`, `${bannerCtr}%`] },
    ],
  };
}

/** 마케팅 종합 인사이트 표 */
export function marketingInsightTable(): ReportTableSpec {
  return {
    id: 'mkt-insight-summary',
    title: '마케팅 종합 진단 요약',
    headers: ['항목', '내용'],
    rows: [
      { cells: ['최고 효율 채널', '타겟 Push (CTR 12%+)'], highlightCol: 1 },
      { cells: ['최고 반응 고객군', '2050 여성·가족단위 세그먼트'] },
      { cells: ['추천 타겟', '30~40대 여성·광역권 가족'] },
      { cells: ['운영 개선', '18~21시 집중 발송·배너 DA 소재 A/B'] },
    ],
  };
}
