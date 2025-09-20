import User from "../models/User.js";
import Post from "../models/Post.js";

// Upload profile picture
export const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profile = req.file.secure_url;
    await user.save();
    res.json({ success: true, profile: user.profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};


export const createPost = async (req, res) => {
  try {
    const { title, price, category, tags } = req.body;

    if (!title) return res.status(400).json({ msg: "Title is required" });

    const post = new Post({
      title,
      author: req.user.id,
      image: req.file?.secure_url || null,
      price: price || 0,
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


export const purchasePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.price === 0)
      return res.status(400).json({ msg: "This post is free to download" });

    // Check if already purchased
    const alreadyPurchased = req.user.purchases.some(
      (p) => p.post.toString() === post._id.toString()
    );
    if (alreadyPurchased)
      return res.status(400).json({ msg: "You already purchased this post" });

    // Payment integration (Stripe/PayPal) goes here
    // For demo, we assume payment is successful

    await User.findByIdAndUpdate(req.user.id, {
      $push: { purchases: { post: post._id, pricePaid: post.price } },
    });

    res.status(200).json({ msg: "Purchase successful", post });
  } catch (err) {
    res.status(500).json({ msg: "Failed to purchase post", error: err.message });
  }
};



export const downloadPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.price > 0) {
      // Check if user purchased it
      const purchased = req.user.purchases.some(
        (p) => p.post.toString() === post._id.toString()
      );
      if (!purchased)
        return res.status(403).json({ msg: "You must purchase this post first" });
    }

    res.json({ url: post.image });
  } catch (err) {
    res.status(500).json({ msg: "Failed to download post", error: err.message });
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
      .populate("author", "name profile");

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch posts", error: err.message });
  }
};
