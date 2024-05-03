const { generateToken } = require("../middleware/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user._id,
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
