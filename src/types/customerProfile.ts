/** SK 데이터 기준 연령 구간 */
export const SK_AGE_BRACKETS = [
  '10대 이하',
  '10대 초반',
  '10대 후반',
  '20대 초반',
  '20대 후반',
  '30대 초반',
  '30대 후반',
  '40대 초반',
  '40대 후반',
  '50대 이상',
] as const;

export type SkAgeBracket = (typeof SK_AGE_BRACKETS)[number];

export interface DistributionItem {
  label: string;
  value: number;
  count?: number;
}

export interface CustomerProfile {
  id: 'expected' | 'actual' | 'default';
  title: string;
  subtitle: string;
  gender: DistributionItem[];
  age: DistributionItem[];
  traits: string[];
  residence?: DistributionItem[];
  interests?: DistributionItem[];
}
