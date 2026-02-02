import { Strength } from '@/types/engine';
import { cn } from '@/lib/utils';

interface SignalStrengthProps {
    strength: Strength;
}

export function SignalStrength({ strength }: SignalStrengthProps) {
    const config = {
        WEAK: { color: 'bg-amber-500', width: '33%', label: 'Zayıf' },
        MODERATE: { color: 'bg-primary', width: '66%', label: 'Orta' },
        STRONG: { color: 'bg-emerald-500', width: '100%', label: 'Kuvvetli' },
    };

    const { color, width, label } = config[strength];

    return (
        <div className="space-y-2 min-w-[120px]">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-0.5">
                <span className="text-muted-foreground/60">Güvenlik</span>
                <span className={cn(
                    'transition-colors duration-500',
                    strength === 'WEAK' && 'text-amber-400',
                    strength === 'MODERATE' && 'text-primary',
                    strength === 'STRONG' && 'text-emerald-400',
                )}>{label}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden ring-1 ring-white/5">
                <div
                    className={cn('h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]', color)}
                    style={{ width }}
                />
            </div>
        </div>
    );
}