"use server";

import { Agent, fetch as undiciFetch } from "undici";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: {
    socketPath: "/var/run/docker.sock",
  },
});

/**
 * Get container stats for all users (admin only)
 * Returns stats for all containers created by the devsandbox app
 */
export async function getAdminContainerStats() {
  try {
    // Filter only by created_by label (not by owner) to get all workspaces
    const filters = JSON.stringify({
      label: ["created_by=devsandbox"],
    });

    const url = `${DOCKER_HOST}/containers/json?all=true&filters=${encodeURIComponent(
      filters,
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
      } else if (state === "created" || state === "restarting") {
        stats.pending++;
      } else {
        stats.stopped++;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get Docker system metrics (admin only)
 * Returns memory, CPU, and storage usage
 */
export async function getDockerMetrics() {
  try {
    // Get system info for hardware details
    const infoResponse = await undiciFetch(`${DOCKER_HOST}/info`, {
      method: "GET",
      dispatcher: dockerAgent,
    });

    if (!infoResponse.ok) {
      throw new Error(`Failed to fetch system info: ${infoResponse.status}`);
    }

    const systemInfo = await infoResponse.json();

    // Get ALL devsandbox containers (with any status)
    const filters = JSON.stringify({
      label: ["created_by=devsandbox"],
    });

    const allContainersResponse = await undiciFetch(
      `${DOCKER_HOST}/containers/json?all=true&filters=${encodeURIComponent(filters)}`,
      {
        method: "GET",
        dispatcher: dockerAgent,
      },
    );

    const allContainers = await allContainersResponse.json();

    // Count containers by state
    const containerStats = {
      total: allContainers.length,
      running: 0,
      paused: 0,
      stopped: 0,
    };

    allContainers.forEach((container) => {
      const state = container.State;
      if (state === "running") {
        containerStats.running++;
      } else if (state === "paused") {
        containerStats.paused++;
      } else {
        containerStats.stopped++;
      }
    });

    // Get all images and filter for workspace images
    const imagesResponse = await undiciFetch(`${DOCKER_HOST}/images/json`, {
      method: "GET",
      dispatcher: dockerAgent,
    });

    const allImages = await imagesResponse.json();

    // Count images with "-workspace-image" in their name
    const workspaceImages = allImages.filter((image) => {
      const tags = image.RepoTags || [];
      return tags.some((tag) => tag.includes("-workspace-image"));
    });

    // Calculate metrics (only for devsandbox containers)
    const metrics = {
      containers: containerStats,
      images: systemInfo.Images || 0,
      workspaceImages: workspaceImages.length,
      memory: {
        total: systemInfo.MemTotal || 0,
        totalGB: ((systemInfo.MemTotal || 0) / 1024 / 1024 / 1024).toFixed(2),
      },
      system: {
        name: systemInfo.Name || "Unknown",
        operatingSystem: systemInfo.OperatingSystem || "Unknown",
        architecture: systemInfo.Architecture || "Unknown",
        cpus: systemInfo.NCPU || 0,
        dockerVersion: systemInfo.ServerVersion || "Unknown",
      },
      devsandboxContainers: containerStats.running,
    };

    return { success: true, data: metrics };
  } catch (error) {
    console.error("Error fetching Docker metrics:", error);
    return { success: false, error: error.message };
  }
}
