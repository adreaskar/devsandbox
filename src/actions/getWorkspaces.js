"use server";

import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import Workspace from "@/models/Workspace";
import User from "@/models/User";
import { Agent, fetch as undiciFetch } from "undici";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: { socketPath: "/var/run/docker.sock" },
});

export async function getUserWorkspaces(userId) {
  await dbConnect();

  // ================================
  // --- STEP 1: FETCH WORKSPACES ---
  // ================================
  const workspaces = await Workspace.find({ owner: userId })
    .sort({ createdAt: -1 })
    .lean();
  if (!workspaces.length) return [];

  // ===================================
  // --- STEP 2: FETCH DOCKER STATUS ---
  // ===================================
  try {
    // Fetch ALL Docker containers (Running AND Stopped)
    const dockerRes = await undiciFetch(
      `${DOCKER_HOST}/containers/json?all=true`,
      {
        dispatcher: dockerAgent,
      }
    );

    const activeContainers = new Map();
    if (dockerRes.ok) {
      const containers = await dockerRes.json();
      containers.forEach((c) => {
        // Map ID -> State (e.g., 'running', 'exited', 'created')
        activeContainers.set(c.Id, c.State);
      });
    }

    // Sync & Self-Heal
    const validWorkspaces = [];
    const ghostsToDelete = [];

    for (const ws of workspaces) {
      const containerId = ws.container?.id;
      const realState = activeContainers.get(containerId);

      if (realState) {
        // CASE A: Container Exists (Running or Stopped)
        // Normalize Docker state to UI state
        ws.container.status = realState === "running" ? "running" : "stopped";

        // Fix serialization
        ws._id = ws._id.toString();
        ws.owner = ws.owner.toString();
        if (ws.createdAt) ws.createdAt = ws.createdAt.toISOString();
        if (ws.updatedAt) ws.updatedAt = ws.updatedAt.toISOString();

        validWorkspaces.push(ws);
      } else {
        // CASE B: Container is MISSING from Docker
        // Since AutoRemove is false, missing = manually deleted.
        // We mark this workspace for deletion.
        console.log(
          `[MONGODB] -- Ghost workspace detected: ${ws.name} (Container ${containerId} missing). Cleaning up...`
        );
        ghostsToDelete.push(ws._id);
      }
    }

    // ======================================
    // --- STEP 3: CLEANUP GHOSTS FROM DB ---
    // ======================================
    if (ghostsToDelete.length > 0) {
      console.log(
        `[MONGODB] -- Removing ${ghostsToDelete.length} ghost(s) from User ${userId}`
      );

      const objectIdsToDelete = ghostsToDelete.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      await Promise.all([
        // Delete the Workspace documents
        Workspace.deleteMany({ _id: { $in: objectIdsToDelete } }),
        // Update the User document (Pull the IDs from the array)
        User.updateOne(
          { _id: userId },
          { $pull: { workspaces: { $in: objectIdsToDelete } } }
        ),
      ]);

      console.log("[MONGODB] -- Cleanup complete.");
    }

    return validWorkspaces;
  } catch (err) {
    console.error("Docker Sync Error:", err);
    // Fallback: Show DB data if Docker is unreachable
    return workspaces.map((ws) => ({
      ...ws,
      _id: ws._id.toString(),
      owner: ws.owner.toString(),
      createdAt: ws.createdAt?.toISOString(),
      updatedAt: ws.updatedAt?.toISOString(),
    }));
  }
}
