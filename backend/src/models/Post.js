const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [10000, "Content cannot exceed 10000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subreddit: {
      type: String,
      required: [true, "Community name is required"],
      trim: true,
      lowercase: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          maxlength: [2000, "Comment cannot exceed 2000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for vote score
postSchema.virtual("voteScore").get(function () {
  return this.upvotes.length - this.downvotes.length;
});

// Enable virtuals in JSON
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

// Text index for search
postSchema.index({ title: "text", content: "text", subreddit: "text" });

module.exports = mongoose.model("Post", postSchema);
