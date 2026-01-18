"use client";
import { useState, useEffect } from "react";
import { getDockerMetrics } from "@/actions/getAdminStats";
import Window from "@/components/Window";
import { Server, HardDrive, Cpu, Container } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DockerMetricsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  const fetchMetrics = async () => {
    setLoading(true);
    const result = await getDockerMetrics();
    if (result.success) {
      setMetrics(result.data);

      // Add to history (keep last 10 data points)
      const timestamp = new Date().toLocaleTimeString();
      setHistoryData((prev) => {
        const newData = [
          ...prev,
          {
            time: timestamp,
            running: result.data.containers.running,
            stopped: result.data.containers.stopped,
            paused: result.data.containers.paused,
            devsandbox: result.data.devsandboxContainers,
          },
        ];
        return newData.slice(-10); // Keep only last 10 entries
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = {
    running: "#22c55e",
    stopped: "#6b7280",
    paused: "#eab308",
    devsandbox: "#3b82f6",
  };

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Window title="Loading..." className="border-border/50 border-solid">
          <p className="text-muted-foreground">Fetching Docker metrics...</p>
        </Window>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div>
        <h3 className="text-lg font-mono font-semibold mb-4 text-primary-foreground">
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Window
            title="Docker Version"
            className="border-border/50 border-solid"
          >
            <div className="flex items-center gap-3">
              <Container className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary-foreground">
                  {metrics.system.dockerVersion}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.system.architecture}
                </p>
              </div>
            </div>
          </Window>

          <Window title="CPU Cores" className="border-border/50 border-solid">
            <div className="flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-primary-foreground">
                  {metrics.system.cpus}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Available</p>
              </div>
            </div>
          </Window>

          <Window title="Memory" className="border-border/50 border-solid">
            <div className="flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-primary-foreground">
                  {metrics.memory.totalGB} GB
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total RAM</p>
              </div>
            </div>
          </Window>

          <Window title="System" className="border-border/50 border-solid">
            <div className="flex items-center gap-3">
              <Server className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-xl font-bold text-primary-foreground line-clamp-1">
                  {metrics.system.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.system.operatingSystem}
                </p>
              </div>
            </div>
          </Window>
        </div>
      </div>

      {/* Container Activity Over Time */}
      <div>
        <h3 className="text-lg font-mono font-semibold mb-4 text-primary-foreground">
          Container Activity (Last 10 Data Points)
        </h3>
        <Window className="border-border/50 border-solid p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="time"
                stroke="#888"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="running" fill={COLORS.running} name="Running" />
              <Bar dataKey="stopped" fill={COLORS.stopped} name="Stopped" />
              <Bar dataKey="paused" fill={COLORS.paused} name="Paused" />
            </BarChart>
          </ResponsiveContainer>
        </Window>
      </div>

      {/* Container Distribution */}
      <div>
        <h3 className="text-lg font-mono font-semibold mb-4 text-primary-foreground">
          Current Container Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Window
            title="Container Status"
            className="border-border/50 border-solid p-6"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Running", value: metrics.containers.running },
                    { name: "Stopped", value: metrics.containers.stopped },
                    { name: "Paused", value: metrics.containers.paused },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.running} />
                  <Cell fill={COLORS.stopped} />
                  <Cell fill={COLORS.paused} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Window>

          <Window
            title="System Overview"
            className="border-border/50 border-solid p-6"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Images",
                    count: metrics.workspaceImages,
                    fill: "#8b5cf6",
                  },
                  {
                    name: "Containers",
                    count: metrics.containers.total,
                    fill: "#3b82f6",
                  },
                ]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#888"
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </Window>
        </div>
      </div>
    </div>
  );
}
