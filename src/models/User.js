import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    lastname: String,
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
