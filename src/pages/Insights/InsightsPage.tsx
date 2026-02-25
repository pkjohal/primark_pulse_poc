import { BarChart3 } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Insights</h2>
        <BarChart3 className="w-5 h-5 text-slate-400" />
      </div>

      <div className="card">
        <p className="text-slate-600">Performance insights coming soon...</p>
        <p className="text-sm text-slate-400 mt-2">Analytics and operational insights will appear here.</p>
      </div>
    </div>
  );
}
