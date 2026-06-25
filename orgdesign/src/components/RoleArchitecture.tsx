import { useState } from 'react';
import { X, Edit2, Check, ChevronRight } from 'lucide-react';
import type { OrgNode, RoleProfile, RoleType } from '../types';
import { DEFAULT_ROLE_PROFILES, SAMPLE_CAREER_PATH, ALL_SKILLS } from '../data/orgDesignData';

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

const ROLE_HEADER: Record<RoleType, string> = {
  Strategy:       'bg-blue-600',
  ValueArchitect: 'bg-emerald-600',
  BusinessPartner:'bg-purple-600',
  Operations:     'bg-slate-600',
  CoE:            'bg-amber-500',
};

interface Props {
  nodes: OrgNode[];
  roleProfiles: RoleProfile[];
  onRoleProfileChange: (profile: RoleProfile) => void;
  presentationMode: boolean;
}

export default function RoleArchitecture({ nodes, roleProfiles, onRoleProfileChange, presentationMode }: Props) {
  const [editingProfile, setEditingProfile] = useState<RoleProfile | null>(null);
  const [activeSection, setActiveSection] = useState<'cards' | 'matrix' | 'career'>('cards');

  // Build the display list: prefer matched profiles, fall back to defaults, then synthesize from nodes
  const toBeRoleTypes = Array.from(new Set(nodes.map(n => n.roleType)));
  const displayProfiles = toBeRoleTypes.map(rt => {
    const fromNode = nodes.find(n => n.roleType === rt);
    const matchedProfile = roleProfiles.find(p => p.roleType === rt)
      ?? DEFAULT_ROLE_PROFILES.find(p => p.roleType === rt)
      ?? {
        id: `synth-${rt}`,
        title: fromNode?.title ?? rt,
        roleType: rt,
        purpose: '',
        accountabilities: [],
        skills: [],
        fte: nodes.filter(n => n.roleType === rt).reduce((a, n) => a + n.fte, 0),
      };
    return matchedProfile;
  });

  function handleEdit(p: RoleProfile) { setEditingProfile({ ...p }); }
  function commitEdit() {
    if (editingProfile) {
      onRoleProfileChange(editingProfile);
      setEditingProfile(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Sub-nav */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100">
          {([
            { id: 'cards', label: 'Role Profiles' },
            { id: 'matrix', label: 'Skills Matrix' },
            { id: 'career', label: 'Career Pathway' },
          ] as const).map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeSection === s.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role cards */}
      {activeSection === 'cards' && (
        <div className="grid grid-cols-3 gap-4">
          {displayProfiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`${ROLE_HEADER[profile.roleType]} text-white px-4 py-3`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium text-white/70 mb-0.5">{ROLE_LABEL[profile.roleType]}</div>
                    <div className="font-bold text-sm leading-snug">{profile.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/70">FTE</div>
                    <div className="font-bold">{profile.fte}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {profile.purpose && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Purpose</div>
                    <p className="text-xs text-gray-700 leading-relaxed">{profile.purpose}</p>
                  </div>
                )}
                {profile.accountabilities.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Key Accountabilities</div>
                    <ul className="space-y-1">
                      {profile.accountabilities.slice(0, 4).map((a, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-gray-300 flex-shrink-0 mt-0.5">•</span>
                          <span className="leading-snug">{a}</span>
                        </li>
                      ))}
                      {profile.accountabilities.length > 4 && (
                        <li className="text-xs text-gray-400">+{profile.accountabilities.length - 4} more...</li>
                      )}
                    </ul>
                  </div>
                )}
                {profile.skills.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Core Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.map(s => (
                        <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[profile.roleType]}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {!presentationMode && (
                  <button
                    onClick={() => handleEdit(profile)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <Edit2 size={12} /> Edit profile
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills matrix */}
      {activeSection === 'matrix' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">Skills Coverage Matrix</h3>
          <p className="text-xs text-gray-400 mb-4">Which roles carry each transferable skill</p>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 min-w-44">Skill</th>
                {displayProfiles.map(p => (
                  <th key={p.id} className="text-center pb-3 px-2">
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${ROLE_BADGE[p.roleType]} whitespace-nowrap`}>
                      {p.title.split(' ')[0]}...
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_SKILLS.map((skill, i) => (
                <tr key={skill} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="text-xs text-gray-700 py-2 pr-4 font-medium">{skill}</td>
                  {displayProfiles.map(p => {
                    const has = p.skills.includes(skill);
                    return (
                      <td key={p.id} className="text-center py-2 px-2">
                        {has ? (
                          <Check size={14} className="text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-gray-200 text-sm mx-auto block">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Career pathway */}
      {activeSection === 'career' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">The Procurement University — Career Pathway</h3>
          <p className="text-xs text-gray-400 mb-6">
            Value Architects rotate across categories and functions, building a portfolio of commercial experience rather than deepening a single vertical.
            This creates the breadth and adaptability that drives real value.
          </p>

          {/* Horizontal pathway */}
          <div className="relative">
            <div className="flex items-center gap-0 overflow-x-auto pb-4">
              {SAMPLE_CAREER_PATH.map((step, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-4 mb-2 ${
                      i === 0 ? 'bg-blue-600 border-blue-200' :
                      i === SAMPLE_CAREER_PATH.length - 1 ? 'bg-emerald-600 border-emerald-200' :
                      'bg-white border-blue-400'
                    }`} />
                    <div className="bg-white border border-gray-200 rounded-xl p-3 w-36 text-center shadow-sm">
                      <div className="text-xs font-bold text-gray-800 leading-snug">{step.roleTitle}</div>
                      <div className="text-xs text-blue-600 mt-1 font-medium">{step.category}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{step.duration}</div>
                    </div>
                  </div>
                  {i < SAMPLE_CAREER_PATH.length - 1 && (
                    <div className="flex items-center -mt-12 mx-1">
                      <div className="h-px w-6 bg-gray-300" />
                      <ChevronRight size={12} className="text-gray-300 -mx-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Breadth over depth', desc: 'Skills in commercial strategy, contracting and business partnering are transferable across all categories.' },
              { label: 'Real-time insight', desc: 'Market intelligence is shared across all Value Architects simultaneously — no knowledge silos.' },
              { label: 'Rewarded for impact', desc: 'Performance is measured on business value created — not process compliance or category ownership.' },
            ].map(p => (
              <div key={p.label} className="bg-emerald-50 rounded-xl p-4">
                <div className="text-xs font-bold text-emerald-800 mb-1">{p.label}</div>
                <p className="text-xs text-emerald-700 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Edit Role Profile</h3>
              <button onClick={() => setEditingProfile(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Role Title</label>
                <input
                  value={editingProfile.title}
                  onChange={e => setEditingProfile({ ...editingProfile, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Purpose Statement</label>
                <textarea
                  value={editingProfile.purpose}
                  onChange={e => setEditingProfile({ ...editingProfile, purpose: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Key Accountabilities (one per line)</label>
                <textarea
                  value={editingProfile.accountabilities.join('\n')}
                  onChange={e => setEditingProfile({ ...editingProfile, accountabilities: e.target.value.split('\n').filter(Boolean) })}
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">FTE</label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={editingProfile.fte}
                  onChange={e => setEditingProfile({ ...editingProfile, fte: parseFloat(e.target.value) || 1 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditingProfile(null)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={commitEdit} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
