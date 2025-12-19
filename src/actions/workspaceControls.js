"use server";

import dbConnect from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import { Agent, fetch as undiciFetch } from "undici";
import { revalidatePath } from "next/cache";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: { socketPath: "/var/run/docker.sock" },
});

export async function toggleContainer(workspaceId, action) {
  // Action can be 'start' or 'stop'
  if (!["start", "stop"].includes(action)) {
    throw new Error("Invalid action");
  }

  await dbConnect();

  // ================================
  // --- STEP 1: Get Container ID ---
  // ================================
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace || !workspace.container.id) {
    throw new Error("Workspace or Container ID not found");
  }

  const containerId = workspace.container.id;

  try {
    // ===============================
    // --- STEP 2: Call Docker API ---
    // ===============================
    // POST /containers/{id}/start  OR  POST /containers/{id}/stop
    const res = await undiciFetch(
      `${DOCKER_HOST}/containers/${containerId}/${action}`,
      {
        method: "POST",
        dispatcher: dockerAgent,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      // Handle "Container already started/stopped" gracefully
      if (res.status === 304) return { success: true };
      throw new Error(`Docker Error: ${errorText}`);
    }

    // ======================================
    // --- STEP 3: Update Workspace in DB ---
    // ======================================
    workspace.container.status = action === "start" ? "running" : "stopped";
    await workspace.save();

    // =======================================
    // --- STEP 4: Revalidate Next.js Path ---
    // =======================================
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(`Failed to ${action} container:`, error);
    return { success: false, error: error.message };
  }
}
