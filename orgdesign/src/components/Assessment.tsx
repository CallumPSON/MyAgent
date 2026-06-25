import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Users, GraduationCap, Layers, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { VALUE_DIMENSIONS } from '../data/orgDesignData';
import type { DimensionScore } from '../types';

const ICONS: Record<string, React.ElementType> = { Users, GraduationCap, Layers, Cpu };

const GAP_PRIORITY: Record<number, { label: string; color: string }> = {
  0: { label: 'At Target', color: 'bg-emerald-100 text-emerald-700' },
  1: { label: 'Low', color: 'bg-blue-100 text-blue-700' },
  2: { label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  3: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  4: { label: 'Critical', color: 'bg-red-100 text-red-700' },
};

function priorityFor(gap: number) {
  const g = Math.min(4, Math.max(0, gap));
  return GAP_PRIORITY[g];
}

interface Props {
  scores: DimensionScore[];
  onScoreChange: (id: string, field: 'asIs' | 'toBe' | 'narrative', val: number | string) => void;
  presentationMode: boolean;
  clientName: string;
}

export default function Assessment({ scores, onScoreChange, presentationMode, clientName }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const radarData = VALUE_DIMENSIONS.map(d => {
    const s = scores.find(x => x.dimensionId === d.id)!;
    return { subject: d.name.split(' ')[0], asIs: s.asIs, toBe: s.toBe };
  });

  const avgAsIs = (scores.reduce((a, s) => a + s.asIs, 0) / scores.length).toFixed(1);
  const avgToBe = (scores.reduce((a, s) => a + s.toBe, 0) / scores.length).toFixed(1);
  const totalGap = scores.reduce((a, s) => a + (s.toBe - s.asIs), 0);

  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: `${clientName} — Current Maturity`, value: `${avgAsIs}/5`, sub: 'Average across 4 dimensions', color: 'bg-blue-600' },
          { label: 'Target Maturity', value: `${avgToBe}/5`, sub: 'Where we want to get to', color: 'bg-emerald-600' },
          { label: 'Total Transformation Gap', value: `${totalGap} pts`, sub: 'Sum of gaps across all dimensions', color: 'bg-amber-500' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-2 h-12 rounded-full ${k.color}`} />
            <div>
              <div className="text-xs text-gray-500 font-medium">{k.label}</div>
              <div className="text-2xl font-bold text-gray-900 mt-0.5">{k.value}</div>
              <div className="text-xs text-gray-400">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Score inputs */}
        <div className="col-span-3 space-y-3">
          {VALUE_DIMENSIONS.map(dim => {
            const score = scores.find(s => s.dimensionId === dim.id)!;
            const gap = score.toBe - score.asIs;
            const Icon = ICONS[dim.icon] ?? Users;
            const isExpanded = expanded === dim.id;

            return (
              <div key={dim.id} className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} className="text-blue-600" />
                    <span className="font-semibold text-gray-800 text-sm">{dim.name}</span>
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${priorityFor(gap).color}`}>
                      {gap > 0 ? `Gap: ${gap}` : 'At Target'}
                    </span>
                    {gap > 1 && (
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityFor(gap).color}`}>
                        {priorityFor(gap).label} Priority
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* As-Is */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-medium">As-Is (Current)</span>
                        <span className="text-xs font-bold text-blue-600">{score.asIs}/5</span>
                      </div>
                      {!presentationMode ? (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(v => (
                            <button
                              key={v}
                              onClick={() => onScoreChange(dim.id, 'asIs', v)}
                              className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                                score.asIs === v
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(v => (
                            <div key={v} className={`flex-1 py-1.5 rounded text-center text-xs font-semibold ${score.asIs === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-300'}`}>{v}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* To-Be */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-medium">To-Be (Target)</span>
                        <span className="text-xs font-bold text-emerald-600">{score.toBe}/5</span>
                      </div>
                      {!presentationMode ? (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(v => (
                            <button
                              key={v}
                              onClick={() => onScoreChange(dim.id, 'toBe', v)}
                              className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors ${
                                score.toBe === v
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(v => (
                            <div key={v} className={`flex-1 py-1.5 rounded text-center text-xs font-semibold ${score.toBe === v ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-300'}`}>{v}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Narrative toggle */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : dim.id)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>{score.narrative ? 'Narrative added' : 'Add narrative for ' + clientName}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <textarea
                        value={score.narrative}
                        onChange={e => onScoreChange(dim.id, 'narrative', e.target.value)}
                        placeholder={`What does this score mean for ${clientName}? What are the key barriers and opportunities?`}
                        rows={3}
                        disabled={presentationMode}
                        className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none outline-none focus:border-blue-400 placeholder-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar chart */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Transformation Gap</h3>
            <p className="text-xs text-gray-400 mb-4">As-is vs to-be across all 4 dimensions</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9, fill: '#9ca3af' }} tickCount={6} />
                <Radar name="As-Is" dataKey="asIs" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="To-Be" dataKey="toBe" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 3" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Priority Summary</h3>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Dimension</th>
                  <th className="text-center pb-2 font-medium">As-Is</th>
                  <th className="text-center pb-2 font-medium">To-Be</th>
                  <th className="text-right pb-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {VALUE_DIMENSIONS.map(dim => {
                  const s = scores.find(x => x.dimensionId === dim.id)!;
                  const gap = s.toBe - s.asIs;
                  const p = priorityFor(gap);
                  return (
                    <tr key={dim.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 text-xs text-gray-700">{dim.name}</td>
                      <td className="py-2 text-center text-xs font-bold text-blue-600">{s.asIs}</td>
                      <td className="py-2 text-center text-xs font-bold text-emerald-600">{s.toBe}</td>
                      <td className="py-2 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${p.color}`}>{p.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
