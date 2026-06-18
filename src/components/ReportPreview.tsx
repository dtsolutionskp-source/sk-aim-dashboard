import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';
import { festivalInfo } from '../data/mockData';

const kpis = [
  { label: '홍보 클릭율', value: '15.0%' },
  { label: '방문객 수', value: '23,060명' },
  { label: '만족도', value: '4.3/5.0' },
];

export default function ReportPreview() {
  return (
    <div className="relative">
      {/* Document shadow layers */}
      <div className="absolute inset-4 rounded-2xl bg-sk-gray-200/50" />
      <div className="absolute inset-2 rounded-2xl bg-sk-gray-100" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-sk-gray-200 bg-white shadow-elevated"
      >
        {/* Document header bar */}
        <div className="flex items-center justify-between border-b border-sk-gray-100 bg-sk-gray-25 px-6 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sk-orange" />
            <span className="text-xs font-medium text-sk-gray-500">보고서 미리보기</span>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sk-gray-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-sk-gray-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-sk-gray-200" />
          </div>
        </div>

        {/* A4 document content */}
        <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10 sm:py-12">
          {/* Official header */}
          <div className="border-b-2 border-sk-gray-800 pb-6 text-center">
            <p className="text-xs tracking-widest text-sk-gray-400">{festivalInfo.organizer}</p>
            <h4 className="mt-3 text-xl font-bold tracking-tight text-sk-gray-800 sm:text-2xl">
              {festivalInfo.name}
            </h4>
            <p className="mt-1 text-base font-medium text-sk-gray-600">성과 분석 보고서</p>
            <p className="mt-3 text-sm text-sk-gray-400">{festivalInfo.period}</p>
          </div>

          {/* Section 1 */}
          <div className="mt-8">
            <h5 className="flex items-center gap-2 text-sm font-bold text-sk-gray-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sk-gray-800 text-xs text-white">1</span>
              행사 개요
            </h5>
            <p className="mt-3 text-sm leading-[1.8] text-sk-gray-600">
              {festivalInfo.name}은(는) {festivalInfo.location}에서 개최되었으며,
              총 <strong className="font-semibold text-sk-gray-800">23,060명</strong>이 방문하였습니다.
              SK AIM 플랫폼을 통해 홍보부터 방문 분석, 설문조사, 성과보고까지 통합 관리되었습니다.
            </p>
          </div>

          {/* Section 2 - KPI table style */}
          <div className="mt-8">
            <h5 className="flex items-center gap-2 text-sm font-bold text-sk-gray-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sk-gray-800 text-xs text-white">2</span>
              핵심 성과 요약
            </h5>
            <div className="mt-4 overflow-hidden rounded-xl border border-sk-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sk-gray-200 bg-sk-gray-25">
                    <th className="px-4 py-2.5 text-left font-semibold text-sk-gray-600">지표</th>
                    <th className="px-4 py-2.5 text-right font-semibold text-sk-gray-600">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.map((kpi, i) => (
                    <motion.tr
                      key={kpi.label}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-sk-gray-100 last:border-0"
                    >
                      <td className="px-4 py-3 text-sk-gray-600">{kpi.label}</td>
                      <td className="px-4 py-3 text-right font-bold text-sk-orange">{kpi.value}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3 - AI insight */}
          <div className="mt-8">
            <h5 className="flex items-center gap-2 text-sm font-bold text-sk-gray-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sk-gray-800 text-xs text-white">3</span>
              AI 인사이트
            </h5>
            <div className="mt-3 rounded-xl border border-sk-orange/15 bg-sk-orange-light/30 p-4">
              <div className="flex items-center gap-2 text-sk-orange">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold">자동 분석 결과</span>
              </div>
              <p className="mt-2 text-sm leading-[1.8] text-sk-gray-600">
                드론쇼 만족도가 높으며, 주차 및 먹거리존 개선이 핵심 과제로 도출되었습니다.
                수도권·인근 광역시 유입과 가족 단위 방문 비중이 높게 나타났습니다.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 border-t border-sk-gray-200 pt-6 text-center">
            <p className="text-[10px] text-sk-gray-400">
              본 보고서는 SK AIM 플랫폼에 의해 자동 생성되었습니다.
            </p>
            <p className="mt-1 text-[10px] text-sk-gray-300">SK AIM · 공공기관 통합 성과관리 플랫폼</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
