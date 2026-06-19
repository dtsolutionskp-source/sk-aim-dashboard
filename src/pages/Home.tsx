import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, BarChart3, ClipboardList, FileText, ArrowRight, type LucideIcon } from 'lucide-react';
import { PageContent } from '../components/Layout';
import { Stagger, StaggerItem } from '../components/motion';
import { festivalInfo } from '../data/mockData';

const menuCards = [
  {
    to: '/marketing',
    icon: Megaphone,
    title: '마케팅',
    description: '홍보 타겟 설정 및 반응 분석',
  },
  {
    to: '/data-analysis',
    icon: BarChart3,
    title: '데이터 분석',
    description: '방문객 특성 및 공간 분석',
  },
  {
    to: '/survey',
    icon: ClipboardList,
    title: '만족도 조사',
    description: '방문객 만족도 조사 결과 분석',
  },
  {
    to: '/report',
    icon: FileText,
    title: '성과 리포트',
    description: '공공기관 제출용 보고서 생성',
  },
];

const journeySteps: Array<
  | { phase: string; icon: LucideIcon; items: string[] }
  | { phase: string; icons: LucideIcon[]; items: string[] }
> = [
  {
    phase: '방문 전',
    icon: Megaphone,
    items: ['타겟 홍보', '푸쉬 발송', '관심 고객 유입'],
  },
  {
    phase: '방문 중',
    icon: BarChart3,
    items: ['방문객 추적', '체류 분석', '공간 분석'],
  },
  {
    phase: '방문 후',
    icons: [ClipboardList, FileText],
    items: ['설문 수집', '소비 분석', '성과 보고'],
  },
];

export default function Home() {
  return (
    <>
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 gradient-sk-subtle" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sk-orange/5 blur-3xl" />

        <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4">
              <img
                src="/sk-logo.png"
                alt="SK"
                className="h-12 w-auto object-contain sm:h-14"
              />
              <h1 className="text-3xl font-bold tracking-tight text-sk-gray-800 sm:text-4xl">
                SK AIM
              </h1>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-sk-gray-500 sm:text-base">
              홍보부터 분석, 성과보고까지 한 번에
            </p>
            <p className="mt-6 text-sm text-sk-gray-400">
              {festivalInfo.name} · {festivalInfo.period} · {festivalInfo.organizer}
            </p>
          </motion.div>

          <div className="mt-12 lg:mt-14">
            <div className="relative hidden sm:block">
              <div className="absolute left-[16.67%] right-[16.67%] top-8 h-px bg-sk-gray-200" />
            </div>
            <Stagger className="grid gap-4 sm:grid-cols-3">
              {journeySteps.map((step, idx) => (
                <StaggerItem key={step.phase}>
                  <div className="relative flex h-full flex-col">
                    <div className="rounded-2xl border border-sk-gray-200/80 bg-white/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
                      <div className="flex items-center gap-2.5">
                        {'icons' in step ? (
                          <div className="flex items-center gap-1">
                            {step.icons.map((Icon, iconIdx) => (
                              <Icon
                                key={iconIdx}
                                className="h-3.5 w-3.5 text-sk-gray-400"
                                strokeWidth={2}
                              />
                            ))}
                          </div>
                        ) : (
                          <step.icon className="h-3.5 w-3.5 text-sk-gray-400" strokeWidth={2} />
                        )}
                        <p className="text-sm font-semibold text-sk-gray-800">{step.phase}</p>
                      </div>
                      <ul className="mt-4 space-y-2 border-t border-sk-gray-100 pt-4">
                        {step.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-sk-gray-600">
                            <span className="h-1 w-1 shrink-0 rounded-full bg-sk-gray-300" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {idx < journeySteps.length - 1 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-sk-gray-300 sm:block" />
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>

      <PageContent>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {menuCards.map((card) => (
            <StaggerItem key={card.to}>
              <Link
                to={card.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sk-gray-200/80 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-sk-gray-300 hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sk-gray-50 text-sk-gray-600 transition-colors group-hover:bg-sk-gray-100">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-sk-gray-800">{card.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-sk-gray-500">
                  {card.description}
                </p>
                <ArrowRight className="mt-4 h-4 w-4 text-sk-gray-300 transition-all group-hover:translate-x-1 group-hover:text-sk-gray-500" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </PageContent>
    </>
  );
}
