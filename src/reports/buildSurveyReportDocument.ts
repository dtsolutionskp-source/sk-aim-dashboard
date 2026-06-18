import {
  aiFinalInsights,
  satisfaction,
  surveyOverview,
  surveySectionSummaries,
} from '../data/surveyReportData';
import { festivalInfo } from '../data/mockData';
import { escapeHtml, wrapReportHtml } from './reportDocumentStyles';

const SURVEY_SECTIONS = [
  { title: '조사 개요', lines: surveySectionSummaries.overview },
  { title: '응답자 프로파일', lines: surveySectionSummaries.profile },
  { title: '행사 인지 경로', lines: surveySectionSummaries.awareness },
  { title: '방문 목적', lines: surveySectionSummaries.purpose },
  { title: '행사 만족도', lines: surveySectionSummaries.satisfaction },
  { title: '지역 경제 효과', lines: surveySectionSummaries.economic },
  { title: '재방문 의향', lines: surveySectionSummaries.revisit },
  { title: 'AI 종합 인사이트', lines: surveySectionSummaries.insights },
] as const;

export function buildSurveyReportDocument(): string {
  const kpiRows = surveyOverview.kpis.map((kpi) => ({
    label: kpi.label,
    value: `${kpi.value}${kpi.unit}`,
  }));

  const programRows = satisfaction.byProgram.map((item) => ({
    label: item.label,
    value: `${item.score.toFixed(1)}점`,
  }));

  const body = `
    <header class="doc-header">
      <p class="org">속초시청 관광문화과</p>
      <h1>${escapeHtml(surveyOverview.title)}</h1>
      <p class="subtitle">결과 보고서</p>
      <p class="meta">${escapeHtml(surveyOverview.period)} · ${escapeHtml(surveyOverview.target)}</p>
    </header>

    <div class="section">
      <div class="section-title">
        <span class="section-num">1</span>
        조사 개요
      </div>
      <p><strong>조사 목적:</strong> ${escapeHtml(surveyOverview.purpose)}</p>
      <table style="margin-top:12px">
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

    <div class="section">
      <div class="section-title">
        <span class="section-num">2</span>
        프로그램별 만족도
      </div>
      <table>
        <thead>
          <tr><th>항목</th><th style="text-align:right">점수</th></tr>
        </thead>
        <tbody>
          ${programRows
            .map(
              (row) =>
                `<tr><td>${escapeHtml(row.label)}</td><td class="value">${escapeHtml(row.value)}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>

    ${SURVEY_SECTIONS.map((section, idx) => {
      const list = section.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
      return `
        <div class="section">
          <div class="section-title">
            <span class="section-num">${idx + 3}</span>
            ${escapeHtml(section.title)}
          </div>
          <ul>${list}</ul>
        </div>
      `;
    }).join('')}

    <div class="section">
      <div class="section-title">
        <span class="section-num">★</span>
        핵심 결과 및 정책 제안
      </div>
      <ul>
        ${aiFinalInsights.keyResults.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
      </ul>
      <div class="insight-box" style="margin-top:12px">
        <p class="label">콘텐츠·마케팅·운영 제안</p>
        <p>${escapeHtml(
          [
            ...aiFinalInsights.policyRecommendations.content,
            ...aiFinalInsights.policyRecommendations.marketing,
            ...aiFinalInsights.policyRecommendations.operations,
          ].join(' · '),
        )}</p>
      </div>
    </div>

    <footer class="doc-footer">
      <p>${escapeHtml(festivalInfo.organizer)} · ${escapeHtml(surveyOverview.title)} 결과 보고서</p>
      <p>데이터 출처: 현장 설문조사 · SK텔레콤 위치데이터(교차분석)</p>
    </footer>
  `;

  return wrapReportHtml(`${surveyOverview.title} 결과 보고서`, body);
}

export const SURVEY_REPORT_FILENAME_BASE = '해오름_야간문화축제_만족도조사_결과보고서';

export function surveyReportFilename(ext: string): string {
  return `${SURVEY_REPORT_FILENAME_BASE}.${ext}`;
}
