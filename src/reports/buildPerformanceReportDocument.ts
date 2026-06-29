import { festivalInfo } from '../data/mockData';
import {
  reportBodyZones,
  reportDetailBody,
  reportFooter,
  reportSectionHeader,
  reportSlideInner,
} from './components/reportComponents';
import { stabilizeAllSlides } from './layout/layoutEngine';
import { clampBullets } from './layout/textFit';
import { escapeHtml, wrapLandscapeReportHtml } from './landscapeSlideStyles';
import {
  buildPerformanceReportSlides,
  DATA_SOURCE_NOTE,
  type PerformanceReportSlide,
} from './performanceReportSlides';

function footerText(): string {
  return `${festivalInfo.organizer} · ${festivalInfo.name}`;
}

function renderClosingBody(slide: PerformanceReportSlide): string {
  const insights = slide.aiInsights ?? [];
  const policies = slide.summary ?? [];
  const policyCols = [
    { title: '콘텐츠·프로그램', items: policies.slice(0, 2) },
    { title: '마케팅·홍보', items: policies.slice(2, 4) },
    { title: '운영·인프라', items: policies.slice(4, 6) },
  ];

  return `
    ${reportSectionHeader({
      sectionLabel: slide.sectionLabel,
      topic: slide.title,
      headline: slide.headline,
    })}
    <div class="rpt-closing">
      <div class="rpt-closing-diagnosis">
        <h4>공공·정책 관점 핵심 진단</h4>
        <ul>
          ${insights
            .map(
              (t, i) =>
                `<li data-n="${i + 1}.">${escapeHtml(t.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, ''))}</li>`,
            )
            .join('')}
        </ul>
      </div>
      <div class="rpt-closing-policy">
        ${policyCols
          .map(
            (col) => `
          <div class="rpt-closing-policy-card">
            <h5>${escapeHtml(col.title)}</h5>
            <ul>${col.items.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
          </div>`,
          )
          .join('')}
      </div>
    </div>`;
}

function renderDetailBody(slide: PerformanceReportSlide): string {
  return `
    ${reportSectionHeader({
      sectionLabel: slide.sectionLabel,
      topic: slide.title,
      headline: slide.headline,
    })}
    ${reportDetailBody({
      charts: slide.charts,
      crossCharts: slide.crossCharts,
      tables: slide.tables,
      interpretation: slide.interpretation,
      insights: slide.aiInsights,
    })}`;
}

function renderReportBody(slide: PerformanceReportSlide): string {
  return `
    ${reportSectionHeader({
      sectionLabel: slide.sectionLabel,
      topic: slide.title,
      headline: slide.headline,
    })}
    ${reportBodyZones({
      kpis: slide.kpis,
      charts: slide.charts,
      crossCharts: slide.crossCharts,
      insights: slide.aiInsights,
    })}`;
}

function renderSlide(slide: PerformanceReportSlide, index: number): string {
  const footer = reportFooter(footerText(), index + 1);

  if (slide.layout === 'cover') {
    return `
      <section class="slide-page slide-cover" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        <div class="cover-deco"></div>
        ${reportSlideInner(`
          <p class="cover-brand">SK AIM · 성과 분석 보고서</p>
          <h1 class="cover-title">${escapeHtml(slide.title)}</h1>
          <ul class="cover-meta">
            ${(slide.summary ?? []).map((l) => `<li>${escapeHtml(l)}</li>`).join('')}
          </ul>
        `)}
        ${footer}
      </section>`;
  }

  if (slide.layout === 'divider') {
    return `
      <section class="slide-page slide-divider" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        ${reportSlideInner(`
          <p class="divider-numeral">${escapeHtml(slide.sectionLabel ?? '')}</p>
          <h2 class="divider-title">${escapeHtml(slide.title)}</h2>
          ${slide.summary?.[0] ? `<p class="divider-sub">${escapeHtml(slide.summary[0])}</p>` : ''}
          <div class="divider-line"></div>
        `)}
        ${footer}
      </section>`;
  }

  if (slide.layout === 'closing') {
    return `
      <section class="slide-page slide-report" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        ${reportSlideInner(renderClosingBody(slide))}
        ${footer}
      </section>`;
  }

  if (slide.layout === 'detail') {
    return `
      <section class="slide-page slide-report slide-report--detail" data-slide-id="${escapeHtml(slide.id)}">
        <div class="slide-accent"></div>
        ${reportSlideInner(renderDetailBody(slide))}
        ${footer}
      </section>`;
  }

  return `
    <section class="slide-page slide-report" data-slide-id="${escapeHtml(slide.id)}">
      <div class="slide-accent"></div>
      ${reportSlideInner(renderReportBody(slide))}
      ${footer}
    </section>`;
}

export function buildPerformanceReportDocument(): string {
  const slides = stabilizeAllSlides(buildPerformanceReportSlides());
  const body = slides.map((s, i) => renderSlide(s, i)).join('');
  return wrapLandscapeReportHtml(`${festivalInfo.name} 성과 분석 보고서`, body);
}

export function buildStabilizedSlides(): PerformanceReportSlide[] {
  return stabilizeAllSlides(buildPerformanceReportSlides());
}

export { buildPerformanceReportSlides, DATA_SOURCE_NOTE };
export type { PerformanceReportSlide };

export const PERFORMANCE_REPORT_FILENAME_BASE = '해오름_야간문화축제_성과분석보고서';

export function performanceReportFilename(ext: string): string {
  return `${PERFORMANCE_REPORT_FILENAME_BASE}.${ext}`;
}

export const performanceReportPreview = {
  kpis: [
    { label: '방문객', value: '23,060명' },
    { label: '재방문 의향', value: '91%' },
    { label: '평균 만족도', value: '4.4점' },
    { label: 'NPS', value: '47점' },
  ],
  summaryLines: clampBullets([
    '헤드라인 → KPI 카드 → 차트 → AI 인사이트 통일 템플릿',
    'PDF/PPT 동일 HTML · 안전영역 레이아웃',
    '미리보기와 다운로드 결과 일치',
  ]),
  dataSource: DATA_SOURCE_NOTE,
};
