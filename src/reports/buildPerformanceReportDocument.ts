import {
  aiInsights,
  festivalInfo,
  interestsAnalysis,
  marketingKpis,
  movementAnalysis,
  promoMaterials,
  stayTimeAnalysis,
  targetSegments,
  topInflowRegions,
  TOTAL_VISITORS,
  visitorDemographics,
} from '../data/mockData';
import {
  aiFinalInsights,
  awarenessChannels,
  economicEffect,
  nps,
  revisitIntent,
  satisfaction,
  surveyOverview,
  surveySectionSummaries,
  visitPurpose,
} from '../data/surveyReportData';
import { escapeHtml, wrapReportHtml } from './reportDocumentStyles';

const DATA_SOURCE_NOTE =
  '방문객·유입·관심사·체류 분석: SK텔레콤 위치데이터 및 관심사 데이터 | 만족도·소비행태: 현장 설문조사(487명)';

const EXECUTIVE_SUMMARY = [
  `총 방문객 ${TOTAL_VISITORS.toLocaleString()}명 집계, 홍보 클릭율 ${marketingKpis.clickRate}% 달성`,
  '홍보 푸쉬·메인 배너·설문 푸쉬 등 채널별 소재 운영 및 노출 성과 확인',
  '수도권·인근 광역 유입 중심, 가족·연인 동반 방문 및 야간 체류 패턴 뚜렷',
  '식음료·컨텐츠·ART/전시 관심 세그먼트가 일반 대비 높은 점유율',
  `만족도 ${satisfaction.overall}점(5점 만점), 재방문 의향 ${revisitIntent.totalPositive}%, NPS ${nps.score}점`,
  '드론 라이트쇼 호평 대비 주차·교통·안내 개선이 핵심 과제로 도출',
];

function resolveAssetUrl(path: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return path;
}

