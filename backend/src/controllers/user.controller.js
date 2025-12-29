const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getCurrentStreak } = require("./dream.controller.js");
const RawDream = require("../models/rawDream.model.js");
const { sendFeedbackEmail } = require("../utils/mailer.js");

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res
      .status(200)
      .send({ message: "Successfully fetched the users", data: users });
  } catch (er) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchUserData = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const foundUser = await User.findById(userId).lean(); // Optimize with `.lean()`

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const rawDreamData = await RawDream.find({ user_id: userId }, "date");

    // Extract Dream dates to calculate streak
    const dreamDates = rawDreamData.map((dream) => dream.date);

    const { streak } = getCurrentStreak(dreamDates);

    return res.status(200).json({ user: foundUser, currentStreak: streak });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, bio } = req.body;

    const updateData = {
      username: username?.trim(),
      bio: bio?.trim(),
      profileImage: req.cloudinaryResult?.secure_url || req.body.profileImage,
    };

    // Handle profile picture deletion
    if (req.body.profileImage === "") {
      updateData.profileImage = "";
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const sendFeedback = async (req, res) => {
  try {
    const { feedbackType, message } = req.body;

    if (!message || !feedbackType) {
      return res
        .status(400)
        .json({ error: "Feedback type and message are required." });
    }

    // Get user info from DB
    const user = await User.findById(req.userId).select("username email");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Emoji and title map
    const emojiMap = {
      bug: "🐞 Bug Report",
      idea: "💡 Idea Suggestion",
      love: "💖 Love Note",
    };

    await sendFeedbackEmail(
      user.username,
      user.email,
      emojiMap[feedbackType],
      feedbackType,
      message
    );

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Feedback send error:", error);
    res.status(500).json({ error: "Failed to send feedback." });
  }
};

module.exports = {
  fetchAllUsers,
  fetchUserData,
  updateUserProfile,
  sendFeedback,
};
