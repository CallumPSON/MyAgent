import { Compass, BarChart3, Network, Users } from 'lucide-react';
import type { OrgTab } from '../types';

const TABS: { id: OrgTab; label: string; sublabel: string; Icon: React.ElementType }[] = [
  { id: 'framework', label: 'Framework', sublabel: 'Value Architect model', Icon: Compass },
  { id: 'assessment', label: 'Assessment', sublabel: 'As-is vs to-be scoring', Icon: BarChart3 },
  { id: 'orgdesign', label: 'Org Design', sublabel: 'Structure & archetypes', Icon: Network },
  { id: 'roles', label: 'Role Architecture', sublabel: 'Profiles, skills & careers', Icon: Users },
];

interface Props {
  activeTab: OrgTab;
  onTabChange: (t: OrgTab) => void;
}

export default function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-1">
        {TABS.map(({ id, label, sublabel, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2.5 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Icon size={16} />
            <div className="text-left">
              <div className="leading-tight">{label}</div>
              <div className="text-xs font-normal text-gray-400 leading-tight">{sublabel}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
