import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    stackId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    icon: String,
    technologies: [String],

    popularityScore: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Template ||
  mongoose.model("Template", TemplateSchema);
