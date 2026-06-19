import { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import { Card } from '../components/ui';
import { CustomerProfileView } from '../components/CustomerProfile';
import { topInflowRegions, TOTAL_VISITORS } from '../data/mockData';
import type { CustomerProfile } from '../types/customerProfile';

export default function DataAnalysisRegionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const region = topInflowRegions.find((r) => r.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  if (!region) {
    return <Navigate to="/data-analysis" replace />;
  }

  const profile: CustomerProfile = {
    id: 'default',
    title: region.city,
    subtitle: `유입 ${region.count.toLocaleString()}명 · 전체 대비 ${region.pct}%`,
    gender: region.gender,
    age: region.age,
    traits: [
      `${region.city} 거주·방문 고객 기준 성별·연령 분포`,
      `전체 방문객 ${TOTAL_VISITORS.toLocaleString()}명 중 ${region.count.toLocaleString()}명 유입`,
      region.rank <= 3 ? '광역권 핵심 유입 권역' : '인근·광역 유입 권역',
    ],
  };

  return (
    <>
      <PageHeader
        title={`${region.city} 유입 분석`}
        description="지역별 방문객 성별·연령 프로필"
        breadcrumb="데이터 분석 · 유입 지역"
      />
      <PageContent>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-sk-gray-500 transition-colors hover:text-sk-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          데이터 분석으로 돌아가기
        </button>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-sk-orange/20 bg-sk-orange-light/30 p-4 text-center">
            <p className="text-xs text-sk-gray-500">유입 순위</p>
            <p className="mt-1 text-2xl font-bold text-sk-orange">{region.rank}위</p>
          </div>
          <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 text-center">
            <p className="text-xs text-sk-gray-500">유입 인원</p>
            <p className="mt-1 text-2xl font-bold text-sk-gray-800">{region.count.toLocaleString()}명</p>
          </div>
          <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4 text-center">
            <p className="text-xs text-sk-gray-500">비중</p>
            <p className="mt-1 text-2xl font-bold text-sk-gray-800">{region.pct}%</p>
          </div>
        </div>

        <Card title={`${region.city} 방문객 프로필`} subtitle="성별 · 연령 분포 (SK 연령 체계)">
          <CustomerProfileView profile={profile} />
        </Card>
      </PageContent>
    </>
  );
}
