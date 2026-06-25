import { Eye, EyeOff, Printer, Pencil, Check, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
  clientName: string;
  onClientNameChange: (name: string) => void;
  presentationMode: boolean;
  onTogglePresentation: () => void;
  onPrint: () => void;
}

export default function Header({ clientName, onClientNameChange, presentationMode, onTogglePresentation, onPrint }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(clientName);

  function commit() {
    onClientNameChange(draft.trim() || 'Client');
    setEditing(false);
  }

  return (
    <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp size={16} className="text-white" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Baringa Procurement Consulting</div>
          <div className="text-white font-bold text-sm leading-tight">Procurement Org Design Tool</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-sm">Client:</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && commit()}
                className="bg-slate-700 text-white text-sm rounded px-2 py-0.5 outline-none w-36 border border-slate-500"
              />
              <button onClick={commit} className="text-emerald-400 hover:text-emerald-300">
                <Check size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setDraft(clientName); setEditing(true); }}
              className="flex items-center gap-1 text-white font-semibold text-sm hover:text-blue-300 transition-colors"
            >
              {clientName}
              <Pencil size={12} className="text-slate-400" />
            </button>
          )}
        </div>

        <div className="w-px h-5 bg-slate-700" />

        <button
          onClick={onTogglePresentation}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
            presentationMode
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          {presentationMode ? <EyeOff size={14} /> : <Eye size={14} />}
          {presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
        </button>

        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Printer size={14} />
          Print
        </button>
      </div>
    </header>
  );
}
