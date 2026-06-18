import { NavLink, Outlet } from 'react-router-dom';
import {
  Megaphone,
  BarChart3,
  ClipboardList,
  FileText,
  Home,
  ChevronRight,
} from 'lucide-react';
import { festivalInfo } from '../data/mockData';

const navItems = [
  { to: '/', icon: Home, label: '홈', end: true },
  { to: '/marketing', icon: Megaphone, label: '마케팅' },
  { to: '/data-analysis', icon: BarChart3, label: '데이터 분석' },
  { to: '/survey', icon: ClipboardList, label: '설문 분석' },
  { to: '/report', icon: FileText, label: '성과 리포트' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sk-gray-200 bg-white">
        <div className="border-b border-sk-gray-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sk-orange text-sm font-bold text-white">
              AIM
            </div>
            <div>
              <h1 className="text-lg font-bold text-sk-gray-800">SK AIM</h1>
              <p className="text-xs text-sk-gray-400">성과관리 플랫폼</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sk-orange-light text-sk-orange'
                    : 'text-sk-gray-600 hover:bg-sk-gray-50 hover:text-sk-gray-800'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sk-gray-100 px-4 py-4">
          <div className="rounded-lg bg-sk-gray-50 p-3">
            <p className="text-xs font-medium text-sk-gray-500">현재 행사</p>
            <p className="mt-1 text-sm font-semibold text-sk-gray-800">{festivalInfo.name}</p>
            <p className="text-xs text-sk-gray-400">{festivalInfo.period}</p>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumb?: string;
}

export function PageHeader({ title, description, breadcrumb }: PageHeaderProps) {
  return (
    <div className="border-b border-sk-gray-200 bg-white px-8 py-6">
      {breadcrumb && (
        <div className="mb-2 flex items-center gap-1 text-xs text-sk-gray-400">
          <span>SK AIM</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-sk-orange">{breadcrumb}</span>
        </div>
      )}
      <h2 className="text-2xl font-bold text-sk-gray-800">{title}</h2>
      <p className="mt-1 text-sm text-sk-gray-500">{description}</p>
    </div>
  );
}

export function PageContent({ children }: { children: React.ReactNode }) {
  return <div className="p-8">{children}</div>;
}
