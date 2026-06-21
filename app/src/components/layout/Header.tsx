import { Bell, Settings } from 'lucide-react';
import type { Page } from '../../types';

const TITLES: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Dashboard', subtitle: 'Programme overview & key metrics' },
  spend: { title: 'Spend Analysis', subtitle: 'Categorised spend baseline & supplier intelligence' },
  opportunities: { title: 'Opportunity Pipeline', subtitle: 'Track and advance savings opportunities' },
  initiatives: { title: 'Initiative Tracker', subtitle: 'Manage active cost reduction programmes' },
};

export default function Header({ currentPage }: { currentPage: Page }) {
  const { title, subtitle } = TITLES[currentPage];
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-gray-900 font-semibold text-lg leading-tight">{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
          FY2024 · Q4
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Bell size={17} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}
