"use server";

import dbConnect from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import User from "@/models/User";
import { Agent, fetch as undiciFetch } from "undici";
import { revalidatePath } from "next/cache";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: {
    socketPath: "/var/run/docker.sock",
  },
});

export async function deleteWorkspace(workspaceId, userId) {
  try {
    await dbConnect();

    // 1. Get Workspace Details
    // We need to find it first to know which Docker Container ID to kill
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: userId,
    });

    if (!workspace) {
      throw new Error("Workspace not found or unauthorized");
    }

    const containerId = workspace.container?.id;

    // 2. Kill Docker Container (if it exists)
    // We use ?force=true to kill it even if it is running
    if (containerId) {
      console.log(`🐳 Attempting to remove container: ${containerId}`);
      try {
        const res = await undiciFetch(
          `${DOCKER_HOST}/containers/${containerId}?force=true`,
          {
            method: "DELETE",
            dispatcher: dockerAgent,
          }
        );

        if (res.status === 404) {
          console.log(
            "⚠️ Container was already deleted from Docker. Proceeding with DB cleanup."
          );
        } else if (!res.ok) {
          console.error(`Docker Error: ${await res.text()}`);
          // We intentionally do NOT throw here.
          // If Docker fails (e.g. network glitch), we still want to clean up the DB
          // if the user really wants it gone.
          // OR: You can throw here if you prefer strict consistency.
        }
      } catch (dockerErr) {
        console.log(
          "⚠️ Failed to reach Docker (Container likely gone):",
          dockerErr.message
        );
      }
    }

    // 3. Delete from MongoDB (The Workspace Document)
    await Workspace.findByIdAndDelete(workspaceId);

    // 4. Remove Reference from User Document
    // This removes the workspace ID from the user's 'workspaces' array
    await User.findByIdAndUpdate(userId, {
      $pull: { workspaces: workspaceId },
    });

    console.log(`✅ Workspace ${workspaceId} deleted successfully.`);

    // 5. Refresh Data
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("❌ Delete Action Failed:", error);
    return { success: false, error: error.message };
  }
}
