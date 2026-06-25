import type { OrgNode, RoleType } from '../types';

const STREAM_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  coe:      { fill: '#fef3c7', stroke: '#d97706', label: 'CoE & Strategy' },
  vs1:      { fill: '#d1fae5', stroke: '#059669', label: 'Value Stream 1 — Technology' },
  vs2:      { fill: '#dbeafe', stroke: '#2563eb', label: 'Value Stream 2 — Indirect' },
  vs3:      { fill: '#ede9fe', stroke: '#7c3aed', label: 'Value Stream 3 — Direct' },
  bp:       { fill: '#fce7f3', stroke: '#be185d', label: 'Business Partners' },
  ops:      { fill: '#f1f5f9', stroke: '#64748b', label: 'P2P & Operations' },
};

const ROLE_BADGE: Record<RoleType, string> = {
  Strategy:       'bg-blue-100 text-blue-700',
  ValueArchitect: 'bg-emerald-100 text-emerald-700',
  BusinessPartner:'bg-pink-100 text-pink-700',
  Operations:     'bg-slate-100 text-slate-600',
  CoE:            'bg-amber-100 text-amber-700',
};

const ROLE_LABEL: Record<RoleType, string> = {
  Strategy:       'Strategy',
  ValueArchitect: 'Value Architect',
  BusinessPartner:'Business Partner',
  Operations:     'Operations',
  CoE:            'CoE',
};

interface Props {
  nodes: OrgNode[];
  presentationMode: boolean;
}

export default function LiquidLatticeView({ nodes, presentationMode }: Props) {
  const cpo = nodes.find(n => n.parentId === null);
  const streamed = nodes.filter(n => n.streamId);
  const streams = Array.from(new Set(streamed.map(n => n.streamId!)));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 min-h-96">
      {/* Explainer */}
      <div className="mb-6 bg-blue-50 rounded-lg p-4 text-xs text-blue-800 leading-relaxed">
        <strong>Liquid Lattice Model:</strong> Resources are not fixed to categories — they flow fluidly between value streams based on where they can create the most impact.
        The CoE provides shared intelligence and capability to all streams simultaneously.
        {!presentationMode && ' Click nodes to edit.'}
      </div>

      {/* CPO node at top */}
      {cpo && (
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 text-white rounded-xl px-6 py-3 text-center min-w-52 shadow-md">
            <div className="text-xs text-slate-400 mb-0.5">Function Lead</div>
            <div className="text-sm font-bold">{cpo.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{cpo.fte} FTE</div>
          </div>
        </div>
      )}

      {/* Stream grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(streams.length, 3)}, 1fr)` }}>
        {streams.map(streamId => {
          const color = STREAM_COLORS[streamId] ?? { fill: '#f9fafb', stroke: '#9ca3af', label: streamId };
          const streamNodes = streamed.filter(n => n.streamId === streamId);
          const totalFte = streamNodes.reduce((a, n) => a + n.fte, 0);
          return (
            <div
              key={streamId}
              className="rounded-xl p-4"
              style={{ background: color.fill, border: `2px solid ${color.stroke}` }}
            >
              <div className="text-xs font-bold mb-3 flex items-center justify-between" style={{ color: color.stroke }}>
                <span>{color.label}</span>
                <span className="font-normal text-gray-500">{totalFte} FTE</span>
              </div>
              <div className="space-y-2">
                {streamNodes.map(node => (
                  <div
                    key={node.id}
                    className={`bg-white rounded-lg px-3 py-2.5 shadow-sm border ${node.isNew ? 'border-emerald-400' : 'border-white'}`}
                  >
                    {node.isNew && (
                      <div className="text-xs text-emerald-600 font-semibold mb-0.5">NEW</div>
                    )}
                    <div className="text-xs font-bold text-gray-800 leading-snug">{node.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_BADGE[node.roleType]}`}>
                        {ROLE_LABEL[node.roleType]}
                      </span>
                      <span className="text-xs text-gray-400">{node.fte} FTE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow arrows legend */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {streams.map(s => {
          const c = STREAM_COLORS[s] ?? { fill: '#f9fafb', stroke: '#9ca3af', label: s };
          return (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2" style={{ background: c.fill, borderColor: c.stroke }} />
              <span className="text-xs text-gray-500">{c.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        Value Architects flow between streams based on need — no fixed category ownership
      </div>
    </div>
  );
}
