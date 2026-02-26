import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import cloudinary from "../config/cloudinary.js";

export const uploadProfilePic = async (req, res) => {
  try {
    // multer + cloudinary storage will set req.file.path or req.file.filename depending on storage
    // In multer-storage-cloudinary, file.path is usually the secure_url
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    // handle various storage outputs
    const url = req.file?.path || req.file?.location || req.file?.url || req.file?.secure_url;
    const publicId = req.file?.filename || req.file?.public_id || req.file?.publicId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: { url, publicId } },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, msg: "Profile picture updated", user: updatedUser });
  } catch (err) {
    console.error("uploadProfilePic error:", err);
    res.status(500).json({ success: false, msg: "Failed to upload profile picture", error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, price = 0, category, tags } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ success: false, msg: "Title and image are required" });
    }

    const imageUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.location;

    const publicId =
      req.file.filename ||
      req.file.public_id;

    const post = await Post.create({
      title,
      author: req.user._id,
      image: imageUrl,
      publicId,
      price: Number(price),
      category,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id }
    });

    await post.populate("author", "name profilePic");

    res.status(201).json({
      success: true,
      msg: "Post created successfully",
      post,
    });
  } catch (err) {
    // Cleanup cloudinary upload if post creation fails
    const publicId = req.file?.filename || req.file?.public_id;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    res.status(500).json({
      success: false,
      msg: "Failed to create post",
      error: err.message,
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        msg: "Post not found" 
      });
    }

    if (req.user.role !== "admin" && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        msg: "Not authorized to delete this post" 
      });
    }

    if (post.publicId) {
      await cloudinary.uploader.destroy(post.publicId);
    }

    await Post.findByIdAndDelete(postId);

    await User.findByIdAndUpdate(
      post.author,
      { $pull: { posts: postId } }
    );

    res.status(200).json({ 
      success: true,
      msg: "Post deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to delete post", 
      error: err.message 
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags, sortBy = 'createdAt', order = 'desc', minPrice, maxPrice } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(",").map(tag => tag.trim()) };
    if (req.query.author) query.author = req.query.author;
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("author", "name profilePic");

    const total = await Post.countDocuments(query);

    res.json({ 
      success: true,
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to fetch posts", 
      error: err.message 
    });
  }
};


export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false });

  const userId = req.user._id;

  if (post.likedBy.includes(userId)) {
    return res.status(400).json({ success: false, msg: "Already liked" });
  }

  post.likedBy.push(userId);
  post.likes = post.likedBy.length;

  await post.save();
  res.json({ success: true, likes: post.likes });
};


export const purchasePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ 
        success: false,
        msg: "Post not found" 
      });
    }
    
    if (post.price === 0) {
      return res.status(400).json({ 
        success: false,
        msg: "This post is free" 
      });
    }

    const user = await User.findById(req.user._id);
    const alreadyPurchased = user.purchases.some(
      p => p.post.toString() === post._id.toString()
    );
    
    if (alreadyPurchased) {
      return res.status(400).json({ 
        success: false,
        msg: "Already purchased" 
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { 
        purchases: { 
          post: post._id, 
          pricePaid: post.price,
          purchasedAt: new Date()
        } 
      },
    });

    // Update Post Sales Count
    post.sales = (post.sales || 0) + 1;
    await post.save();

    // Update Author Earnings
    await User.findByIdAndUpdate(post.author, {
      $inc: { earnings: post.price, totalSales: 1 }
    });

    res.status(200).json({ 
      success: true,
      msg: "Purchase successful", 
      post 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Purchase failed", 
      error: err.message 
    });
  }
};

export const downloadPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ 
        success: false,
        msg: "Post not found" 
      });
    }

    if (post.price > 0) {
      const user = await User.findById(req.user._id);
      const purchased = user.purchases.some(
        p => p.post.toString() === post._id.toString()
      );
      if (!purchased) {
        return res.status(403).json({ 
          success: false,
          msg: "Purchase required to download" 
        });
      }
    }

    res.json({ 
      success: true,
      url: post.image 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Download failed", 
      error: err.message 
    });
  }
};


export const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false });

  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false });

  post.comments.push({
    user: req.user._id,
    text,
    createdAt: new Date(),
  });

  await post.save();
  await post.populate("comments.user", "name profilePic");

  res.json({ success: true, comments: post.comments });
};
