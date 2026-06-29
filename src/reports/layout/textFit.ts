/** KPI 숫자 폰트 크기 (22~28pt) — 글자 수 기반 */
export function kpiValueFontSize(value: string): number {
  const len = value.replace(/\s/g, '').length;
  if (len <= 5) return 28;
  if (len <= 7) return 26;
  if (len <= 9) return 24;
  if (len <= 11) return 22;
  return 20;
}

/** KPI 값·단위 분리 (예: "23,060명" → main + unit) */
export function splitKpiValue(value: string): { main: string; unit: string } {
  const m = value.match(/^([\d,./]+)\s*(.*)$/);
  if (m && m[1]) return { main: m[1], unit: m[2] ?? '' };
  return { main: value, unit: '' };
}

/** 헤드라인 최대 2줄 분할 (초과 시 말줄임) */
export function clampHeadline(text: string, maxCharsPerLine = 42): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxCharsPerLine * 2) return trimmed;
  return `${trimmed.slice(0, maxCharsPerLine * 2 - 1)}…`;
}

/** 인사이트 항목 — 최대 줄 수·항목 수 제한 */
export function clampInsights(items: string[], maxItems = 3, maxChars = 72): string[] {
  return items.slice(0, maxItems).map((t) => {
    const s = t.trim();
    return s.length > maxChars ? `${s.slice(0, maxChars - 1)}…` : s;
  });
}

/** bullet 최대 3줄 */
export function clampBullets(items: string[], maxLines = 3, maxChars = 80): string[] {
  return items.slice(0, maxLines).map((t) => {
    const s = t.trim();
    return s.length > maxChars ? `${s.slice(0, maxChars - 1)}…` : s;
  });
}

export function estimateHeadlineLines(headline: string): number {
  const len = headline.length;
  if (len <= 36) return 1;
  return 2;
}
