import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin, Calendar, DollarSign } from 'lucide-react';

type Ticket = {
  id: string;
  status: 'active' | 'paid' | 'dismissed' | 'voided';
  citation_number: string;
  citation_issued_datetime: string;
  citation_location?: string | null;
  analysis_neighborhood?: string | null;
  violation_desc?: string | null;
  fine_amount?: number | null;
  vehicle_plate: string;
  due_date?: string | null;
};

export default function RecentTickets({ tickets }: { tickets: Ticket[] }) {
  const statusColor = (s: Ticket['status']) =>
    s === 'active'
      ? 'bg-red-100 text-red-800 border-red-200'
      : s === 'paid'
      ? 'bg-green-100 text-green-800 border-green-200'
      : s === 'dismissed'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';

  const urgency = (t: Ticket) => {
    if (t.status !== 'active' || !t.due_date) return null;
    const dd = new Date(t.due_date);
    const diff = Math.ceil((dd.getTime() - Date.now()) / 86400000);
    if (diff < 0) return { label: 'Overdue', cls: 'bg-red-600 text-white' };
    if (diff <= 2) return { label: 'Due Soon', cls: 'bg-orange-600 text-white' };
    if (diff <= 5) return { label: 'Due This Week', cls: 'bg-yellow-600 text-white' };
    return null;
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-emerald-700" />
            </div>
            <p className="text-slate-600">No tickets found</p>
            <p className="text-sm text-slate-500 mt-1">We check daily against the city feed</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((t) => {
              const u = urgency(t);
              return (
                <div key={t.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="font-mono font-bold text-lg text-slate-900">{t.vehicle_plate}</div>
                        <Badge className={statusColor(t.status)}>{t.status}</Badge>
                        {u && <Badge className={u.cls}>{u.label}</Badge>}
                      </div>

                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {t.citation_location || 'Location not specified'}
                            {t.analysis_neighborhood && ` • ${t.analysis_neighborhood}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Issued {new Date(t.citation_issued_datetime).toLocaleDateString()}
                            {t.due_date && ` • Due ${new Date(t.due_date).toLocaleDateString()}`}
                          </span>
                        </div>
                        {t.violation_desc && <div className="text-xs text-slate-500">{t.violation_desc}</div>}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <DollarSign className="w-4 h-4" />
                        {(t.fine_amount ?? 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">#{t.citation_number}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
