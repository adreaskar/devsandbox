"use server";

import { Agent, fetch as undiciFetch } from "undici";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: {
    socketPath: "/var/run/docker.sock",
  },
});

export async function getContainerStats(userId) {
  try {
    const filters = JSON.stringify({
      label: ["created_by=devsandbox", `owner=${userId}`],
    });

    const url = `${DOCKER_HOST}/containers/json?all=true&filters=${encodeURIComponent(
      filters
    )}`;

    const response = await undiciFetch(url, {
      method: "GET",
      dispatcher: dockerAgent,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status}`);
    }

    const containers = await response.json();

    const stats = {
      total: containers.length,
      running: 0,
      pending: 0,
      stopped: 0,
    };

    // Analyze container states
    containers.forEach((container) => {
      const state = container.State;

      if (state === "running") {
        stats.running++;
      }
      // 'created' means it exists but hasn't started (Staging/Stuck)
      // 'restarting' means it's in a crash loop
      else if (state === "created" || state === "restarting") {
        stats.pending++;
      }
      // 'exited' and 'dead' are stopped containers
      else if (state === "exited" || state === "dead") {
        stats.stopped++;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error("Stats Error:", error);
    return {
      success: false,
      error: error.message,
      data: { total: 0, running: 0, pending: 0, stopped: 0 },
    };
  }
}
