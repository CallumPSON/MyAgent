import { useState, Fragment } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Plus, ChevronDown, ChevronUp, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { defaultInitiatives } from '../../data/sampleData';
import { fmt$, fmtPct, fmtDate } from '../../utils/formatters';
import type { Initiative, InitiativeStatus, RAGStatus, MilestoneStatus } from '../../types';

const STATUS_BADGE: Record<InitiativeStatus, string> = {
  Planning: 'bg-blue-100 text-blue-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-gray-100 text-gray-600',
  'On Hold': 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};
const RAG_COLORS: Record<RAGStatus, string> = {
  Green: 'bg-emerald-500',
  Amber: 'bg-amber-400',
  Red: 'bg-red-500',
};
const MS_ICON: Record<MilestoneStatus, React.ReactNode> = {
  Complete: <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />,
  Pending: <Clock size={14} className="text-gray-300 flex-shrink-0" />,
  Overdue: <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />,
};

const CATEGORIES = [
  'Information Technology', 'Professional Services', 'Facilities & Real Estate',
  'Marketing & Advertising', 'Logistics & Supply Chain', 'Human Resources',
];
const STATUSES: InitiativeStatus[] = ['Planning', 'Active', 'Completed', 'On Hold', 'Cancelled'];
const RAGS: RAGStatus[] = ['Green', 'Amber', 'Red'];

const EMPTY: Omit<Initiative, 'id' | 'milestones' | 'savingsProfile'> = {
  name: '', category: 'Information Technology', businessUnit: 'Global',
  owner: '', sponsor: '', targetSaving: 0, actualSaving: 0,
  status: 'Planning', ragStatus: 'Green', startDate: '', endDate: '', description: '',
};

export default function InitiativeTracker() {
  const [inits, setInits] = useState<Initiative[]>(defaultInitiatives);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<Initiative, 'id' | 'milestones' | 'savingsProfile'>>(EMPTY);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const totals = {
    target: inits.reduce((s, i) => s + i.targetSaving, 0),
    actual: inits.reduce((s, i) => s + i.actualSaving, 0),
    active: inits.filter(i => i.status === 'Active').length,
    completed: inits.filter(i => i.status === 'Completed').length,
  };

  const updateRAG = (id: string, rag: RAGStatus) =>
    setInits(prev => prev.map(i => i.id === id ? { ...i, ragStatus: rag } : i));

  const updateStatus = (id: string, status: InitiativeStatus) =>
    setInits(prev => prev.map(i => i.id === id ? { ...i, status } : i));

  const saveNew = () => {
    if (!form.name.trim()) return;
    setInits(prev => [...prev, {
      ...form,
      id: `init-${Date.now()}`,
      milestones: [],
      savingsProfile: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        .map(month => ({ month, target: 0, actual: 0 })),
    }]);
    setAdding(false);
    setForm(EMPTY);
  };

  const visible = filterStatus === 'All' ? inits : inits.filter(i => i.status === filterStatus);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Target', value: fmt$(totals.target), sub: 'Across all programmes' },
          { label: 'Savings Achieved', value: fmt$(totals.actual), sub: fmtPct((totals.actual / totals.target) * 100) + ' of target' },
          { label: 'Active Programmes', value: String(totals.active), sub: 'In execution' },
          { label: 'Completed', value: String(totals.completed), sub: 'Benefits realised' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">{c.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{c.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={13} /> Add Initiative
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['', 'Programme', 'Category', 'Owner', 'Status', 'RAG', 'Target $M', 'Achieved $M', 'Progress', 'End Date'].map(h => (
                <th key={h} className="text-left text-gray-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(init => {
              const pct = init.targetSaving > 0 ? Math.min(100, (init.actualSaving / init.targetSaving) * 100) : 0;
              const isOpen = expanded === init.id;
              const nextMilestone = init.milestones.find(m => m.status === 'Overdue') || init.milestones.find(m => m.status === 'Pending');

              return (
                <Fragment key={init.id}>
                  <tr className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isOpen ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => setExpanded(isOpen ? null : init.id)} className="text-gray-400 hover:text-gray-600">
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{init.name}</p>
                      <p className="text-gray-400 mt-0.5">{init.sponsor}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[130px] truncate">{init.category}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{init.owner}</td>
                    <td className="px-4 py-3">
                      <select
                        value={init.status}
                        onChange={e => updateStatus(init.id, e.target.value as InitiativeStatus)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_BADGE[init.status]}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {RAGS.map(r => (
                          <button key={r} title={r} onClick={() => updateRAG(init.id, r)}
                            className={`w-3 h-3 rounded-full transition-all ${RAG_COLORS[r]} ${
                              init.ragStatus === r ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'opacity-30 hover:opacity-60'
                            }`} />
                        ))}
                        <span className="ml-1 text-gray-500">{init.ragStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{fmt$(init.targetSaving)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{fmt$(init.actualSaving)}</td>
                    <td className="px-4 py-3 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-blue-500' : 'bg-amber-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-gray-500 w-8 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(init.endDate)}</td>
                  </tr>

                  {isOpen && (
                    <tr className="bg-slate-50 border-b border-gray-100">
                      <td colSpan={10} className="px-6 py-5">
                        <div className="grid grid-cols-3 gap-5">
                          <div className="col-span-1">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Description</p>
                            <p className="text-xs text-gray-500 mb-3">{init.description}</p>
                            <p className="text-xs font-semibold text-gray-700 mb-2">Milestones</p>
                            <div className="space-y-2">
                              {init.milestones.map(m => (
                                <div key={m.id} className="flex items-start gap-2">
                                  {MS_ICON[m.status]}
                                  <div>
                                    <p className={`text-xs leading-tight ${
                                      m.status === 'Complete' ? 'text-gray-400 line-through' :
                                      m.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-gray-700'
                                    }`}>{m.title}</p>
                                    <p className="text-xs text-gray-400">{fmtDate(m.dueDate)}</p>
                                  </div>
                                </div>
                              ))}
                              {init.milestones.length === 0 && (
                                <p className="text-xs text-gray-400 italic">No milestones added yet.</p>
                              )}
                            </div>
                            {nextMilestone && (
                              <div className={`mt-3 p-2 rounded-lg text-xs font-medium ${
                                nextMilestone.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {nextMilestone.status === 'Overdue' ? '⚠ Overdue: ' : '→ Next: '}
                                {nextMilestone.title}
                              </div>
                            )}
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Monthly Savings Profile ($M)</p>
                            <ResponsiveContainer width="100%" height={150}>
                              <AreaChart data={init.savingsProfile} margin={{ right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={v => `$${v}M`} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, '']} />
                                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }} />
                                <Area type="monotone" dataKey="target" name="Target" stroke="#94a3b8" fill="#f1f5f9" strokeWidth={1.5} strokeDasharray="4 2" />
                                <Area type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No initiatives match this filter.</div>
        )}
      </div>

      {/* Add modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">New Initiative</h2>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-medium text-gray-600">Programme Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Global IT Contract Renegotiation"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as InitiativeStatus }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Owner</label>
                  <input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Sponsor</label>
                  <input value={form.sponsor} onChange={e => setForm(f => ({ ...f, sponsor: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Target Saving ($M)</label>
                  <input type="number" min="0" step="0.1" value={form.targetSaving || ''} onChange={e => setForm(f => ({ ...f, targetSaving: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Actual Saving ($M)</label>
                  <input type="number" min="0" step="0.1" value={form.actualSaving || ''} onChange={e => setForm(f => ({ ...f, actualSaving: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveNew} disabled={!form.name.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">Save Initiative</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
