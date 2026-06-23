import { useState } from 'react';
import { Plus, X, ChevronRight, Pencil } from 'lucide-react';
import { defaultOpportunities } from '../../data/sampleData';
import { fmt$, fmtPct } from '../../utils/formatters';
import type { Opportunity, OpportunityStatus, Complexity } from '../../types';

const STAGES: OpportunityStatus[] = ['Identified', 'Qualifying', 'In Progress', 'Realized', 'Closed'];
const STAGE_COLORS: Record<OpportunityStatus, string> = {
  'Identified': 'border-slate-300',
  'Qualifying': 'border-blue-300',
  'In Progress': 'border-violet-300',
  'Realized': 'border-emerald-300',
  'Closed': 'border-gray-200',
};
const STAGE_HEADER: Record<OpportunityStatus, string> = {
  'Identified': 'bg-slate-100 text-slate-700',
  'Qualifying': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  'Realized': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-gray-100 text-gray-500',
};
const COMPLEXITY_BADGE: Record<Complexity, string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const EMPTY_OPP: Omit<Opportunity, 'id' | 'createdDate'> = {
  title: '', category: 'Information Technology', businessUnit: 'Global',
  currentSpend: 0, potentialSaving: 0, savingPercent: 0,
  complexity: 'Medium', timeToRealize: '6-9 months', status: 'Identified',
  owner: '', description: '',
};

const CATEGORIES = ['Information Technology', 'Professional Services', 'Facilities & Real Estate', 'Marketing & Advertising', 'Logistics & Supply Chain', 'Human Resources'];
const BUS = ['Global', 'North America', 'EMEA', 'APAC', 'LATAM', 'Operations', 'Finance & Legal', 'Marketing', 'IT', 'HR', 'Corporate'];

