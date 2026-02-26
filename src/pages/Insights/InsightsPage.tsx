import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function InsightsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-xl font-semibold text-foreground">Insights</h1>
        <BarChart3 className="w-5 h-5 text-muted-foreground" />
      </div>

      <Card className="p-4 animate-fade-in-up animation-delay-100">
        <p className="text-muted-foreground">Performance insights coming soon...</p>
        <p className="text-sm text-muted-foreground mt-2">Analytics and operational insights will appear here.</p>
      </Card>
    </div>
  );
}
