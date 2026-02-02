'use client';

import { useEffect, useRef, useState } from 'react';
import { AnalysisResponse } from '@/types/engine';

export function useRealtime(enabled: boolean, interval: string) {
    const [data, setData] = useState<AnalysisResponse | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!enabled) {
            ws.current?.close();
            setIsConnected(false);
            return;
        }

        // Only Pro users get realtime
        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/realtime?interval=${interval}`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => setIsConnected(true);
        ws.current.onclose = () => setIsConnected(false);
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'analysis') {
                setData(message.data);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [enabled, interval]);

    return { data, isConnected };
}