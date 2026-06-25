import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { Users, GraduationCap, Layers, Cpu, ArrowRight } from 'lucide-react';
import { VALUE_DIMENSIONS } from '../data/orgDesignData';
import type { DimensionScore } from '../types';

const ICONS: Record<string, React.ElementType> = { Users, GraduationCap, Layers, Cpu };

const ROLE_TYPE_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-emerald-100 text-emerald-700',
  5: 'bg-green-100 text-green-700',
};

interface Props {
  scores: DimensionScore[];
  onScoreChange: (id: string, field: 'asIs' | 'toBe', val: number) => void;
  presentationMode: boolean;
  clientName: string;
}

export default function Framework({ scores, onScoreChange, presentationMode, clientName }: Props) {
  const radarData = VALUE_DIMENSIONS.map(d => {
    const s = scores.find(x => x.dimensionId === d.id)!;
    return { dimension: d.name.split(' ')[0], asIs: s.asIs, toBe: s.toBe, fullName: d.name };
  });

  const avgAsIs = (scores.reduce((a, s) => a + s.asIs, 0) / scores.length).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">Baringa Procurement Consulting</div>
            <h1 className="text-2xl font-bold mb-2">The Value Architect Model</h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              A shift from traditional category-based procurement to a dynamic, value-delivery-centric function.
              Value Architects operate as a <strong className="text-white">fluid ecosystem of multiskilled experts</strong> —
              driving incremental value for customers, not just managing process.
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-6">
            <div className="text-slate-400 text-xs mb-1">Client maturity score</div>
            <div className="text-4xl font-bold text-white">{avgAsIs}<span className="text-xl text-slate-400">/5</span></div>
            <div className="text-slate-400 text-xs mt-1">{clientName} — current state</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Dimension cards */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {VALUE_DIMENSIONS.map(dim => {
            const score = scores.find(s => s.dimensionId === dim.id)!;
            const Icon = ICONS[dim.icon] ?? Users;
            return (
              <div key={dim.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-800 text-sm">{dim.name}</div>
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="flex-1 bg-red-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">{dim.traditionalLabel}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{dim.traditional}</p>
                  </div>
                  <div className="flex items-center flex-shrink-0 text-gray-300">
                    <ArrowRight size={16} />
                  </div>
                  <div className="flex-1 bg-emerald-50 rounded-lg p-3">
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">{dim.valueArchitectLabel}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{dim.valueArchitect}</p>
                  </div>
                </div>

                {!presentationMode && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">{clientName} today</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${ROLE_TYPE_COLORS[score.asIs]}`}>
                        {score.asIs}/5
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button
                          key={v}
                          onClick={() => onScoreChange(dim.id, 'asIs', v)}
                          className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                            score.asIs === v
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Radar chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{clientName} — Maturity Profile</h3>
          <p className="text-xs text-gray-400 mb-4">Current state across the 4 Value Architect dimensions</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9, fill: '#9ca3af' }} tickCount={6} />
              <Radar name="As-Is" dataKey="asIs" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip
                formatter={(v, _n, props) => [`${v}/5`, props.payload?.fullName ?? '']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {VALUE_DIMENSIONS.map(dim => {
              const s = scores.find(x => x.dimensionId === dim.id)!;
              return (
                <div key={dim.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-600">{dim.name.split(' ')[0]}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${ROLE_TYPE_COLORS[s.asIs]}`}>{s.asIs}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
