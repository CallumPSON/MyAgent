import { useState } from 'react';
import type { Page } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import SpendAnalysis from './components/pages/SpendAnalysis';
import OpportunityPipeline from './components/pages/OpportunityPipeline';
import InitiativeTracker from './components/pages/InitiativeTracker';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={page} />
        <main className="flex-1 overflow-y-auto p-6">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
          {page === 'spend' && <SpendAnalysis />}
          {page === 'opportunities' && <OpportunityPipeline />}
          {page === 'initiatives' && <InitiativeTracker />}
        </main>
      </div>
    </div>
  );
}
