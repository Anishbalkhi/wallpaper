import User from "../models/User.model.js";
import Post from "../models/Post.model.js";
import cloudinary from "../config/cloudinary.js";

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        msg: "No file uploaded" 
      });
    }

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

    res.status(200).json({ 
      success: true, 
      msg: "Profile picture updated successfully",
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to upload profile picture", 
      error: err.message 
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, price = 0, category, tags } = req.body;
    
    if (!title || !req.file) {
      return res.status(400).json({ 
        success: false,
        msg: "Title and image are required" 
      });
    }

    const post = new Post({
      title,
      author: req.user.id,
      image: req.file.path,
      publicId: req.file.filename,
      price: Number(price),
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    });

    await post.save();
    
    // Update user's posts array
    await User.findByIdAndUpdate(
      req.user.id, 
      { $push: { posts: post._id } }
    );

    // Populate author info for response
    await post.populate('author', 'name profilePic');

    res.status(201).json({ 
      success: true, 
      msg: "Post created successfully",
      post 
    });
  } catch (err) {
    // Delete uploaded image if post creation fails
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    
    res.status(500).json({ 
      success: false,
      msg: "Failed to create post", 
      error: err.message 
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

    // Authorization check
    if (req.user.role !== "admin" && post.author.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        msg: "Not authorized to delete this post" 
      });
    }

    // Delete from Cloudinary
    if (post.publicId) {
      await cloudinary.uploader.destroy(post.publicId);
    }

    // Delete post from database
    await Post.findByIdAndDelete(postId);

    // Remove post from user's posts array
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
    const { page = 1, limit = 10, category, tags } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(",").map(tag => tag.trim()) };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
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

    const user = await User.findById(req.user.id);
    const alreadyPurchased = user.purchases.some(
      p => p.post.toString() === post._id.toString()
    );
    
    if (alreadyPurchased) {
      return res.status(400).json({ 
        success: false,
        msg: "Already purchased" 
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $push: { 
        purchases: { 
          post: post._id, 
          pricePaid: post.price,
          purchasedAt: new Date()
        } 
      },
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
      const user = await User.findById(req.user.id);
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