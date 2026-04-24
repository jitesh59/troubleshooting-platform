const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, content, subreddit } = req.body;

    const post = await Post.create({
      title,
      content,
      subreddit: subreddit || "general",
      author: req.user._id,
    });

    await post.populate("author", "username avatar");

    res.status(201).json({ success: true, post });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Get all posts (with pagination & search)
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const subreddit = req.query.subreddit || "";
    const sort = req.query.sort || "new"; // new, top, hot

    let query = {};

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Subreddit filter
    if (subreddit) {
      query.subreddit = subreddit.toLowerCase();
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "top":
        sortOption = { createdAt: -1 }; // we'll sort by votes client-side or use aggregate
        break;
      case "hot":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Upvote a post
// @route   PUT /api/posts/:id/upvote
exports.upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;

    // Remove from downvotes if exists
    post.downvotes = post.downvotes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Toggle upvote
    const upvoteIndex = post.upvotes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
    } else {
      post.upvotes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      voteScore: post.upvotes.length - post.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Downvote a post
// @route   PUT /api/posts/:id/downvote
exports.downvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;

    // Remove from upvotes if exists
    post.upvotes = post.upvotes.filter(
      (id) => id.toString() !== userId.toString()
    );

    // Toggle downvote
    const downvoteIndex = post.downvotes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (downvoteIndex > -1) {
      post.downvotes.splice(downvoteIndex, 1);
    } else {
      post.downvotes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      voteScore: post.upvotes.length - post.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.unshift({
      user: req.user._id,
      text,
    });

    await post.save();
    await post.populate("comments.user", "username avatar");

    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
