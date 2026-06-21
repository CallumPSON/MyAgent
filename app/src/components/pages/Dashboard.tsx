import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import { summaryStats, spendByCategory, monthlySavingsTrend, defaultInitiatives } from '../../data/sampleData';
import { fmt$, fmtPct } from '../../utils/formatters';
import type { Page } from '../../types';

const RAG_COLORS = { Green: 'bg-emerald-100 text-emerald-700', Amber: 'bg-amber-100 text-amber-700', Red: 'bg-red-100 text-red-700' };

function KPI({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub: string; icon: React.ElementType; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}

interface Props { onNavigate: (p: Page) => void; }

export default function Dashboard({ onNavigate }: Props) {
  const activeInits = defaultInitiatives.filter(i => i.status === 'Active');
  const pipelineByStatus = [
    { name: 'Identified', value: 23.9, fill: '#94a3b8' },
    { name: 'Qualifying', value: 34.9, fill: '#60a5fa' },
    { name: 'In Progress', value: 50.5, fill: '#2563eb' },
    { name: 'Realized', value: 10.2, fill: '#16a34a' },
    { name: 'Closed', value: 10.0, fill: '#e5e7eb' },
  ];

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Total Spend Under Management" value={`$${summaryStats.totalSpend.toFixed(0)}M`} sub="Annualised FY2024" icon={DollarSign} accent="bg-blue-500" />
        <KPI label="Savings Pipeline" value={fmt$(summaryStats.savingsPipeline)} sub={`${fmtPct((summaryStats.savingsPipeline / summaryStats.totalSpend) * 100)} of managed spend`} icon={TrendingUp} accent="bg-violet-500" />
        <KPI label="YTD Savings Achieved" value={fmt$(summaryStats.savingsRealized)} sub={`${fmtPct((summaryStats.savingsRealized / summaryStats.savingsPipeline) * 100)} of pipeline`} icon={CheckCircle} accent="bg-emerald-500" />
        <KPI label="Active Programmes" value={String(summaryStats.activeInitiatives)} sub="Across 6 categories" icon={Activity} accent="bg-amber-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Spend by category donut */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={spendByCategory} dataKey="amount" nameKey="category" cx="42%" cy="50%" innerRadius={55} outerRadius={80}>
                {spendByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {spendByCategory.map(c => (
              <div key={c.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-gray-600">{c.category}</span>
                </div>
                <span className="text-gray-900 font-medium">${c.amount.toFixed(0)}M</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline by stage */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Savings Pipeline by Stage ($M)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pipelineByStatus} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `$${v}M`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, 'Savings']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {pipelineByStatus.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly savings trend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Monthly Savings: Target vs Actual ($M)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={monthlySavingsTrend} margin={{ right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `$${v}M`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, '']} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="target" name="Target" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={2} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Active initiatives */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">Active Programmes</h3>
          <button onClick={() => onNavigate('initiatives')} className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {activeInits.map(init => {
            const pct = init.targetSaving > 0 ? Math.min(100, (init.actualSaving / init.targetSaving) * 100) : 0;
            return (
              <div key={init.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${RAG_COLORS[init.ragStatus]}`}>{init.ragStatus}</span>
                    <p className="text-sm font-medium text-gray-800 truncate">{init.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{init.owner} · {init.category}</p>
                </div>
                <div className="text-right flex-shrink-0 w-32">
                  <p className="text-xs text-gray-500">{fmt$(init.actualSaving)} of {fmt$(init.targetSaving)}</p>
                  <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{pct.toFixed(0)}% achieved</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
