import { useState } from 'react';
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
  { to: '/', icon: Home, label: '홈', end: true },
  { to: '/marketing', icon: Megaphone, label: '마케팅' },
  { to: '/data-analysis', icon: BarChart3, label: '데이터 분석' },
  { to: '/survey', icon: ClipboardList, label: '만족도 조사' },
  { to: '/report', icon: FileText, label: '성과 리포트' },
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

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-sk-gray-200/80 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
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
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-elevated lg:hidden"
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

      <div className="flex min-h-screen flex-1 flex-col lg:ml-[260px]">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sk-gray-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2.5 text-sk-gray-600 hover:bg-sk-gray-50"
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-sk text-[10px] font-bold text-white">
              AIM
            </div>
            <span className="text-sm font-bold text-sk-gray-800">SK AIM</span>
          </div>
          <div className="w-10" />
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-sk-gray-200/80 bg-white/95 backdrop-blur-md lg:hidden">
          <div className="flex items-stretch justify-around px-1 py-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-sk-orange' : 'text-sk-gray-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-sk-orange' : ''}`} />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="flex-1 pb-20 lg:pb-0">
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
      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        {breadcrumb && (
          <div className="mb-2 flex items-center gap-1 text-xs text-sk-gray-400">
            <span>SK AIM</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-sk-orange">{breadcrumb}</span>
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-sk-gray-800 sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-sk-gray-500">{description}</p>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">{children}</div>;
}
