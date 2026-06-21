import { LayoutDashboard, BarChart2, Target, ClipboardList, TrendingUp } from 'lucide-react';
import type { Page } from '../../types';

const NAV = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'spend' as Page, label: 'Spend Analysis', icon: BarChart2 },
  { id: 'opportunities' as Page, label: 'Opportunities', icon: Target },
  { id: 'initiatives' as Page, label: 'Initiatives', icon: ClipboardList },
];

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
}

export default function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <div className="w-60 bg-slate-900 flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">ProcureIQ</div>
            <div className="text-slate-400 text-xs">Cost Optimisation</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">CP</div>
          <div>
            <div className="text-slate-200 text-xs font-medium">Callum Patt</div>
            <div className="text-slate-500 text-xs">Senior Consultant</div>
          </div>
        </div>
      </div>
    </div>
  );
}
