import { interestsAnalysis, topInflowRegions, visitorDemographics } from '../../data/mockData';
import {
  freeResponse,
  respondentProfile,
  satisfaction,
  visitPurpose,
} from '../../data/surveyReportData';
import type { ReportTableSpec } from '../reportTableTypes';

const AGE_BUCKETS = [
  { label: '10대', keys: ['10대 이하', '10대 초반', '10대 후반'] },
  { label: '20대', keys: ['20대 초반', '20대 후반'] },
  { label: '30대', keys: ['30대 초반', '30대 후반'] },
  { label: '40대', keys: ['40대 초반', '40대 후반'] },
  { label: '50대+', keys: ['50대 이상'] },
];

function sumAge(age: { label: string; value: number }[], keys: string[]): number {
  return age.filter((a) => keys.includes(a.label)).reduce((s, a) => s + a.value, 0);
}

function topAgeLabel(age: { label: string; value: number }[]): string {
  const bucket = AGE_BUCKETS.map((b) => ({
    label: b.label,
    value: sumAge(age, b.keys),
  })).sort((a, b) => b.value - a.value)[0];
  return bucket?.label ?? '-';
}

function regionInterests(seed: number): string[] {
  const labels = visitorDemographics.interests.slice(0, 5).map((i) => i.label);
  const values = labels.map((_, i) =>
    Math.max(8, Math.round((visitorDemographics.interests[i]?.value ?? 50) * (0.9 + ((seed + i) % 6) / 30))),
  );
  return values
    .map((v, i) => ({ label: labels[i], value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((x) => x.label);
}

function isLocal(city: string): string {
  return city === '해오름시' ? '관내' : '외지';
}

/** 1. 성별 × 연령 교차분석표 */
export function genderAgeCrossTable(): ReportTableSpec {
  const malePct = visitorDemographics.gender.find((g) => g.label === '남성')?.value ?? 45;

  return {
    id: 'gender-age-matrix',
    title: '성별 × 연령대 분포 (%)',
    headers: ['연령대', '전체', '남성', '여성'],
    rows: AGE_BUCKETS.map((b) => {
      const total = sumAge(visitorDemographics.age, b.keys);
      const male = Math.round(total * (malePct / 100) * (0.92 + (b.label.charCodeAt(0) % 5) / 40));
      const female = Math.max(0, total - male);
      return {
        cells: [b.label, `${total}%`, `${male}%`, `${female}%`],
        highlightCol: total >= 20 ? 1 : undefined,
      };
    }),
  };
}

/** 2. 유입지역 TOP10 상세 */
export function inflowTop10Table(): ReportTableSpec {
  return {
    id: 'inflow-top10',
    title: '유입지역 TOP10 상세',
    headers: ['순위', '지역', '비중', '여성', '주요 연령', '관심사 TOP3', '구분'],
    rows: topInflowRegions.map((r) => ({
      cells: [
        String(r.rank),
        r.city,
        `${r.pct}%`,
        `${r.gender.find((g) => g.label === '여성')?.value ?? '-'}%`,
        topAgeLabel(r.age),
        regionInterests(r.rank).join(', '),
        isLocal(r.city),
      ],
      highlightCol: r.rank <= 3 ? 2 : undefined,
    })),
  };
}

/** 3. 유입지역 × 성별 (TOP10) */
export function regionGenderTable(): ReportTableSpec {
  return {
    id: 'region-gender',
    title: '유입지역별 성별 비중 (%)',
    headers: ['지역', '여성', '남성', '여성-전체 대비'],
    rows: topInflowRegions.map((r) => {
      const f = r.gender.find((g) => g.label === '여성')?.value ?? 0;
      const m = r.gender.find((g) => g.label === '남성')?.value ?? 0;
      const diff = f - 55;
      return {
        cells: [r.city, `${f}%`, `${m}%`, diff >= 0 ? `+${diff}p` : `${diff}p`],
        highlightCol: f >= 58 ? 1 : undefined,
      };
    }),
  };
}

/** 4. 유입지역 × 연령 (TOP10) */
export function regionAgeMatrixTable(): ReportTableSpec {
  return {
    id: 'region-age-matrix',
    title: '유입지역별 연령대 비중 (%)',
    headers: ['지역', '10대', '20대', '30대', '40대', '50대+'],
    rows: topInflowRegions.map((r) => ({
      cells: [
        r.city,
        ...AGE_BUCKETS.map((b) => `${sumAge(r.age, b.keys)}%`),
      ],
      highlightCol: undefined,
    })),
  };
}

/** 5. 유입지역 × 관심사 */
export function regionInterestMatrixTable(): ReportTableSpec {
  const interestLabels = visitorDemographics.interests.slice(0, 5).map((i) => i.label);
  return {
    id: 'region-interest-matrix',
    title: '유입지역별 관심사 비중 (%)',
    headers: ['지역', ...interestLabels],
    rows: topInflowRegions.slice(0, 8).map((r) => ({
      cells: [
        r.city,
        ...interestLabels.map((_, i) =>
          String(Math.max(8, Math.round((visitorDemographics.interests[i]?.value ?? 50) * (0.88 + ((r.rank + i) % 7) / 35)))),
        ),
      ],
    })),
  };
}

/** 6. 관심사 TOP10 */
export function interestTop10Table(): ReportTableSpec {
  const interests = interestsAnalysis.overall;
  return {
    id: 'interest-top10',
    title: '관심사 TOP10 분석',
    headers: ['관심사', '전체', '남성', '여성', '주요 연령', '주요 유입지'],
    rows: interests.map((item, i) => ({
      cells: [
        item.label,
        `${item.value}%`,
        `${Math.max(5, item.value - 4 + (i % 3))}%`,
        `${Math.min(95, item.value + 3 - (i % 2))}%`,
        i < 2 ? '30대' : i < 4 ? '20~30대' : '40대',
        topInflowRegions[i % 5]?.city ?? '가온시',
      ],
      highlightCol: i < 3 ? 1 : undefined,
    })),
  };
}

/** 7. 관심사 × 성별 */
export function interestGenderTable(): ReportTableSpec {
  return {
    id: 'interest-gender',
    title: '관심사별 성별 비중 (%)',
    headers: ['관심사', '남성', '여성', '성별 격차'],
    rows: visitorDemographics.interests.map((item, i) => {
      const male = Math.max(5, item.value - 6 + (i % 4));
      const female = Math.min(95, item.value + 4 - (i % 3));
      return {
        cells: [item.label, `${male}%`, `${female}%`, `${female - male >= 0 ? '+' : ''}${female - male}p`],
        highlightCol: Math.abs(female - male) >= 8 ? 3 : undefined,
      };
    }),
  };
}

/** 8. 관심사 × 연령 */
export function interestAgeTable(): ReportTableSpec {
  return {
    id: 'interest-age',
    title: '관심사별 연령대 비중 (%)',
    headers: ['관심사', '20대', '30대', '40대', '50대+'],
    rows: visitorDemographics.interests.map((item, i) => ({
      cells: [
        item.label,
        `${18 + (i % 4) * 2}%`,
        `${22 + (i % 3) * 3}%`,
        `${20 + (i % 5)}%`,
        `${12 + (i % 3)}%`,
      ],
    })),
  };
}

/** 9. 응답자 프로파일 */
export function respondentProfileTable(): ReportTableSpec {
  return {
    id: 'respondent-profile',
    title: '응답자 프로파일 (N=487)',
    headers: ['구분', '항목', '비중'],
    rows: [
      ...respondentProfile.gender.map((g) => ({ cells: ['성별', g.label, `${g.value}%`] })),
      ...respondentProfile.age.slice(0, 4).map((a) => ({ cells: ['연령', a.label, `${a.value}%`] })),
      ...respondentProfile.residence.slice(0, 4).map((r) => ({ cells: ['거주지', r.label, `${r.value}%`] })),
      ...respondentProfile.companion.slice(0, 4).map((c) => ({ cells: ['동반', c.label, `${c.value}%`] })),
      ...visitPurpose.overall.slice(0, 4).map((p) => ({ cells: ['방문목적', p.label, `${p.value}%`] })),
    ],
  };
}

/** 10. 만족도 항목별 */
export function satisfactionItemsTable(): ReportTableSpec {
  return {
    id: 'satisfaction-items',
    title: '프로그램·서비스별 만족도 (5점 만점)',
    headers: ['항목', '평균', '남성', '여성', '거주자', '외지인'],
    rows: satisfaction.byProgram.map((p) => ({
      cells: [
        p.label,
        `${p.score.toFixed(1)}`,
        `${(p.score - 0.2).toFixed(1)}`,
        `${(p.score + 0.2).toFixed(1)}`,
        `${(p.score - 0.1).toFixed(1)}`,
        `${(p.score + 0.1).toFixed(1)}`,
      ],
      highlightCol: p.score >= 4.5 ? 1 : p.score <= 3.5 ? 1 : undefined,
    })),
  };
}

/** 11. 만족도 × 연령 */
export function satisfactionAgeTable(): ReportTableSpec {
  const programs = satisfaction.byProgram.slice(0, 5);
  const ages = ['20대', '30대', '40대', '50대+'];
  return {
    id: 'satisfaction-age',
    title: '연령별 프로그램 만족도',
    headers: ['프로그램', ...ages, '전체'],
    rows: programs.map((p, pi) => ({
      cells: [
        p.label.replace(' ', ''),
        ...ages.map((_, ai) => (p.score + (ai - 1) * 0.15 - pi * 0.05).toFixed(1)),
        p.score.toFixed(1),
      ],
    })),
  };
}

/** 12. 만족도 × 방문목적 */
export function satisfactionPurposeTable(): ReportTableSpec {
  return {
    id: 'satisfaction-purpose',
    title: '방문 목적별 만족도',
    headers: ['방문 목적', '전체', '드론쇼', '푸드존', '교통'],
    rows: [
      { cells: ['드론쇼 관람', '4.6', '4.9', '4.1', '3.3'], highlightCol: 1 },
      { cells: ['가족 나들이', '4.5', '4.7', '4.3', '3.5'] },
      { cells: ['먹거리 체험', '4.3', '4.5', '4.6', '3.4'], highlightCol: 3 },
      { cells: ['공연 관람', '4.4', '4.6', '4.0', '3.6'] },
    ],
  };
}

/** 13. 재방문 × 연령 */
export function revisitAgeTable(): ReportTableSpec {
  return {
    id: 'revisit-age',
    title: '연령별 재방문 의향·NPS',
    headers: ['연령', '재방문(매우+높음)', 'NPS', '추천', '비추천'],
    rows: [
      { cells: ['20대', '88%', '42', '54%', '12%'] },
      { cells: ['30대', '91%', '47', '58%', '10%'], highlightCol: 2 },
      { cells: ['40대', '93%', '49', '60%', '9%'], highlightCol: 2 },
      { cells: ['50대+', '94%', '51', '62%', '8%'], highlightCol: 2 },
    ],
  };
}

/** 14. 개선 의견 × 연령 */
export function improvementAgeTable(): ReportTableSpec {
  const keywords = satisfaction.needsImprovement;
  return {
    id: 'improvement-age',
    title: '연령별 개선 요구 키워드 (%)',
    headers: ['키워드', '20대', '30대', '40대', '50대+'],
    rows: keywords.map((kw, i) => ({
      cells: [kw, `${28 - i * 2}%`, `${32 - i}%`, `${36 + i}%`, `${38 + i * 2}%`],
      highlightCol: i === 0 ? 0 : undefined,
    })),
  };
}

/** 15. 자유응답 키워드 */
export function freeResponseTable(): ReportTableSpec {
  return {
    id: 'free-keywords',
    title: '자유응답 키워드 TOP10',
    headers: ['구분', '키워드', '빈도', '대표 응답'],
    rows: [
      ...freeResponse.positive.slice(0, 5).map((w, i) => ({
        cells: ['긍정', w.word, `${w.weight}회`, freeResponse.comments.find((c) => c.sentiment === 'positive')?.text.slice(0, 24) ?? '-'],
        highlightCol: i === 0 ? 1 : undefined,
      })),
      ...freeResponse.negative.slice(0, 5).map((w, i) => ({
        cells: ['개선', w.word, `${w.weight}회`, freeResponse.comments.find((c) => c.sentiment === 'negative')?.text.slice(0, 24) ?? '-'],
        highlightCol: i === 0 ? 1 : undefined,
      })),
    ],
  };
}
