import { Link } from 'react-router-dom';
import { Megaphone, BarChart3, ClipboardList, FileText, ArrowRight } from 'lucide-react';
import { PageContent } from '../components/Layout';
import { festivalInfo } from '../data/mockData';

const menuCards = [
  {
    to: '/marketing',
    icon: Megaphone,
    title: '마케팅',
    description: '홍보 타겟 설정 및 반응 분석',
    kpi: 'CTR 15.0%',
  },
  {
    to: '/data-analysis',
    icon: BarChart3,
    title: '데이터 분석',
    description: '방문객 특성 및 공간 분석',
    kpi: '방문객 23,060명',
  },
  {
    to: '/survey',
    icon: ClipboardList,
    title: '설문 분석',
    description: '만족도 및 정성 의견 분석',
    kpi: '만족도 4.3/5.0',
  },
  {
    to: '/report',
    icon: FileText,
    title: '성과 리포트',
    description: '공공기관 제출용 보고서 생성',
    kpi: '자동 생성 완료',
  },
];

const journeySteps = [
  { phase: '방문 전', items: ['타겟 홍보', '푸쉬 발송', '관심 고객 유입'] },
  { phase: '방문 중', items: ['방문객 추적', '체류 분석', '공간 히트맵'] },
  { phase: '방문 후', items: ['설문 수집', '소비 분석', '성과 보고'] },
];

export default function Home() {
  return (
    <>
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-sk-orange-light/50 via-white to-white" />
        <div className="relative px-8 py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-sk-orange-light px-4 py-1.5 text-sm font-medium text-sk-orange">
              {festivalInfo.name} · {festivalInfo.period}
            </div>
            <h1 className="text-3xl font-bold leading-tight text-sk-gray-800 md:text-4xl">
              홍보부터 분석, 성과보고까지 한 번에
            </h1>
            <p className="mt-4 text-lg text-sk-gray-600">
              방문 전 · 방문 중 · 방문 후 데이터를 하나로 관리하세요
            </p>
            <p className="mt-2 text-sm text-sk-gray-400">
              {festivalInfo.organizer} · {festivalInfo.location}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            {journeySteps.map((step, idx) => (
              <div key={step.phase} className="flex items-center gap-4">
                <div className="rounded-xl border border-sk-gray-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sk-orange">
                    {step.phase}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {step.items.map((item) => (
                      <li key={item} className="text-sm text-sk-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {idx < journeySteps.length - 1 && (
                  <ArrowRight className="hidden h-5 w-5 text-sk-gray-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageContent>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {menuCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group rounded-xl border border-sk-gray-200 bg-white p-6 shadow-sm transition-all hover:border-sk-orange/30 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sk-orange-light text-sk-orange transition-colors group-hover:bg-sk-orange group-hover:text-white">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-sk-gray-800">{card.title}</h3>
              <p className="mt-1 text-sm text-sk-gray-500">{card.description}</p>
              <p className="mt-3 text-sm font-semibold text-sk-orange">{card.kpi}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-sk-orange/20 bg-sk-orange-light/30 p-6">
          <p className="text-sm font-medium text-sk-orange">핵심 메시지</p>
          <p className="mt-2 text-base leading-relaxed text-sk-gray-700">
            SK AIM은 단순 데이터 분석 서비스가 아닙니다. 홍보 → 방문객 분석 → 설문조사 → 경제효과 분석 →
            성과보고서 작성까지 지원하는 <strong>공공기관 통합 성과관리 플랫폼</strong>입니다.
          </p>
        </div>
      </PageContent>
    </>
  );
}
