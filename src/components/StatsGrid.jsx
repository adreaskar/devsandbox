'use client'
import { useState, useEffect } from 'react';
import { getContainerStats } from '@/actions/getContainerStats';
import Window from './Window';

export default function StatsGrid({ refreshKey }) {
    const [stats, setStats] = useState({ total: 0, running: 0, pending: 0, stopped: 0 });

    const fetchStats = async () => {
        const result = await getContainerStats();
        if (result.success) {
            setStats(result.data);
        }
    };

    // 1. Initial Fetch & Parent Trigger
    useEffect(() => {
        fetchStats();
    }, [refreshKey]);

    // 2. Real-time Event Listener (SSE)
    useEffect(() => {
        console.log("🔌 Connecting to Docker Event Stream...");
        const eventSource = new EventSource('/api/docker-events');

        eventSource.onmessage = (event) => {
            console.log("⚡ Docker Event received! Refreshing stats...");
            fetchStats();
        };

        eventSource.onerror = (err) => {
            eventSource.close();
        };

        return () => {
            console.log("🔌 Disconnecting stream.");
            eventSource.close();
        };
    }, []);

    return (
        <div className="grid grid-cols-4 gap-4 border-b border-border/50 pb-8">
            <Window title="Total">
                <p className="text-3xl font-bold text-primary-foreground">{stats.total}</p>
            </Window>
            <Window title="Running">
                <p className="text-3xl font-bold text-primary-foreground">{stats.running}</p>
            </Window>
            <Window title="Pending / Stuck">
                <p className="text-3xl font-bold text-primary-foreground">{stats.pending}</p>
            </Window>
            <Window title="Stopped">
                <p className="text-3xl font-bold text-gray-500">{stats.stopped}</p>
            </Window>
        </div >
    );
}