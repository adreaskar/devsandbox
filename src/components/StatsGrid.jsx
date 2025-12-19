'use client'
import { useState, useEffect } from 'react';
import { getContainerStats } from '@/actions/getContainerStats';

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
        <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Running" value={stats.running} color="text-green-600" />
            <StatCard label="Pending / Stuck" value={stats.pending} color="text-orange-500" />
            <StatCard label="Stopped" value={stats.stopped} color="text-gray-500" />
        </div>
    );
}

function StatCard({ label, value, color = "text-black" }) {

    return (
        <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}