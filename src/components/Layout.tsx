import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Megaphone,
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { festivalInfo } from '../data/mockData';
import { PageTransition } from './motion';

const navItems = [
  { to: '/', icon: Home, label: '홈', shortLabel: '홈', end: true },
  { to: '/marketing', icon: Megaphone, label: '마케팅', shortLabel: '마케팅' },
  { to: '/data-analysis', icon: BarChart3, label: '데이터 분석', shortLabel: '분석' },
  { to: '/survey', icon: ClipboardList, label: '만족도 조사', shortLabel: '설문' },
  { to: '/report', icon: FileText, label: '성과 리포트', shortLabel: '리포트' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="border-b border-sk-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-sk text-sm font-bold text-white shadow-sm">
            AIM
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-sk-gray-800">SK AIM</h1>
            <p className="text-[11px] font-medium tracking-wide text-sk-gray-400">성과관리 플랫폼</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sk-orange-light text-sk-orange shadow-sm'
                  : 'text-sk-gray-600 hover:bg-sk-gray-50 hover:text-sk-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full gradient-sk" />
                )}
                <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-sk-orange' : 'text-sk-gray-400 group-hover:text-sk-gray-600'}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sk-gray-100 px-4 py-4">
        <div className="rounded-xl border border-sk-gray-100 bg-sk-gray-25 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sk-gray-400">현재 행사</p>
          <p className="mt-1.5 text-sm font-semibold leading-snug text-sk-gray-800">{festivalInfo.name}</p>
          <p className="mt-0.5 text-xs text-sk-gray-400">{festivalInfo.period}</p>
        </div>
      </div>
    </>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen min-h-[100dvh]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-sk-gray-200/80 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-sk-gray-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col bg-white shadow-elevated safe-top lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-2 text-sk-gray-500 hover:bg-sk-gray-50"
                aria-label="메뉴 닫기"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-[100dvh] min-w-0 flex-1 flex-col lg:ml-[260px]">
        {/* Mobile top bar */}
        <header className="safe-top sticky top-0 z-30 flex items-center justify-between border-b border-sk-gray-200/80 bg-white/95 px-3 py-2.5 backdrop-blur-md sm:px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2.5 text-sk-gray-600 hover:bg-sk-gray-50 active:bg-sk-gray-100"
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 px-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-sk text-[10px] font-bold text-white">
                AIM
              </div>
              <span className="truncate text-sm font-bold text-sk-gray-800">SK AIM</span>
            </div>
          </div>
          <div className="w-10 shrink-0" aria-hidden />
        </header>

        {/* Mobile bottom tab bar */}
        <nav
          className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-sk-gray-200/80 bg-white/95 backdrop-blur-md lg:hidden"
          aria-label="주요 메뉴"
        >
          <div className="flex items-stretch justify-around px-0.5 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[10px] font-medium transition-colors active:scale-95 ${
                    isActive ? 'text-sk-orange' : 'text-sk-gray-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                        isActive ? 'bg-sk-orange-light' : ''
                      }`}
                    >
                      <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-sk-orange' : ''}`} />
                    </span>
                    <span className="max-w-full truncate px-0.5">{item.shortLabel}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumb?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="border-b border-sk-gray-200/80 bg-white">
      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        {breadcrumb && (
          <div className="mb-2 flex items-center gap-1 text-xs text-sk-gray-400">
            <span className="shrink-0">SK AIM</span>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="truncate font-medium text-sk-orange">{breadcrumb}</span>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-sk-gray-800 sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-sk-gray-500">{description}</p>
          </div>
          {action && <div className="w-full shrink-0 md:w-auto">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {children}
    </div>
  );
}