function buildList(items: string[]): string {
  return `<ul>${items.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
}

function buildTable(
  headers: [string, string],
  rows: { label: string; value: string }[],
  alignValue = true,
): string {
  const valueAlign = alignValue ? ' class="value"' : '';
  return `
    <table>
      <thead>
        <tr><th>${escapeHtml(headers[0])}</th><th style="text-align:right">${escapeHtml(headers[1])}</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr><td>${escapeHtml(row.label)}</td><td${valueAlign}>${escapeHtml(row.value)}</td></tr>`,
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function buildSection(num: string, title: string, content: string): string {
  return `
    <div class="section">
      <div class="section-title">
        <span class="section-num">${num}</span>
        ${escapeHtml(title)}
      </div>
      ${content}
    </div>
  `;
}

function buildSubsection(title: string, content: string): string {
  return `<p class="subsection-title">${escapeHtml(title)}</p>${content}`;
}

function formatKpiValue(value: number, unit: string, decimals?: number): string {
  const formatted =
    decimals !== undefined ? value.toFixed(decimals) : value.toLocaleString();
  return `${formatted}${unit}`;
}

function buildMarketingSection(): string {
  const overallTable = buildTable(
    ['지표', '결과'],
    [
      { label: '푸쉬 발송', value: `${marketingKpis.pushSent.toLocaleString()}건` },
      { label: '도달 고객', value: `${marketingKpis.reached.toLocaleString()}명` },
      { label: '클릭 수', value: `${marketingKpis.clicks.toLocaleString()}건` },
      { label: '클릭율', value: `${marketingKpis.clickRate}%` },
    ],
  );

  const targetTable = buildTable(
    ['타겟 세그먼트', '설정'],
    targetSegments.map((seg) => ({ label: seg.label, value: '적용' })),
  );

  const materials = promoMaterials
    .map((material) => {
      const kpiRows = material.kpis.map((kpi) => ({
        label: kpi.label,
        value: formatKpiValue(kpi.value, kpi.unit, kpi.decimals),
      }));

      const images = material.previews
        .map(
          (preview) => `
          <div class="image-card">
            <img src="${escapeHtml(resolveAssetUrl(preview.image))}" alt="${escapeHtml(preview.label)}" />
            <p class="image-caption">${escapeHtml(preview.label)}</p>
          </div>
        `,
        )
        .join('');

      return `
        <div class="material-block">
          <div class="material-head">
            <h3>${escapeHtml(material.title)}</h3>
            <span>${escapeHtml(material.schedule.label)} ${escapeHtml(material.schedule.period)}</span>
          </div>
          <p class="overview-text">${escapeHtml(material.description)}</p>
          ${buildTable(['성과 지표', '결과'], kpiRows)}
          <div class="image-grid">${images}</div>
        </div>
      `;
    })
    .join('');

  return buildSection(
    '1',
    '마케팅 성과',
    `
      <p class="overview-text">축제 홍보·설문 독려·배너 노출 채널별 소재와 성과를 정리하였습니다.</p>
      ${buildSubsection('종합 홍보 성과', overallTable)}
      ${buildSubsection('타겟 세그먼트', targetTable)}
      ${buildSubsection('채널별 소재 및 노출 성과', materials)}
    `,
  );
}

function buildDataAnalysisSection(): string {
  const profileGender = buildTable(
    ['성별', '비율'],
    visitorDemographics.gender.map((g) => ({ label: g.label, value: `${g.value}%` })),
  );

  const profileResidence = buildTable(
    ['거주지', '비율'],
    visitorDemographics.residence.map((r) => ({ label: r.label, value: `${r.value}%` })),
  );

  const ageGroups = visitorDemographics.age
    .slice()
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
    .map((a) => ({ label: a.label, value: `${a.value}%` }));

  const inflowTable = buildTable(
    ['순위', '유입지역 / 방문객'],
    topInflowRegions.map((r) => ({
      label: `${r.rank}위 ${r.city}`,
      value: `${r.count.toLocaleString()}명 (${r.pct}%)`,
    })),
  );

  const interestsTable = buildTable(
    ['관심사', '점유율'],
    visitorDemographics.interests.map((i) => ({ label: i.label, value: `${i.value}%` })),
  );

  const stayTable = buildTable(
    ['체류시간', '비율 / 방문객'],
    stayTimeAnalysis.map((s) => ({
      label: s.label,
      value: `${s.value}% (${s.count.toLocaleString()}명)`,
    })),
  );

  const beforeMove = buildTable(
    ['방문 전 이동지', '비율'],
    movementAnalysis.before.items.map((p) => ({
      label: p.label,
      value: `${p.overall}%`,
    })),
  );

  const afterMove = buildTable(
    ['방문 후 이동지', '비율'],
    movementAnalysis.after.items.map((p) => ({
      label: p.label,
      value: `${p.overall}%`,
    })),
  );

  return buildSection(
    '2',
    '데이터 분석',
    `
      <p class="overview-text">SK텔레콤 위치데이터 기반 방문객 특성·유입·체류·이동 패턴 분석 결과입니다.</p>
      ${buildSubsection('2-1. 방문객 프로파일', `
        ${profileGender}
        ${profileResidence}
        ${buildTable(['연령 (상위)', '비율'], ageGroups)}
        ${buildList([
          '여성 55%·남성 45%, 수도권 거주 비중 54%',
          '가족·연인 동반 방문 비중 높음, 야간·주말 방문 집중',
        ])}
      `)}
      ${buildSubsection('2-2. 유입지역 TOP 10', inflowTable)}
      ${buildSubsection('2-3. 관심사 분석', `
        ${interestsTable}
        ${buildList(interestsAnalysis.summary)}
      `)}
      ${buildSubsection('2-4. 체류시간', `
        ${stayTable}
        ${buildList(['1~3시간 체류 구간 비중 42%로 최다', '야간 프로그램 전후 체류 시간 연장 패턴'])}
      `)}
      ${buildSubsection('2-5. 방문 전·후 이동', `
        ${beforeMove}
        ${afterMove}
        ${buildList([
          '방문 전: 버스터미널·KTX역·해수욕장 등 교통·관광 거점 이용',
          '방문 후: 먹거리 상권·카페거리·전통시장 연계 이동 활발',
        ])}
      `)}
    `,
  );
}

function buildSurveySection(): string {
  const overviewTable = buildTable(
    ['조사 지표', '결과'],
    surveyOverview.kpis.map((kpi) => ({
      label: kpi.label,
      value: `${kpi.value}${kpi.unit}`,
    })),
  );

  const programTable = buildTable(
    ['프로그램', '만족도'],
    satisfaction.byProgram.map((p) => ({
      label: p.label,
      value: `${p.score.toFixed(1)}점`,
    })),
  );

  const awarenessTable = buildTable(
    ['인지 경로', '비율'],
    awarenessChannels.overall.map((c) => ({ label: c.label, value: `${c.value}%` })),
  );

  const purposeTable = buildTable(
    ['방문 목적', '비율'],
    visitPurpose.overall.map((p) => ({ label: p.label, value: `${p.value}%` })),
  );

  const economicTable = buildTable(
    ['경제 효과 지표', '결과'],
    [
      { label: '추가 소비 경험', value: '78%' },
      { label: '1인 평균 지출', value: economicEffect.avgSpending },
      { label: '추정 경제효과', value: economicEffect.estimatedEffect },
      { label: '음식점 소비 비중', value: '42%' },
    ],
  );

  const revisitTable = buildTable(
    ['재방문·추천', '결과'],
    [
      { label: '재방문 의향(긍정)', value: `${revisitIntent.totalPositive}%` },
      { label: 'NPS', value: `${nps.score}점` },
      { label: '추천', value: `${nps.promote}%` },
      { label: '비추천', value: `${nps.detractor}%` },
    ],
  );

  return buildSection(
    '3',
    '만족도 조사',
    `
      <p class="overview-text">${escapeHtml(surveyOverview.period)} · ${escapeHtml(surveyOverview.target)} 대상 설문 결과입니다.</p>
      ${buildSubsection('3-1. 조사 개요', `
        <p class="overview-text">${escapeHtml(surveyOverview.purpose)}</p>
        ${overviewTable}
        ${buildList([...surveySectionSummaries.overview])}
      `)}
      ${buildSubsection('3-2. 응답자 프로파일', `
        ${buildTable(['항목', '결과'], [
          { label: '여성', value: '52%' },
          { label: '남성', value: '48%' },
          { label: '외지인', value: '68%' },
          { label: '가족 동반', value: '43%' },
        ])}
        ${buildList([...surveySectionSummaries.profile])}
      `)}
      ${buildSubsection('3-3. 프로그램별 만족도', `
        ${programTable}
        ${buildList([...surveySectionSummaries.satisfaction])}
      `)}
      ${buildSubsection('3-4. 인지 경로·방문 목적', `
        ${awarenessTable}
        ${purposeTable}
        ${buildList([
          ...surveySectionSummaries.awareness,
          ...surveySectionSummaries.purpose,
        ])}
      `)}
      ${buildSubsection('3-5. 지역 경제 효과', `
        ${economicTable}
        ${buildList([...surveySectionSummaries.economic])}
      `)}
      ${buildSubsection('3-6. 재방문 의향·NPS', `
        ${revisitTable}
        ${buildList([...surveySectionSummaries.revisit])}
      `)}
    `,
  );
}

function buildInsightsSection(): string {
  const insights = aiInsights
    .map(
      (item) => `
      <div class="insight-box">
        <p class="label">${escapeHtml(item.title)}</p>
        <p>${escapeHtml(item.content)}</p>
      </div>
    `,
    )
    .join('');

  return buildSection(
    '4',
    '종합 인사이트 및 개선 제안',
    `
      ${insights}
      ${buildSubsection('핵심 결과', buildList(aiFinalInsights.keyResults))}
      ${buildSubsection('정책 제안', buildList([
        ...aiFinalInsights.policyRecommendations.content.map((v) => `[콘텐츠] ${v}`),
        ...aiFinalInsights.policyRecommendations.marketing.map((v) => `[마케팅] ${v}`),
        ...aiFinalInsights.policyRecommendations.operations.map((v) => `[운영] ${v}`),
      ]))}
      ${buildSubsection('개선 우선 과제', buildList([
        '주차장 확충 및 셔틀버스 운영',
        '먹거리존 좌석·동선 확대, 혼잡 시간대 분산',
        '구역별 안내 표지판·화장실·교통 안내 보강',
      ]))}
    `,
  );
}

export function buildPerformanceReportDocument(): string {
  const kpiRows = [
    { label: '총 방문객', value: `${TOTAL_VISITORS.toLocaleString()}명` },
    { label: '홍보 클릭율', value: `${marketingKpis.clickRate}%` },
    { label: '푸쉬 도달', value: `${marketingKpis.reached.toLocaleString()}명` },
    { label: '만족도', value: `${satisfaction.overall}/5.0` },
    { label: '재방문 의향', value: `${revisitIntent.totalPositive}%` },
    { label: 'NPS', value: `${nps.score}점` },
  ];

  const body = `
    <header class="doc-header">
      <p class="org">${escapeHtml(festivalInfo.organizer)}</p>
      <h1>${escapeHtml(festivalInfo.name)}</h1>
      <p class="subtitle">성과 분석 보고서</p>
      <p class="meta">${escapeHtml(festivalInfo.period)} · ${escapeHtml(festivalInfo.location)}</p>
    </header>

    <div class="section">
      <div class="section-title">
        <span class="section-num">요약</span>
        행사 성과 요약
      </div>
      <div class="summary-box">
        <p class="summary-label">EXECUTIVE SUMMARY</p>
        ${buildList(EXECUTIVE_SUMMARY)}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <span class="section-num">개요</span>
        행사 개요
      </div>
      <p class="overview-text">
        ${escapeHtml(festivalInfo.name)}은(는) ${escapeHtml(festivalInfo.location)}에서
        ${escapeHtml(festivalInfo.period)} 동안 개최된 야간문화축제입니다.
        본 보고서는 마케팅 성과, SK 데이터 기반 방문객 분석, 현장 만족도 조사 결과를
        통합하여 행사 성과와 개선 방향을 정리하였습니다.
      </p>
      <div class="data-source">
        <strong>데이터 출처</strong><br />
        ${escapeHtml(DATA_SOURCE_NOTE)}
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <span class="section-num">★</span>
        핵심 성과 지표
      </div>
      ${buildTable(['지표', '결과'], kpiRows)}
    </div>

    ${buildMarketingSection()}
    ${buildDataAnalysisSection()}
    ${buildSurveySection()}
    ${buildInsightsSection()}

    <footer class="doc-footer">
      <p>${escapeHtml(festivalInfo.organizer)} · ${escapeHtml(festivalInfo.name)} 성과 분석 보고서</p>
      <p>데이터 출처: SK텔레콤 위치데이터 · 관심사 데이터 · 현장 설문조사</p>
    </footer>
  `;

  return wrapReportHtml(`${festivalInfo.name} 성과 분석 보고서`, body);
}

export const PERFORMANCE_REPORT_FILENAME_BASE = '해오름_야간문화축제_성과분석보고서';

export function performanceReportFilename(ext: string): string {
  return `${PERFORMANCE_REPORT_FILENAME_BASE}.${ext}`;
}

/** UI 미리보기용 요약 데이터 */
export const performanceReportPreview = {
  kpis: [
    { label: '홍보 클릭율', value: '15.0%' },
    { label: '방문객 수', value: '23,060명' },
    { label: '만족도', value: '4.4/5.0' },
    { label: '재방문 의향', value: '91%' },
  ],
  summaryLines: EXECUTIVE_SUMMARY.slice(0, 3),
  dataSource: DATA_SOURCE_NOTE,
};
