import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, BarChart3, ClipboardList, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { PageContent } from '../components/Layout';
import { Stagger, StaggerItem } from '../components/motion';
import { festivalInfo } from '../data/mockData';

const menuCards = [
  {
    to: '/marketing',
    icon: Megaphone,
    title: '마케팅',
    description: '홍보 타겟 설정 및 반응 분석',
    kpi: '클릭율 15.0%',
    color: 'from-orange-500/10 to-red-500/5',
  },
  {
    to: '/data-analysis',
    icon: BarChart3,
    title: '데이터 분석',
    description: '방문객 특성 및 공간 분석',
    kpi: '방문객 23,060명',
    color: 'from-sk-orange/10 to-amber-500/5',
  },
  {
    to: '/survey',
    icon: ClipboardList,
    title: '만족도 조사',
    description: '방문객 만족도 조사 결과 분석',
    kpi: '만족도 4.4/5.0',
    color: 'from-amber-500/10 to-orange-500/5',
  },
  {
    to: '/report',
    icon: FileText,
    title: '성과 리포트',
    description: '공공기관 제출용 보고서 생성',
    kpi: '자동 생성 완료',
    color: 'from-red-500/10 to-sk-orange/5',
  },
];

const journeySteps = [
  { phase: '방문 전', items: ['타겟 홍보', '푸쉬 발송', '관심 고객 유입'], num: '01' },
  { phase: '방문 중', items: ['방문객 추적', '체류 분석', '공간 히트맵'], num: '02' },
  { phase: '방문 후', items: ['설문 수집', '소비 분석', '성과 보고'], num: '03' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 gradient-sk-subtle" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sk-orange/5 blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 h-60 w-60 rounded-full bg-sk-red/5 blur-3xl" />

        <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sk-orange/20 bg-white/80 px-4 py-2 text-sm font-medium text-sk-orange shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-sk-orange animate-pulse" />
              {festivalInfo.name} · {festivalInfo.period}
            </div>
            <h1 className="text-balance text-3xl font-bold leading-[1.2] tracking-tight text-sk-gray-800 sm:text-4xl lg:text-[2.75rem]">
              홍보부터 분석, 성과보고까지{' '}
              <span className="text-sk-orange">한 번에</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-sk-gray-600 sm:text-xl">
              방문 전 · 방문 중 · 방문 후 데이터를 하나로 관리하세요
            </p>
            <p className="mt-3 text-sm text-sk-gray-400">
              {festivalInfo.organizer} · {festivalInfo.location}
            </p>
          </motion.div>

          {/* Journey steps */}
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-14">
            {journeySteps.map((step, idx) => (
              <StaggerItem key={step.phase}>
                <div className="group relative">
                  <div className="rounded-2xl border border-sk-gray-200/80 bg-white/80 p-5 shadow-card backdrop-blur-sm transition-all hover:shadow-card-hover sm:p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-sk-orange">
                        {step.phase}
                      </p>
                      <span className="text-2xl font-bold text-sk-gray-100 transition-colors group-hover:text-sk-orange/20">
                        {step.num}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-sk-gray-600">
                          <span className="h-1 w-1 rounded-full bg-sk-orange/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {idx < journeySteps.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-sk-gray-200 lg:block" />
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <PageContent>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {menuCards.map((card) => (
            <StaggerItem key={card.to}>
              <Link
                to={card.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sk-gray-200/80 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-sk-orange/25 hover:shadow-card-hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sk-orange-light text-sk-orange transition-all group-hover:gradient-sk group-hover:text-white group-hover:shadow-sm">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-sk-gray-800">{card.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-sk-gray-500">{card.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-sk-orange">{card.kpi}</p>
                    <ArrowRight className="h-4 w-4 text-sk-gray-300 transition-all group-hover:translate-x-1 group-hover:text-sk-orange" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 overflow-hidden rounded-2xl border border-sk-gray-200/80 bg-white shadow-card"
        >
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-sk text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-sk-orange">핵심 메시지</p>
              <p className="mt-2 text-base leading-[1.8] text-sk-gray-600">
                SK AIM은 단순 데이터 분석 서비스가 아닙니다. 홍보 → 방문객 분석 → 설문조사 →
                경제효과 분석 → 성과보고서 작성까지 지원하는{' '}
                <strong className="font-semibold text-sk-gray-800">공공기관 통합 성과관리 플랫폼</strong>입니다.
              </p>
            </div>
          </div>
        </motion.div>
      </PageContent>
    </>
  );
}
