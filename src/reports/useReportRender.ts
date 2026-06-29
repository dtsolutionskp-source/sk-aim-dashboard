import { useContext } from 'react';
import { ReportRenderContext } from './reportRenderTypes';

export function useReportRender() {
  const ctx = useContext(ReportRenderContext);
  if (!ctx) {
    throw new Error('useReportRender는 ReportRenderProvider 내부에서 사용해야 합니다.');
  }
  return ctx;
}

export function useReportRenderOptional() {
  return useContext(ReportRenderContext);
}
