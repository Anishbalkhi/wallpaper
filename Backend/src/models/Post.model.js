import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 2, maxlength: 150 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String, required: true },
    publicId: { type: String },
    price: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    category: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: Date,
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

// Indexes for performance
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ price: 1 });

const Post = mongoose.model("Post", postSchema);
export default Post;