export default function OpportunityPipeline() {
  const [opps, setOpps] = useState<Opportunity[]>(defaultOpportunities);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Omit<Opportunity, 'id' | 'createdDate'>>(EMPTY_OPP);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<Opportunity, 'id' | 'createdDate'>>(EMPTY_OPP);

  const pipelineTotal = opps.filter(o => o.status !== 'Closed').reduce((s, o) => s + o.potentialSaving, 0);

  const openEdit = (opp: Opportunity) => {
    setEditForm({
      title: opp.title, category: opp.category, businessUnit: opp.businessUnit,
      currentSpend: opp.currentSpend, potentialSaving: opp.potentialSaving,
      savingPercent: opp.savingPercent, complexity: opp.complexity,
      timeToRealize: opp.timeToRealize, status: opp.status,
      owner: opp.owner, description: opp.description,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!editForm.title.trim() || !selected) return;
    const pct = editForm.currentSpend > 0 ? (editForm.potentialSaving / editForm.currentSpend) * 100 : 0;
    const updated = { ...selected, ...editForm, savingPercent: pct };
    setOpps(prev => prev.map(o => o.id === selected.id ? updated : o));
    setSelected(updated);
    setEditing(false);
  };

  const advance = (opp: Opportunity) => {
    const idx = STAGES.indexOf(opp.status);
    if (idx < STAGES.length - 1) {
      setOpps(prev => prev.map(o => o.id === opp.id ? { ...o, status: STAGES[idx + 1] } : o));
      setSelected(prev => prev?.id === opp.id ? { ...opp, status: STAGES[idx + 1] } : prev);
    }
  };

  const saveNew = () => {
    if (!form.title.trim()) return;
    const pct = form.currentSpend > 0 ? (form.potentialSaving / form.currentSpend) * 100 : 0;
    setOpps(prev => [...prev, {
      ...form,
      savingPercent: pct,
      id: `opp-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    }]);
    setAdding(false);
    setForm(EMPTY_OPP);
  };

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-6 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
        <div>
          <p className="text-xs text-gray-500">Total Pipeline</p>
          <p className="font-bold text-gray-900">{fmt$(pipelineTotal)}</p>
        </div>
        {STAGES.filter(s => s !== 'Closed').map(stage => {
          const stageOpps = opps.filter(o => o.status === stage);
          return (
            <div key={stage} className="flex items-center gap-4">
              <div className="w-px h-8 bg-gray-100" />
              <div>
                <p className="text-xs text-gray-500">{stage}</p>
                <p className="font-semibold text-gray-800">
                  {fmt$(stageOpps.reduce((s, o) => s + o.potentialSaving, 0))}
                  <span className="text-gray-400 font-normal text-xs ml-1">({stageOpps.length})</span>
                </p>
              </div>
            </div>
          );
        })}
        <div className="ml-auto">
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={13} /> Add Opportunity
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STAGES.map(stage => {
          const cards = opps.filter(o => o.status === stage);
          return (
            <div key={stage} className={`flex-shrink-0 w-56 border-t-2 ${STAGE_COLORS[stage]}`}>
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-md ${STAGE_HEADER[stage]}`}>
                <span className="text-xs font-semibold">{stage}</span>
                <span className="text-xs opacity-70">{cards.length}</span>
              </div>
              <div className="space-y-2 mt-2">
                {cards.map(opp => (
                  <div key={opp.id} onClick={() => setSelected(opp)}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 cursor-pointer hover:border-blue-200 hover:shadow transition-all">
                    <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{opp.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{opp.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-600">{fmt$(opp.potentialSaving)}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${COMPLEXITY_BADGE[opp.complexity]}`}>
                        {opp.complexity}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                      <span>{fmtPct(opp.savingPercent)} saving</span>
                      <span>{opp.owner.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-300 border-2 border-dashed border-gray-100 rounded-lg mx-0.5">
                    No items
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_HEADER[selected.status]}`}>{selected.status}</span>
                <h2 className="text-base font-bold text-gray-900 mt-1">{editing ? 'Edit Opportunity' : selected.title}</h2>
              </div>
              <div className="flex items-center gap-1">
                {!editing && (
                  <button onClick={() => openEdit(selected)}
                    className="text-gray-400 hover:text-blue-600 p-1 rounded" title="Edit">
                    <Pencil size={15} />
                  </button>
                )}
                <button onClick={() => { setSelected(null); setEditing(false); }} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
              </div>
            </div>

            {editing ? (
              <>
                <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Title *</label>
                    <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Category</label>
                      <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Business Unit</label>
                      <select value={editForm.businessUnit} onChange={e => setEditForm(f => ({ ...f, businessUnit: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {BUS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Current Spend ($M)</label>
                      <input type="number" value={editForm.currentSpend || ''} onChange={e => setEditForm(f => ({ ...f, currentSpend: parseFloat(e.target.value) || 0 }))}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Potential Saving ($M)</label>
                      <input type="number" value={editForm.potentialSaving || ''} onChange={e => setEditForm(f => ({ ...f, potentialSaving: parseFloat(e.target.value) || 0 }))}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Complexity</label>
                      <select value={editForm.complexity} onChange={e => setEditForm(f => ({ ...f, complexity: e.target.value as Complexity }))}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Time to Realise</label>
                      <select value={editForm.timeToRealize} onChange={e => setEditForm(f => ({ ...f, timeToRealize: e.target.value }))}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {['1-3 months', '3-6 months', '6-9 months', '9-12 months', '12-18 months', '18+ months'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Owner</label>
                    <input value={editForm.owner} onChange={e => setEditForm(f => ({ ...f, owner: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Description</label>
                    <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-5 pb-5">
                  <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={saveEdit} disabled={!editForm.title.trim()}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">Save Changes</button>
                </div>
              </>
            ) : (
              <>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-600">{selected.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Category', selected.category],
                      ['Business Unit', selected.businessUnit],
                      ['Owner', selected.owner],
                      ['Complexity', selected.complexity],
                      ['Current Spend', fmt$(selected.currentSpend)],
                      ['Time to Realise', selected.timeToRealize],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{k}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-4">
                    <div>
                      <p className="text-xs text-emerald-600">Potential Saving</p>
                      <p className="text-2xl font-bold text-emerald-700">{fmt$(selected.potentialSaving)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600">Saving %</p>
                      <p className="text-2xl font-bold text-emerald-700">{fmtPct(selected.savingPercent)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 pb-5">
                  <button onClick={() => {
                    setOpps(prev => prev.filter(o => o.id !== selected.id));
                    setSelected(null);
                  }} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                  {selected.status !== 'Realized' && selected.status !== 'Closed' && (
                    <button onClick={() => advance(selected)}
                      className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
                      Advance Stage <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">New Opportunity</h2>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-medium text-gray-600">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
                  <label className="text-xs font-medium text-gray-600">Business Unit</label>
                  <select value={form.businessUnit} onChange={e => setForm(f => ({ ...f, businessUnit: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {BUS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Current Spend ($M)</label>
                  <input type="number" value={form.currentSpend || ''} onChange={e => setForm(f => ({ ...f, currentSpend: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Potential Saving ($M)</label>
                  <input type="number" value={form.potentialSaving || ''} onChange={e => setForm(f => ({ ...f, potentialSaving: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Complexity</label>
                  <select value={form.complexity} onChange={e => setForm(f => ({ ...f, complexity: e.target.value as Complexity }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Time to Realise</label>
                  <select value={form.timeToRealize} onChange={e => setForm(f => ({ ...f, timeToRealize: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['1-3 months', '3-6 months', '6-9 months', '9-12 months', '12-18 months', '18+ months'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Owner</label>
                <input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveNew} disabled={!form.title.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">Save Opportunity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
