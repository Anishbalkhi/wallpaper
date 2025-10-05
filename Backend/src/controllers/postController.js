import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import cloudinary from "../config/cloudinary.js";


export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePic: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const createPost = async (req, res) => {
  try {
    const { title, price = 0, category, tags } = req.body;
    if (!title || !req.file)
      return res.status(400).json({ msg: "Title and image are required" });

    const post = new Post({
      title,
      author: req.user.id,
      image: req.file.path,
      publicId: req.file.filename,
      price,
      category,
      tags: tags ? tags.split(",") : [],
    });

    await post.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { posts: post._id } });

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create post", error: err.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (req.user.role !== "admin" && post.author.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized to delete this post" });


    if (post.publicId) await cloudinary.uploader.destroy(post.publicId);

  
    await post.deleteOne();

    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags } = req.query;
    const query = {};
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(",") };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("author", "name profilePic");

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const purchasePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.price === 0) return res.status(400).json({ msg: "This post is free" });

    const user = await User.findById(req.user.id);
    const alreadyPurchased = user.purchases.some(
      p => p.post.toString() === post._id.toString()
    );
    if (alreadyPurchased)
      return res.status(400).json({ msg: "Already purchased" });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { purchases: { post: post._id, pricePaid: post.price } },
    });

    res.status(200).json({ msg: "Purchase successful", post });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const downloadPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.price > 0) {
      const user = await User.findById(req.user.id);
      const purchased = user.purchases.some(
        p => p.post.toString() === post._id.toString()
      );
      if (!purchased)
        return res.status(403).json({ msg: "Purchase required to download" });
    }

    res.json({ url: post.image });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
