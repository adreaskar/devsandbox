"use server";

import dbConnect from "@/lib/mongodb";
import Template from "@/models/Template";
import Workspace from "@/models/Workspace";
import { auth } from "@/auth";

export async function getTemplates() {
  try {
    await dbConnect();

    // Fetch all templates, sorted by newest first
    // .lean() returns a plain JS object, but we still serialize
    // to ensure _id and dates are stringified safely for Next.js
    const templates = await Template.find({}).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(templates));
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { success: false, error: "Failed to load templates" };
  }
}

export async function getActiveTemplates() {
  try {
    const session = await auth();
    if (!session) return [];

    await dbConnect();

    // 1. Run both queries in parallel for speed
    const [templates, workspaces] = await Promise.all([
      Template.find({}).sort({ createdAt: -1 }).lean(),
      Workspace.find({
        owner: session.user.id,
        "container.status": "running", // Only count running containers (lowercase value)
      }).lean(),
    ]);

    // 2. Count matches
    // We map over templates and add a dynamic 'activeCount' field
    const activeTemplates = templates.filter((template) => {
      // Filter workspaces where workspace.stack matches template.stackId
      const activeInstances = workspaces.filter(
        (ws) => ws.stack === template.stackId,
      );

      return activeInstances.length > 0; // Keep template if it has active instances
    });

    return activeTemplates.length;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}
