import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, PageContent } from '../components/Layout';
import { SegmentAnalysisView } from '../components/SegmentAnalysis';
import { segmentAnalysis } from '../data/segmentData';

export default function DataAnalysisInterestsDetail() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <>
      <PageHeader
        title="세그먼트 분석"
        description="일반 기준 대비 축제 방문객 관심사 비교 · 성별·연령 교차분석"
        breadcrumb="데이터 분석 · 세그먼트"
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

        <p className="mb-6 text-xs text-sk-gray-400">
          총 방문객 {segmentAnalysis.totalVisitors.toLocaleString()}명 · 관심사 {segmentAnalysis.segments.length}개
        </p>

        <SegmentAnalysisView />
      </PageContent>
    </>
  );
}
