import { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Upload, Download, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { monthlySpend, spendByCategory, topSuppliers } from '../../data/sampleData';
import type { Supplier } from '../../types';

const RISK_BADGE: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const BU_DATA = [
  { name: 'North America', value: 320.1, color: '#2563eb' },
  { name: 'EMEA', value: 254.4, color: '#7c3aed' },
  { name: 'APAC', value: 178.3, color: '#0891b2' },
  { name: 'LATAM', value: 95.4, color: '#d97706' },
];

const COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#d97706', '#16a34a', '#dc2626'];

export default function SpendAnalysis() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(topSuppliers);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const maxSpend = Math.max(...suppliers.map(s => s.annualSpend));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed = (data as Record<string, string>[]).map((row, i) => ({
          name: row['Supplier'] || row['supplier'] || row['name'] || `Supplier ${i + 1}`,
          category: row['Category'] || row['category'] || 'Uncategorised',
          annualSpend: parseFloat(row['Spend'] || row['spend'] || row['amount'] || '0'),
          invoiceCount: parseInt(row['Invoices'] || row['invoices'] || '0'),
          country: row['Country'] || row['country'] || '—',
          riskLevel: (row['Risk'] || row['risk'] || 'Low') as Supplier['riskLevel'],
          contractExpiry: row['ContractExpiry'] || row['contract_expiry'] || '—',
        })).filter(s => s.annualSpend > 0);
        if (parsed.length) {
          setSuppliers(parsed);
          setUploadMsg(`Loaded ${parsed.length} suppliers from ${file.name}`);
        } else {
          setUploadMsg('Could not parse suppliers — check column names.');
        }
      },
    });
  };

  const exportCSV = () => {
    const header = 'Supplier,Category,Annual Spend ($M),Invoices,Country,Risk,Contract Expiry';
    const rows = suppliers.map(s =>
      `${s.name},${s.category},${s.annualSpend},${s.invoiceCount},${s.country},${s.riskLevel},${s.contractExpiry}`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'supplier_spend.csv'; a.click();
  };

  return (
    <div className="space-y-5">
      {/* Monthly stacked spend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Monthly Spend by Category ($M)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlySpend} margin={{ right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `$${v}M`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, '']} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="IT" name="IT" stackId="a" fill={COLORS[0]} />
            <Bar dataKey="ProfServices" name="Prof. Services" stackId="a" fill={COLORS[1]} />
            <Bar dataKey="Facilities" name="Facilities" stackId="a" fill={COLORS[2]} />
            <Bar dataKey="Marketing" name="Marketing" stackId="a" fill={COLORS[3]} />
            <Bar dataKey="Logistics" name="Logistics" stackId="a" fill={COLORS[4]} />
            <Bar dataKey="HR" name="HR" stackId="a" fill={COLORS[5]} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown + BU split */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Spend by Category ($M)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={spendByCategory} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `$${v}M`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} width={140} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, 'Spend']} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {spendByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Spend by Business Unit</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={BU_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                {BU_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}M`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {BU_DATA.map(b => (
              <div key={b.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                  <span className="text-gray-600">{b.name}</span>
                </div>
                <span className="font-medium text-gray-900">${b.value.toFixed(1)}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Supplier Intelligence</h3>
            <p className="text-gray-400 text-xs mt-0.5">{suppliers.length} suppliers · sorted by spend</p>
          </div>
          <div className="flex items-center gap-2">
            {uploadMsg && (
              <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <AlertCircle size={12} /> {uploadMsg}
              </div>
            )}
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
              <Upload size={13} /> Import CSV
            </button>
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {['Supplier', 'Category', 'Country', 'Annual Spend', 'Share', 'Invoices', 'Risk', 'Contract Expiry'].map(h => (
                  <th key={h} className="text-left text-gray-500 font-medium pb-2 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...suppliers].sort((a, b) => b.annualSpend - a.annualSpend).map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 font-medium text-gray-800">{s.name}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{s.category}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{s.country}</td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.annualSpend / maxSpend) * 100}%` }} />
                      </div>
                      <span className="font-medium text-gray-800">${s.annualSpend.toFixed(1)}M</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500">
                    {((s.annualSpend / 848.2) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500">{s.invoiceCount.toLocaleString()}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-1.5 py-0.5 rounded-full font-medium ${RISK_BADGE[s.riskLevel]}`}>{s.riskLevel}</span>
                  </td>
                  <td className="py-2.5 text-gray-500">{s.contractExpiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700 flex items-start gap-2">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span><strong>Import tip:</strong> Upload a CSV with columns: Supplier, Category, Spend, Invoices, Country, Risk, ContractExpiry</span>
        </div>
      </div>
    </div>
  );
}
