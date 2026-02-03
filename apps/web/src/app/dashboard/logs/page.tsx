"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Copy, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Log {
    id: string;
    created_at: string;
    log_type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    details: string | null;
    source: string | null;
}

export default function LogsPage() {
    const { user } = useAuth();
    const supabase = createBrowserClient();
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (error) {
                    console.error('Error fetching logs:', error);
                } else {
                    setLogs(data || []);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('logs_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'logs',
                    filter: `user_id=eq.${user?.id}`
                },
                (payload) => {
                    setLogs((current) => [payload.new as Log, ...current]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case 'info': return <Info className="h-4 w-4 text-blue-500" />;
            default: return <Terminal className="h-4 w-4" />;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight gradient-text w-fit">Sistem Logları</h1>
                <p className="text-muted-foreground">Sistem tarafından üretilen tüm işlem kayıtları ve sonuçları.</p>
            </div>

            <Card className="bg-[#0c0c0e] border-white/10 font-mono text-sm">
                <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base font-normal">Console Output</CardTitle>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-4 text-muted-foreground animate-pulse">
                                Loading logs...
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Henüz log kaydı bulunmuyor.</p>
                                <p className="text-xs mt-2">Sistem aktiviteleri burada görünecektir.</p>
                            </div>
                        ) : (
                            <>
                                {logs.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className={`flex items-start gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group ${index === logs.length - 1 ? 'border-0' : ''
                                            }`}
                                    >
                                        <div className="mt-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                            {getIcon(log.log_type)}
                                        </div>
                                        <div className="min-w-[140px] text-muted-foreground text-xs pt-1 tabular-nums select-none">
                                            {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${log.log_type === 'error' ? 'text-red-400' :
                                                        log.log_type === 'warning' ? 'text-orange-400' :
                                                            log.log_type === 'success' ? 'text-green-400' :
                                                                'text-blue-400'
                                                    }`}>
                                                    {log.message}
                                                </span>
                                                {log.source && (
                                                    <span className="text-xs text-muted-foreground/50 px-2 py-0.5 bg-white/5 rounded">
                                                        {log.source}
                                                    </span>
                                                )}
                                            </div>
                                            {log.details && (
                                                <div className="text-xs text-muted-foreground/60 font-mono">
                                                    {`> ${log.details}`}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(`[${log.created_at}] ${log.message}${log.details ? ' - ' + log.details : ''}`)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                        >
                                            <Copy className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    </div>
                                ))}
                                <div className="p-4 text-xs text-muted-foreground animate-pulse">
                                    _cursor awaiting input...
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
