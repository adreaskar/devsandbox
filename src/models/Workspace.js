import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    stack: {
      type: String,
      required: true,
    },

    description: String,
    technologies: String,
    gitRepo: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    container: {
      id: String, // The Docker Container ID (long hash)
      name: String, // The Docker Name (e.g., python-workspace-12345)
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "running", "stopped", "failed"],
      },
      image: String,
      urls: {
        type: [String],
        default: [],
      },
      labels: {
        type: Map,
        of: String,
      },
      idePassword: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Workspace ||
  mongoose.model("Workspace", WorkspaceSchema);
