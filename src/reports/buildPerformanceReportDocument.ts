import {
  aiInsights,
  festivalInfo,
  marketingKpis,
  reportSections,
  TOTAL_VISITORS,
} from '../data/mockData';
import { escapeHtml, wrapReportHtml } from './reportDocumentStyles';

const SECTION_CONTENT: Record<string, string[]> = {
  overview: [
    `${festivalInfo.name}은(는) ${festivalInfo.location}에서 ${festivalInfo.period} 동안 개최되었습니다.`,
    `총 방문객 ${TOTAL_VISITORS.toLocaleString()}명이 집계되었으며, SK AIM 플랫폼을 통해 홍보·방문 분석·설문·성과보고가 통합 관리되었습니다.`,
  ],
  marketing: [
    `푸쉬 발송 ${marketingKpis.pushSent.toLocaleString()}건, 도달 ${marketingKpis.reached.toLocaleString()}명, 클릭 ${marketingKpis.clicks.toLocaleString()}건`,
    `클릭율 ${marketingKpis.clickRate}%로 전년 대비 홍보 효율이 개선되었습니다.`,
  ],
  visitors: [
    `총 방문객 ${TOTAL_VISITORS.toLocaleString()}명, 수도권·인근 광역 유입 비중이 높게 나타났습니다.`,
    `가족·연인 동반 방문 비중이 상대적으로 크며, 야간 체류형 방문 패턴이 확인되었습니다.`,
  ],
  inflow: [
    '수도권·강원 인근 시군·충청권 순으로 유입이 집중되었습니다.',
    '외지인 방문객의 추가 소비 및 체류 시간이 거주자 대비 높은 경향을 보였습니다.',
  ],
  stay: [
    '체류시간 1~3시간 구간 방문객 비중이 가장 높았습니다.',
    '야간 프로그램(드론쇼·미디어아트) 전후 체류 시간이 연장되는 패턴이 관측되었습니다.',
  ],
  movement: [
    '방문 전·후 이동 동선에서 인근 상권·관광지 연계 이동이 확인되었습니다.',
    '주차장·대중교통 환승 지점 이용이 집중되어 교통 개선 필요성이 도출되었습니다.',
  ],
  survey: [
    '방문객 만족도 조사 응답 487명, 평균 만족도 4.4점(5점 만점)',
    '재방문 의향 91%, 드론 라이트쇼 만족도 4.8점으로 가장 높은 호평을 받았습니다.',
  ],
  ai: aiInsights.map((item) => `${item.title}: ${item.content}`),
  improvement: [
    '주차장 확충 및 셔틀버스 운영 강화',
    '먹거리존 좌석 확대 및 혼잡 시간대 분산 운영',
    '구역별 안내 표지판·화장실 시설 보강',
  ],
};

function buildSection(index: number, title: string, id: string): string {
  const lines = SECTION_CONTENT[id] ?? ['해당 항목 분석 결과가 포함됩니다.'];
  const list = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  return `
    <div class="section">
      <div class="section-title">
        <span class="section-num">${index}</span>
        ${escapeHtml(title)}
      </div>
      <ul>${list}</ul>
    </div>
  `;
}

export function buildPerformanceReportDocument(): string {
  const kpiRows = [
    { label: '총 방문객', value: `${TOTAL_VISITORS.toLocaleString()}명` },
    { label: '홍보 클릭율', value: `${marketingKpis.clickRate}%` },
    { label: '푸쉬 도달', value: `${marketingKpis.reached.toLocaleString()}명` },
    { label: '방문객 만족도', value: '4.4/5.0' },
    { label: '재방문 의향', value: '91%' },
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
        <span class="section-num">★</span>
        핵심 성과 요약
      </div>
      <table>
        <thead>
          <tr><th>지표</th><th style="text-align:right">결과</th></tr>
        </thead>
        <tbody>
          ${kpiRows
            .map(
              (row) =>
                `<tr><td>${escapeHtml(row.label)}</td><td class="value">${escapeHtml(row.value)}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>

    ${reportSections.map((section, idx) => buildSection(idx + 1, section.title, section.id)).join('')}

    <div class="section">
      <div class="section-title">
        <span class="section-num">AI</span>
        AI 인사이트 및 개선 제안
      </div>
      ${aiInsights
        .map(
          (insight) => `
        <div class="insight-box">
          <p class="label">${escapeHtml(insight.title)}</p>
          <p>${escapeHtml(insight.content)}</p>
        </div>
      `,
        )
        .join('')}
    </div>

    <footer class="doc-footer">
      <p>본 보고서는 SK AIM 플랫폼에 의해 자동 생성되었습니다.</p>
      <p>SK AIM · 공공기관 통합 성과관리 플랫폼</p>
    </footer>
  `;

  return wrapReportHtml(`${festivalInfo.name} 성과 분석 보고서`, body);
}

export const PERFORMANCE_REPORT_FILENAME_BASE = '해오름_야간문화축제_성과분석보고서';

export function performanceReportFilename(ext: string): string {
  return `${PERFORMANCE_REPORT_FILENAME_BASE}.${ext}`;
}
