import type { OrgNode, RoleType } from '../types';

const ROLE_BADGE: Record<RoleType, string> = {
  Strategy:       'bg-blue-100 text-blue-700',
  ValueArchitect: 'bg-emerald-100 text-emerald-700',
  BusinessPartner:'bg-purple-100 text-purple-700',
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

function NodeCard({ node }: { node: OrgNode }) {
  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm border-l-4 ${node.isNew ? 'border-emerald-400' : 'border-gray-200'} min-w-44`}>
      {node.isNew && <div className="text-xs text-emerald-600 font-semibold mb-0.5">NEW</div>}
      <div className="text-xs font-bold text-gray-800 leading-snug">{node.title}</div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_BADGE[node.roleType]}`}>
          {ROLE_LABEL[node.roleType]}
        </span>
        <span className="text-xs text-gray-400">{node.fte} FTE</span>
      </div>
    </div>
  );
}

export default function HelixView({ nodes, presentationMode: _pm }: Props) {
  const cpo = nodes.find(n => n.parentId === null);
  const functionalStream = nodes.filter(n => n.streamId === 'functional');
  const deliveryStream = nodes.filter(n => n.streamId === 'delivery');
  const opsNodes = nodes.filter(n => n.streamId === 'ops' || (!n.streamId && n.parentId !== null && n.roleType === 'Operations'));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 min-h-96">
      <div className="mb-6 bg-purple-50 rounded-lg p-4 text-xs text-purple-800 leading-relaxed">
        <strong>Helix Model:</strong> Two intertwining lines of authority — a <strong>Functional Excellence</strong> arm (builds skills, capability, and insight)
        and a <strong>Value Delivery</strong> arm (drives commercial outcomes). Value Architects report to both,
        drawing on functional excellence to deliver superior commercial results.
      </div>

      {/* CPO */}
      {cpo && (
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 text-white rounded-xl px-6 py-3 text-center shadow-md">
            <div className="text-xs text-slate-400 mb-0.5">Function Lead</div>
            <div className="text-sm font-bold">{cpo.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{cpo.fte} FTE</div>
          </div>
        </div>
      )}

      {/* Two arms */}
      <div className="grid grid-cols-2 gap-8 relative">
        {/* Helix connecting line (decorative) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-full bg-gradient-to-b from-amber-300 via-purple-300 to-emerald-300 opacity-40" />
        </div>

        {/* Functional Excellence */}
        <div>
          <div className="bg-amber-500 text-white text-center rounded-xl px-4 py-2.5 text-sm font-bold mb-4 shadow">
            Functional Excellence
          </div>
          <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 mb-4 leading-relaxed">
            Builds the skills, insight, and tools that make Value Architects world-class.
            Sets standards. Runs the "procurement university". Owns market intelligence.
          </div>
          <div className="space-y-3">
            {functionalStream.map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>

        {/* Value Delivery */}
        <div>
          <div className="bg-emerald-600 text-white text-center rounded-xl px-4 py-2.5 text-sm font-bold mb-4 shadow">
            Value Delivery
          </div>
          <div className="text-xs text-emerald-700 bg-emerald-50 rounded-lg p-3 mb-4 leading-relaxed">
            Drives commercial outcomes: savings, revenue impact, supplier innovation.
            Value Architects are deployed here. Business Partners connect to the enterprise.
          </div>
          <div className="space-y-3">
            {deliveryStream.map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      </div>

      {/* Operations bar */}
      {opsNodes.length > 0 && (
        <div className="mt-8">
          <div className="bg-slate-200 text-slate-700 text-center rounded-xl px-4 py-2 text-xs font-bold mb-3">
            P2P & Transactional Operations (shared service)
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {opsNodes.map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      )}

      {/* Connecting arrows legend */}
      <div className="mt-6 text-center text-xs text-gray-400">
        Each Value Architect draws from both arms — functional excellence informs delivery; delivery validates excellence
      </div>
    </div>
  );
}
