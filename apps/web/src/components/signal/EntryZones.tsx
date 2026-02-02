import { formatNumber } from '@/lib/utils';
import { Target } from 'lucide-react';

interface EntryZonesProps {
    zones: [number, number][];
}

export function EntryZones({ zones }: EntryZonesProps) {
    if (!zones || zones.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Target className="h-3 w-3 text-primary" /> Giriş Kademeleri
            </div>
            <div className="grid grid-cols-1 gap-2">
                {zones.map((zone, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
                                {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground uppercase">Kademe</span>
                        </div>
                        <span className="font-mono text-base font-black text-white group-hover:text-primary transition-colors">
                            {formatNumber(zone[0])} <span className="text-muted-foreground/40 mx-2 text-xs">→</span> {formatNumber(zone[1])}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}