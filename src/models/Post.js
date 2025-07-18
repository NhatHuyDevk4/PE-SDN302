import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
