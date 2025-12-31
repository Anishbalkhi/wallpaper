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

const Post = mongoose.model("Post", postSchema);
export default Post;