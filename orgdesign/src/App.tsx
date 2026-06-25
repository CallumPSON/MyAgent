import { useState } from 'react';
import type { OrgTab, OrgArchetype, OrgView, DimensionScore, OrgNode, RoleProfile } from './types';
import {
  DEFAULT_SCORES, ARCHETYPE_TEMPLATES, DEFAULT_ROLE_PROFILES,
} from './data/orgDesignData';
import Header from './components/Header';
import TabNav from './components/TabNav';
import Framework from './components/Framework';
import Assessment from './components/Assessment';
import OrgDesignChart from './components/OrgDesignChart';
import RoleArchitecture from './components/RoleArchitecture';

export default function App() {
  const [tab, setTab] = useState<OrgTab>('framework');
  const [presentationMode, setPresentationMode] = useState(false);
  const [archetype, setArchetype] = useState<OrgArchetype>('liquid-lattice');
  const [orgView, setOrgView] = useState<OrgView>('to-be');
  const [scores, setScores] = useState<DimensionScore[]>(DEFAULT_SCORES);
  const [clientName, setClientName] = useState('Client');

  const template = ARCHETYPE_TEMPLATES.find(t => t.archetype === archetype)!;
  const [asIsNodes, setAsIsNodes] = useState<OrgNode[]>(template.asIsNodes);
  const [toBeNodes, setToBeNodes] = useState<OrgNode[]>(template.toBeNodes);
  const [roleProfiles, setRoleProfiles] = useState<RoleProfile[]>(DEFAULT_ROLE_PROFILES);

  function handleArchetypeChange(a: OrgArchetype) {
    const t = ARCHETYPE_TEMPLATES.find(x => x.archetype === a)!;
    setArchetype(a);
    setAsIsNodes(t.asIsNodes);
    setToBeNodes(t.toBeNodes);
  }

  const activeNodes = orgView === 'as-is' ? asIsNodes : toBeNodes;
  const setActiveNodes = orgView === 'as-is' ? setAsIsNodes : setToBeNodes;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        clientName={clientName}
        onClientNameChange={setClientName}
        presentationMode={presentationMode}
        onTogglePresentation={() => setPresentationMode(p => !p)}
        onPrint={() => window.print()}
      />

      <div className="no-print">
        <TabNav activeTab={tab} onTabChange={setTab} />
      </div>

      <main className="flex-1 px-6 py-5">
        {tab === 'framework' && (
          <Framework
            scores={scores}
            onScoreChange={(id, field, val) =>
              setScores(s => s.map(x => x.dimensionId === id ? { ...x, [field]: val } : x))
            }
            presentationMode={presentationMode}
            clientName={clientName}
          />
        )}
        {tab === 'assessment' && (
          <Assessment
            scores={scores}
            onScoreChange={(id, field, val) =>
              setScores(s => s.map(x => x.dimensionId === id ? { ...x, [field]: val } : x))
            }
            presentationMode={presentationMode}
            clientName={clientName}
          />
        )}
        {tab === 'orgdesign' && (
          <OrgDesignChart
            archetype={archetype}
            onArchetypeChange={handleArchetypeChange}
            view={orgView}
            onViewChange={setOrgView}
            nodes={activeNodes}
            onNodesChange={setActiveNodes}
            presentationMode={presentationMode}
          />
        )}
        {tab === 'roles' && (
          <RoleArchitecture
            nodes={toBeNodes}
            roleProfiles={roleProfiles}
            onRoleProfileChange={(updated) =>
              setRoleProfiles(ps => ps.map(p => p.id === updated.id ? updated : p))
            }
            presentationMode={presentationMode}
          />
        )}
      </main>
    </div>
  );
}
