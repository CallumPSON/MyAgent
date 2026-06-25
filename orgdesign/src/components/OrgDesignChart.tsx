import type { OrgArchetype, OrgView, OrgNode } from '../types';
import FlatView from './FlatView';
import LiquidLatticeView from './LiquidLatticeView';
import HelixView from './HelixView';

const ARCHETYPES: { id: OrgArchetype; label: string; description: string }[] = [
  {
    id: 'liquid-lattice',
    label: 'Liquid Lattice',
    description: 'Fluid resource flows; no fixed category ownership; CoE at the centre',
  },
  {
    id: 'helix',
    label: 'Helix Model',
    description: 'Dual authority lines — functional excellence & value delivery',
  },
  {
    id: 'middle-managerless',
    label: 'Middle-Managerless',
    description: 'Flat structure; senior leaders connect directly to Value Architect teams',
  },
];

interface Props {
  archetype: OrgArchetype;
  onArchetypeChange: (a: OrgArchetype) => void;
  view: OrgView;
  onViewChange: (v: OrgView) => void;
  nodes: OrgNode[];
  onNodesChange: (nodes: OrgNode[]) => void;
  presentationMode: boolean;
}

export default function OrgDesignChart({
  archetype, onArchetypeChange, view, onViewChange,
  nodes, onNodesChange, presentationMode,
}: Props) {
  const totalFte = nodes.reduce((a, n) => a + n.fte, 0);
  const newRoles = nodes.filter(n => n.isNew).length;
  const removedRoles = nodes.filter(n => n.isRemoved).length;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Archetype selector */}
          <div>
            <div className="text-xs text-gray-500 font-medium mb-2">Org Model Archetype</div>
            <div className="flex gap-2">
              {ARCHETYPES.map(a => (
                <button
                  key={a.id}
                  onClick={() => !presentationMode && onArchetypeChange(a.id)}
                  title={a.description}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    archetype === a.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-1.5">
              {ARCHETYPES.find(a => a.id === archetype)?.description}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {(['as-is', 'to-be'] as OrgView[]).map(v => (
                <button
                  key={v}
                  onClick={() => onViewChange(v)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === v
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {v === 'as-is' ? 'As-Is' : 'To-Be'}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-3 text-xs">
              <span className="text-gray-500">Total: <strong>{totalFte} FTE</strong></span>
              {view === 'to-be' && newRoles > 0 && (
                <span className="text-emerald-600 font-medium">+{newRoles} new roles</span>
              )}
              {view === 'to-be' && removedRoles > 0 && (
                <span className="text-red-500 font-medium">−{removedRoles} removed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual */}
      {archetype === 'liquid-lattice' && (
        <LiquidLatticeView nodes={nodes} presentationMode={presentationMode} />
      )}
      {archetype === 'helix' && (
        <HelixView nodes={nodes} presentationMode={presentationMode} />
      )}
      {archetype === 'middle-managerless' && (
        <FlatView nodes={nodes} onNodesChange={onNodesChange} presentationMode={presentationMode} />
      )}
    </div>
  );
}
