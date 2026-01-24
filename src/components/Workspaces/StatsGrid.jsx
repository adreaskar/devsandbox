"use client";
import { useState, useEffect } from "react";
import { getContainerStats } from "@/actions/getContainerStats";
import Window from "@/components/Window";

export default function StatsGrid({ refreshKey, userId }) {
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    pending: 0,
    stopped: 0,
  });

  const fetchStats = async () => {
    const result = await getContainerStats(userId);
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
    console.log("[FRONTEND] -- Stats Grid listening for Docker updates...");
    const eventSource = new EventSource("/api/docker-events");

    eventSource.onmessage = (event) => {
      console.log("[FRONTEND] -- Docker Event received! Refreshing stats...");
      fetchStats();
    };

    eventSource.onerror = (err) => {
      eventSource.close();
    };

    return () => {
      console.log("[FRONTEND] -- Disconnecting stats stream.");
      eventSource.close();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <Window title="Total" className="border-border/50 border-solid">
        <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
          {stats.total}
        </p>
      </Window>
      <Window title="Running" className="border-border/50 border-solid">
        <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
          {stats.running}
        </p>
      </Window>
      <Window title="Pending" className="border-border/50 border-solid">
        <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
          {stats.pending}
        </p>
      </Window>
      <Window title="Stopped" className="border-border/50 border-solid">
        <p className="text-2xl md:text-3xl font-bold text-gray-500">
          {stats.stopped}
        </p>
      </Window>
    </div>
  );
}
