import type { CustomerProfile } from '../types/customerProfile';
import { SK_AGE_BRACKETS } from '../types/customerProfile';

/** 데이터 분석용 기본 방문객 프로필 (SK 위치데이터 기반) */
export const defaultVisitorProfile: CustomerProfile = {
  id: 'default',
  title: '방문객 프로필',
  subtitle: 'SK 위치데이터 기반 방문객 특성',
  gender: [
    { label: '여성', value: 55 },
    { label: '남성', value: 45 },
  ],
  age: [
    { label: '10대 이하', value: 6 },
    { label: '10대 초반', value: 4 },
    { label: '10대 후반', value: 6 },
    { label: '20대 초반', value: 11 },
    { label: '20대 후반', value: 13 },
    { label: '30대 초반', value: 15 },
    { label: '30대 후반', value: 14 },
    { label: '40대 초반', value: 11 },
    { label: '40대 후반', value: 9 },
    { label: '50대 이상', value: 11 },
  ],
  traits: [
    '가족·연인 동반 방문 비중 높음',
    '수도권·인근 광역시에서의 유입이 주를 이룸',
    '야간 문화·축제 콘텐츠 관심층 집중',
    '주말·저녁 시간대 방문 비중 높음',
  ],
  residence: [
    { label: '수도권', value: 54 },
    { label: '강원', value: 26 },
    { label: '충청', value: 12 },
    { label: '기타', value: 8 },
  ],
  interests: [
    { label: '식음료', value: 81 },
    { label: '컨텐츠', value: 72 },
    { label: '여행', value: 58 },
    { label: '패션', value: 45 },
    { label: 'ART/전시', value: 38 },
    { label: '출산/육아', value: 31 },
  ],
};

/** 마케팅 타겟 기반 추정 고객 프로필 */
export const estimatedCustomerProfile: CustomerProfile = {
  id: 'expected',
  title: '추정 고객 프로필',
  subtitle: 'SK 데이터 기반 타겟 세그먼트 분석',
  gender: [
    { label: '여성', value: 72 },
    { label: '남성', value: 28 },
  ],
  age: [
    { label: '10대 이하', value: 3 },
    { label: '10대 초반', value: 2 },
    { label: '10대 후반', value: 4 },
    { label: '20대 초반', value: 8 },
    { label: '20대 후반', value: 12 },
    { label: '30대 초반', value: 18 },
    { label: '30대 후반', value: 20 },
    { label: '40대 초반', value: 15 },
    { label: '40대 후반', value: 12 },
    { label: '50대 이상', value: 6 },
  ],
  traits: [
    '수도권 거주·근무',
    '가족 단위(기혼·키즈) 방문 성향',
    '여행·관광 App 이용 활발',
    '야간 문화·축제 콘텐츠 관심 높음',
    '2050 여성 핵심 타겟 집중',
  ],
  residence: [
    { label: '수도권', value: 68 },
    { label: '강원', value: 14 },
    { label: '충청', value: 10 },
    { label: '기타', value: 8 },
  ],
  interests: [
    { label: '관광/여행', value: 52 },
    { label: '가족/육아', value: 24 },
    { label: '문화/공연', value: 14 },
    { label: '음식/맛집', value: 10 },
  ],
};

/** @deprecated estimatedCustomerProfile 사용 */
export const expectedCustomerProfile = estimatedCustomerProfile;

/** 실제 방문객 프로필 (SK 연령 체계) */
export const actualVisitorProfile: CustomerProfile = {
  id: 'actual',
  title: '실제 방문객 프로필',
  subtitle: '행사 기간 방문객 데이터 분석',
  gender: [
    { label: '여성', value: 58, count: 13386 },
    { label: '남성', value: 42, count: 9674 },
  ],
  age: [
    { label: '10대 이하', value: 8, count: 1845 },
    { label: '10대 초반', value: 5, count: 1153 },
    { label: '10대 후반', value: 7, count: 1614 },
    { label: '20대 초반', value: 12, count: 2767 },
    { label: '20대 후반', value: 14, count: 3228 },
    { label: '30대 초반', value: 16, count: 3690 },
    { label: '30대 후반', value: 14, count: 3228 },
    { label: '40대 초반', value: 10, count: 2306 },
    { label: '40대 후반', value: 8, count: 1845 },
    { label: '50대 이상', value: 6, count: 1384 },
  ],
  traits: [
    '가족 단위 방문 비중 추정 대비 +12%p',
    '20~30대 유입 추정보다 높음',
    '수도권 유입 52% (추정 68% 대비 낮음)',
    '드론쇼·먹거리 관심 집중',
    '현장 신규 유입층(10대) 비중 확대',
  ],
  residence: [
    { label: '수도권', value: 52 },
    { label: '강원', value: 28 },
    { label: '충청', value: 12 },
    { label: '기타', value: 8 },
  ],
  interests: [
    { label: '관광/여행', value: 45 },
    { label: '음식/맛집', value: 28 },
    { label: '문화/공연', value: 18 },
    { label: '가족/육아', value: 9 },
  ],
};

/** SK 연령 구간 유효성 검증용 */
export function isValidSkAgeProfile(age: { label: string }[]): boolean {
  return age.length === SK_AGE_BRACKETS.length &&
    age.every((item, i) => item.label === SK_AGE_BRACKETS[i]);
}
