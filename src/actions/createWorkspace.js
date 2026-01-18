"use server";

import { Agent, fetch as undiciFetch } from "undici";
import findAvailablePort from "@/lib/findAvailablePort";
import getContainerTemplate from "@/lib/stackContainerTemplates";
import buildImage from "@/lib/buildImage";

import dbConnect from "@/lib/mongodb";
import Workspace from "@/models/Workspace";
import User from "@/models/User";

const DOCKER_HOST = "http://localhost";
const dockerAgent = new Agent({
  connect: {
    socketPath: "/var/run/docker.sock",
  },
});

export async function createWorkspace(
  userId,
  stack,
  workspaceName,
  description,
  technologies,
  gitRepoName,
) {
  // Unique names based on timestamp
  const CONTAINER_NAME = `${stack}-workspace-` + Date.now();
  const IMAGE_NAME = `${stack}-workspace-image`;

  try {
    await dbConnect();

    // =====================================
    // --- STEP 1: CHECK IF IMAGE EXISTS ---
    // =====================================
    console.log(`[DOCKER-ENVIRONMENT] -- Checking for image: ${IMAGE_NAME}...`);

    const inspectRes = await undiciFetch(
      `${DOCKER_HOST}/images/${IMAGE_NAME}/json`,
      {
        dispatcher: dockerAgent,
      },
    );

    if (inspectRes.status === 200) {
      console.log("[DOCKER-ENVIRONMENT] -- Image found, skipping build.");
    } else if (inspectRes.status === 404) {
      console.log("[DOCKER-ENVIRONMENT] -- Image not found. Starting build...");
      await buildImage(stack, DOCKER_HOST, IMAGE_NAME);
    } else {
      throw new Error(`Error inspecting image: ${inspectRes.status}`);
    }

    // ================================
    // --- STEP 2: CREATE CONTAINER ---
    // ================================
    console.log("[DOCKER-ENVIRONMENT] -- Creating container...");

    const existingWorkspaces = await Workspace.find({}, "container.urls");

    // Extract Ports from URL strings
    // Logic: Flatten the arrays -> Parse URL -> Get Port
    const occupiedPorts = existingWorkspaces
      .flatMap((ws) => {
        const urls = ws.container?.urls || [];

        return urls.map((urlStr) => {
          try {
            const urlObj = new URL(urlStr);
            return parseInt(urlObj.port, 10);
          } catch (e) {
            console.warn(`Failed to parse port from URL: ${urlStr}`);
            return null;
          }
        });
      })
      .filter((p) => p !== null && !isNaN(p));

    console.log("[DOCKER-ENVIRONMENT] -- Found reserved ports:", occupiedPorts);

    // Find TWO available ports
    // Port A: For the App
    const appPort = await findAvailablePort(9000, 12000, occupiedPorts);

    // Add appPort to the blocklist so we don't pick it again immediately
    const idePort = await findAvailablePort(9000, 12000, [
      ...occupiedPorts,
      appPort,
    ]);

    console.log(
      `[DOCKER-ENVIRONMENT] -- Selected ports - App: ${appPort}, IDE: ${idePort}`,
    );

    // Get container template based on stack
    const CONTAINER_TEMPLATE = getContainerTemplate(
      stack,
      appPort,
      idePort,
      userId,
      gitRepoName,
    );

    const createRes = await undiciFetch(
      `${DOCKER_HOST}/containers/create?name=${CONTAINER_NAME}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        dispatcher: dockerAgent,
        body: JSON.stringify({
          Image: IMAGE_NAME,
          ...CONTAINER_TEMPLATE,
        }),
      },
    );

    console.log(
      `[DOCKER-ENVIRONMENT] -- Container will be accessible at ports: ${appPort} (App), ${idePort} (IDE)`,
    );

    if (!createRes.ok)
      throw new Error(`Create failed: ${await createRes.text()}`);
    const containerData = await createRes.json();
    const containerId = containerData.Id;

    console.log(
      `[DOCKER-ENVIRONMENT] -- Container created with ID: ${containerId}`,
    );

    // ===============================
    // --- STEP 3: START CONTAINER ---
    // ===============================
    console.log("[DOCKER-ENVIRONMENT] -- Starting container...");
    await undiciFetch(`${DOCKER_HOST}/containers/${containerId}/start`, {
      method: "POST",
      dispatcher: dockerAgent,
    });

    console.log("[DOCKER-ENVIRONMENT] -- Container started successfully.");

    const finalUrls = [
      `http://localhost:${appPort}`,
      `http://localhost:${idePort}`,
    ];

    // ================================
    // --- STEP 4: SAVE TO DATABASE ---
    // ================================
    console.log("[MONGODB] -- Saving Workspace to MongoDB...");

    // A. Create the Workspace Document
    const newWorkspace = await Workspace.create({
      name: workspaceName,
      stack: stack,
      description: description || "No description",
      technologies: technologies || "Not specified",
      gitRepo: gitRepoName || "",
      owner: userId,

      container: {
        id: containerId,
        name: CONTAINER_NAME,
        status: "running",
        image: IMAGE_NAME,
        urls: finalUrls,
        labels: {
          created_by: "devsandbox",
        },
      },
    });

    // B. Link it to the User
    await User.findByIdAndUpdate(userId, {
      $push: { workspaces: newWorkspace._id },
    });
    console.log("[MONGODB] -- Database updated.");

    return {
      success: true,
      url: finalUrls,
      containerId,
      workspaceId: newWorkspace._id.toString(),
    };
  } catch (error) {
    console.error("Error in workspace procedure:", error);
    return { success: false, error: error.message };
  }
}
