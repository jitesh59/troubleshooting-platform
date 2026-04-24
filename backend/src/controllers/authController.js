const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Send cookie
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send cookie
    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  res.json({ success: true, message: "Logged out successfully" });
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
