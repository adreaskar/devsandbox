"use server";

import dbConnect from "@/lib/mongodb";
import Template from "@/models/Template";
import fs from "fs/promises";
import path from "path";

export async function deleteTemplate(stackId) {
  try {
    if (!stackId) {
      return {
        success: false,
        error: "Stack ID is required",
      };
    }

    // Connect to database
    await dbConnect();

    // Find and delete template from MongoDB
    const template = await Template.findOneAndDelete({ stackId });

    if (!template) {
      return {
        success: false,
        error: `Template with stackId "${stackId}" not found`,
      };
    }

    // Delete folder from resources
    const resourcesPath = path.join(
      process.cwd(),
      "public",
      "resources",
      stackId,
    );

    try {
      await fs.rm(resourcesPath, { recursive: true, force: true });
      console.log(`[DELETE-TEMPLATE] Deleted folder: ${resourcesPath}`);
    } catch (fsError) {
      console.error("Error deleting template folder:", fsError);
      // Template was deleted from DB but folder deletion failed
      return {
        success: false,
        error: "Template deleted from database but failed to delete files",
      };
    }

    return {
      success: true,
      deletedTemplate: {
        stackId: template.stackId,
        name: template.name,
      },
    };
  } catch (error) {
    console.error("Error deleting template:", error);
    return {
      success: false,
      error: error.message || "Failed to delete template",
    };
  }
}
