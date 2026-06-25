import { Plus, Edit2, X } from 'lucide-react';
import { useState } from 'react';
import type { OrgNode, RoleType } from '../types';

const ROLE_COLORS: Record<RoleType, string> = {
  Strategy:       'border-blue-400 bg-blue-50',
  ValueArchitect: 'border-emerald-400 bg-emerald-50',
  BusinessPartner:'border-purple-400 bg-purple-50',
  Operations:     'border-slate-300 bg-slate-50',
  CoE:            'border-amber-400 bg-amber-50',
};

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

interface NodeCardProps {
  node: OrgNode;
  onEdit: (n: OrgNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  presentationMode: boolean;
}

function NodeCard({ node, onEdit, onDelete, onAddChild, presentationMode }: NodeCardProps) {
  return (
    <div className={`relative border-2 rounded-xl px-4 py-3 min-w-40 max-w-56 text-center shadow-sm transition-all
      ${ROLE_COLORS[node.roleType]}
      ${node.isNew ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}
      ${node.isRemoved ? 'opacity-50' : ''}
    `}>
      {node.isNew && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">NEW</div>
      )}
      <div className={`text-xs font-semibold px-2 py-0.5 rounded mb-1.5 inline-block ${ROLE_BADGE[node.roleType]}`}>
        {ROLE_LABEL[node.roleType]}
      </div>
      <div className={`text-xs font-bold text-gray-800 leading-snug mb-1 ${node.isRemoved ? 'line-through' : ''}`}>
        {node.title}
      </div>
      <div className="text-xs text-gray-500">{node.fte} FTE</div>
      {!presentationMode && (
        <div className="flex justify-center gap-1 mt-2">
          <button onClick={() => onAddChild(node.id)} title="Add report" className="p-1 rounded hover:bg-white/60 text-gray-400 hover:text-emerald-600 transition-colors">
            <Plus size={12} />
          </button>
          <button onClick={() => onEdit(node)} title="Edit" className="p-1 rounded hover:bg-white/60 text-gray-400 hover:text-blue-600 transition-colors">
            <Edit2 size={12} />
          </button>
          {node.parentId && (
            <button onClick={() => onDelete(node.id)} title="Remove" className="p-1 rounded hover:bg-white/60 text-gray-400 hover:text-red-500 transition-colors">
              <X size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function buildTree(nodes: OrgNode[], parentId: string | null): OrgNode[] {
  return nodes.filter(n => n.parentId === parentId);
}

interface TreeNodeProps {
  node: OrgNode;
  allNodes: OrgNode[];
  onEdit: (n: OrgNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  presentationMode: boolean;
  depth: number;
}

function TreeNode({ node, allNodes, onEdit, onDelete, onAddChild, presentationMode, depth }: TreeNodeProps) {
  const children = buildTree(allNodes, node.id);
  return (
    <div className="flex flex-col items-center">
      <NodeCard node={node} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} presentationMode={presentationMode} />
      {children.length > 0 && (
        <>
          <div className="w-px h-5 bg-gray-300" />
          <div className="flex gap-4 items-start relative">
            {children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-300"
                style={{ left: `calc(50% / ${children.length})`, right: `calc(50% / ${children.length})` }}
              />
            )}
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                {children.length > 1 && <div className="w-px h-5 bg-gray-300" />}
                <TreeNode
                  node={child}
                  allNodes={allNodes}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                  presentationMode={presentationMode}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const BLANK_NODE: Omit<OrgNode, 'id' | 'parentId'> = {
  title: '',
  roleType: 'ValueArchitect',
  fte: 1,
};

interface Props {
  nodes: OrgNode[];
  onNodesChange: (nodes: OrgNode[]) => void;
  presentationMode: boolean;
}

export default function FlatView({ nodes, onNodesChange, presentationMode }: Props) {
  const [editingNode, setEditingNode] = useState<OrgNode | null>(null);
  const [addingParentId, setAddingParentId] = useState<string | null>(null);
  const [newNode, setNewNode] = useState<Omit<OrgNode, 'id' | 'parentId'>>(BLANK_NODE);

  const roots = nodes.filter(n => n.parentId === null);

  function handleEdit(n: OrgNode) { setEditingNode(n); }
  function handleDelete(id: string) {
    onNodesChange(nodes.filter(n => n.id !== id && n.parentId !== id));
  }
  function handleAddChild(parentId: string) {
    setAddingParentId(parentId);
    setNewNode(BLANK_NODE);
  }
  function commitEdit() {
    if (!editingNode) return;
    onNodesChange(nodes.map(n => n.id === editingNode.id ? editingNode : n));
    setEditingNode(null);
  }
  function commitAdd() {
    if (!addingParentId || !newNode.title.trim()) return;
    const node: OrgNode = { ...newNode, id: `node-${Date.now()}`, parentId: addingParentId };
    onNodesChange([...nodes, node]);
    setAddingParentId(null);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 overflow-x-auto min-h-96">
      <div className="flex flex-col items-center gap-0 min-w-max mx-auto">
        {roots.map(root => (
          <TreeNode
            key={root.id}
            node={root}
            allNodes={nodes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
            presentationMode={presentationMode}
            depth={0}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-8 justify-center flex-wrap">
        {(Object.keys(ROLE_LABEL) as RoleType[]).map(rt => (
          <div key={rt} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded border-2 ${ROLE_COLORS[rt]}`} />
            <span className="text-xs text-gray-500">{ROLE_LABEL[rt]}</span>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingNode && (
        <Modal title="Edit Role" onClose={() => setEditingNode(null)} onConfirm={commitEdit}>
          <NodeForm node={editingNode} onChange={setEditingNode} />
        </Modal>
      )}
      {addingParentId && (
        <Modal title="Add Direct Report" onClose={() => setAddingParentId(null)} onConfirm={commitAdd}>
          <NodeForm node={{ ...newNode, id: '', parentId: addingParentId }} onChange={n => setNewNode(n)} />
        </Modal>
      )}
    </div>
  );
}

function NodeForm({ node, onChange }: { node: OrgNode; onChange: (n: OrgNode) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Role Title</label>
        <input
          value={node.title}
          onChange={e => onChange({ ...node, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          placeholder="e.g. Value Architect — Technology"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Role Type</label>
          <select
            value={node.roleType}
            onChange={e => onChange({ ...node, roleType: e.target.value as RoleType })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          >
            {(Object.keys(ROLE_LABEL) as RoleType[]).map(rt => (
              <option key={rt} value={rt}>{ROLE_LABEL[rt]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">FTE</label>
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={node.fte}
            onChange={e => onChange({ ...node, fte: parseFloat(e.target.value) || 1 })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={!!node.isNew}
            onChange={e => onChange({ ...node, isNew: e.target.checked })}
            className="rounded"
          />
          Mark as New (to-be addition)
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={!!node.isRemoved}
            onChange={e => onChange({ ...node, isRemoved: e.target.checked })}
            className="rounded"
          />
          Mark as Removed
        </label>
      </div>
    </div>
  );
}

function Modal({ title, onClose, onConfirm, children }: {
  title: string; onClose: () => void; onConfirm: () => void; children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        {children}
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}
