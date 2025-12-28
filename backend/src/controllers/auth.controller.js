const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer.js");
const axios = require("axios");
require("dotenv").config();

// Helper function to get device info
const getDeviceInfo = (userAgent) => {
  // Simple device detection - you might want to use a library like 'ua-parser-js'
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    return "Mobile Device";
  } else if (/Windows/.test(userAgent)) {
    return "Windows Computer";
  } else if (/Mac/.test(userAgent)) {
    return "Mac Computer";
  } else if (/Linux/.test(userAgent)) {
    return "Linux Computer";
  }
  return "Unknown Device";
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to DB
    await newUser.save();

    // Generate Access Token
    const accessToken = jwt.sign(
      { userId: newUser._id, roles: newUser.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generating Refresh Token
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Clean up expired sessions (older than 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    newUser.sessions = newUser.sessions.filter(
      (session) => session.createdAt > sevenDaysAgo
    );

    // Add new session
    const newSession = {
      refreshToken,
      deviceInfo: getDeviceInfo(req.headers["user-agent"] || ""),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "",
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    if (!newUser.sessions) {
      newUser.sessions = [];
    }
    newUser.sessions.push(newSession);

    // Optional: Limit concurrent sessions
    if (newUser.sessions.length > 5) {
      newUser.sessions = newUser.sessions.slice(-5);
    }

    await newUser.save();

    // Storing refreshToken in httpOnly Cookie
    // This is done to verify and get a new access token upon it's expiration
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(201).json({
      message: "User registered successfully",
      roles: newUser.roles,
      _id: newUser._id,
      accessToken,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Check if refresh token cookie exists
    const existingToken = req.cookies?.jwt;
    if (existingToken) {
      try {
        const decoded = jwt.verify(
          existingToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        if (decoded.userId === user._id.toString()) {
          const sessionExists = user.sessions.some(
            (session) => session.refreshToken === existingToken
          );

          if (sessionExists) {
            const accessToken = jwt.sign(
              { userId: user._id, roles: user.roles },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "15m" }
            );

            return res.status(200).json({
              message: "Already logged in. Access token refreshed.",
              roles: user.roles,
              _id: user._id,
              accessToken,
            });
          } else {
            // Token valid but session missing — treat as stale
            res.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            });
            console.warn(
              "Valid refresh token but session not found. Clearing cookie."
            );
          }
        } else {
          // Token mismatch with user
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });

          const previousUser = await User.findById(decoded.userId);
          if (previousUser) {
            previousUser.sessions = previousUser.sessions.filter(
              (s) => s.refreshToken !== existingToken
            );
            await previousUser.save();
          }

          console.warn(
            "Refresh token user mismatch during login. Cookie cleared."
          );
        }
      } catch (err) {
        console.warn(
          "Invalid or expired refresh token in login. Continuing fresh login."
        );
      }
    }

    // 4. Create new access and refresh tokens
    const accessToken = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Clean up expired sessions
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    user.sessions =
      user.sessions?.filter((session) => session.createdAt > sevenDaysAgo) ||
      [];

    // 6. Add new session
    const newSession = {
      refreshToken,
      deviceInfo: getDeviceInfo(req.headers["user-agent"] || ""),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "",
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    user.sessions.push(newSession);

    // 7. Optional: Keep only the latest 5 sessions
    if (user.sessions.length > 5) {
      user.sessions = user.sessions.slice(-5);
    }

    await user.save();

    // 8. Set the new refresh token cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      message: "Login successful",
      roles: user.roles,
      _id: user._id,
      accessToken,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;

    // If there is no cookie just send a status
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    // Checking the refresh token in DB
    const user = await User.findOne({ "sessions.refreshToken": refreshToken });
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    // Remove the session with the matching refresh token
    user.sessions = user.sessions.filter(
      (session) => session.refreshToken !== refreshToken
    );

    await user.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("❌ Error in logout:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getActiveSessions = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentToken = req.cookies.jwt;

    const sessions = user.sessions.map((session) => ({
      id: session._id,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      lastUsed: session.lastUsed,
      isCurrent: session.refreshToken === currentToken,
    }));

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("❌ Error in getActiveSessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const initialCount = user.sessions.length;
    user.sessions = user.sessions.filter((s) => s._id.toString() !== sessionId);
    if (user.sessions.length === initialCount) {
      return res.status(404).json({ message: "Session not found" });
    }

    await user.save();
    return res.status(200).json({ message: "Logged out from that session" });
  } catch (error) {
    console.error("❌ Error in logoutSessionById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutAllSessions = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentToken = req.cookies.jwt;

    user.sessions = user.sessions.filter(
      (session) => session.refreshToken === currentToken
    );

    await user.save();

    return res
      .status(200)
      .json({ message: "Logged out from all other devices" });
  } catch (err) {
    console.error("❌ Error in logoutAllSessions:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const validatePassword = (password) => {
  // Length validation
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters",
    };
  }

  if (password.length > 16) {
    return {
      isValid: false,
      message: "Password can be at most 16 characters",
    };
  }

  // Uppercase letter validation
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one uppercase letter",
    };
  }

  // Lowercase letter validation
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one lowercase letter",
    };
  }

  // Number validation
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one number",
    };
  }

  // Special character validation
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one special character",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
  };
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Comprehensive password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Check if new password is the same as current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has a password (for social login users)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "Password change not available for social login accounts. Please contact support.",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.findByIdAndUpdate(
      userId,
      {
        password: hashedNewPassword,
      },
      { new: true }
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);

    // Handle specific database errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    if (error.name === "MongoError" || error.name === "MongoServerError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred. Please try again later.",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Valid email required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.provider !== "local") {
      return res.status(200).json({
        success: true,
        message: "If the email exists, reset instructions have been sent.",
      });
    }

    const issuedAt = new Date();
    user.resetPasswordIssuedAt = issuedAt;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, issuedAt: issuedAt.toISOString() },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" }
    );

    const link = `${process.env.PUBLIC_ORIGIN}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"SomniaMind Support" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Your SomniaMind Password",
      html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #0f172a, #4c1d95, #312e81);
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #e5e7eb;
    ">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="
              max-width: 520px;
              background: rgba(255, 255, 255, 0.06);
              backdrop-filter: blur(14px);
              border-radius: 24px;
              border: 1px solid rgba(255,255,255,0.18);
              padding: 36px 28px;
              box-shadow: 0 30px 80px rgba(0,0,0,0.45);
            ">

              <!-- Logo / Brand -->
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <h1 style="
                    margin: 0;
                    font-size: 26px;
                    font-weight: 700;
                    background: linear-gradient(90deg, #c7d2fe, #fbcfe8, #67e8f9);
                    color: #4c1d95;
                    -webkit-background-clip: text;
                  ">
                    SomniaMind
                  </h1>
                </td>
              </tr>

              <!-- Title -->
              <tr>
                <td style="padding-bottom: 12px;">
                  <h2 style="
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #f8fafc;
                    text-align: center;
                  ">
                    Reset Your Password
                  </h2>
                </td>
              </tr>

              <!-- Body text -->
              <tr>
                <td style="padding-bottom: 22px;">
                  <p style="
                    margin: 0;
                    font-size: 14.5px;
                    line-height: 1.7;
                    color: #cbd5f5;
                    text-align: center;
                  ">
                    We received a request to reset your SomniaMind password.
                    If this was you, click the button below to securely set a new one.
                  </p>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td align="center" style="padding: 18px 0 26px;">
                  <a href="${link}" style="
                    display: inline-block;
                    padding: 14px 36px;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #8b5cf6, #ec4899);
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 15px;
                  ">
                    Reset Password
                  </a>
                </td>
              </tr>

              <!-- Expiry -->
              <tr>
                <td style="padding-bottom: 18px;">
                  <p style="
                    margin: 0;
                    font-size: 13px;
                    color: #a5b4fc;
                    text-align: center;
                  ">
                    ⏳ This link will expire in <strong>15 minutes</strong>.
                  </p>
                </td>
              </tr>

              <!-- Security note -->
              <tr>
                <td style="
                  padding-top: 14px;
                  border-top: 1px solid rgba(255,255,255,0.15);
                ">
                  <p style="
                    margin: 0;
                    font-size: 12.5px;
                    line-height: 1.6;
                    color: #94a3b8;
                    text-align: center;
                  ">
                    If you didn’t request this, you can safely ignore this email.
                    Your account remains secure.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top: 22px;">
                  <p style="
                    margin: 0;
                    font-size: 11.5px;
                    color: #64748b;
                    text-align: center;
                  ">
                    © ${new Date().getFullYear()} SomniaMind • AI-powered dream interpretation
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
  </html>
  `,
    });

    res.status(200).json({
      success: true,
      message: "If the email exists, reset instructions have been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== "string" || !newPassword) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validation.message });
    }

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const { userId, issuedAt } = decoded;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: "Social login accounts can't reset password this way",
      });
    }

    // Check token has not already been used
    if (
      !user.resetPasswordIssuedAt ||
      new Date(user.resetPasswordIssuedAt).toISOString() !== issuedAt
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired or was already used",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Invalidate token after use
    user.resetPasswordIssuedAt = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired. Please request a new one.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }
    console.error("Reset password error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const googleLogin = async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    // 1. Fetch user info from Google using access token
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, picture } = googleRes.data;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Failed to retrieve Google user info" });
    }

    // 2. Check if user exists with local credentials
    const existingLocal = await User.findOne({ email, provider: "local" });
    if (existingLocal) {
      return res
        .status(409)
        .json({ message: "This email is already registered with a password." });
    }

    // 3. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name || email.split("@")[0],
        email,
        provider: "google",
        password: " ", // No password for social login
        isVerified: true,
        profileImage: picture,
      });

      await user.save();
    }

    // 3. Check if refresh token cookie exists
    const existingToken = req.cookies?.jwt;
    if (existingToken) {
      try {
        const decoded = jwt.verify(
          existingToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        if (decoded.userId === user._id.toString()) {
          const sessionExists = user.sessions.some(
            (session) => session.refreshToken === existingToken
          );

          if (sessionExists) {
            const accessToken = jwt.sign(
              { userId: user._id, roles: user.roles },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "15m" }
            );

            return res.status(200).json({
              message: "Already logged in. Access token refreshed.",
              roles: user.roles,
              _id: user._id,
              accessToken,
            });
          } else {
            // Token valid but session missing — treat as stale
            res.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            });
            console.warn(
              "Valid refresh token but session not found. Clearing cookie."
            );
          }
        } else {
          // Token mismatch with user
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });

          const previousUser = await User.findById(decoded.userId);
          if (previousUser) {
            previousUser.sessions = previousUser.sessions.filter(
              (s) => s.refreshToken !== existingToken
            );
            await previousUser.save();
          }

          console.warn(
            "Refresh token user mismatch during login. Cookie cleared."
          );
        }
      } catch (err) {
        console.warn(
          "Invalid or expired refresh token in login. Continuing fresh login."
        );
      }
    }

    // 4. Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Clean up expired sessions (older than 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    user.sessions = user.sessions.filter(
      (session) => session.createdAt > sevenDaysAgo
    );

    // Add new session
    const newSession = {
      refreshToken,
      deviceInfo: getDeviceInfo(req.headers["user-agent"] || ""),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "",
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    if (!user.sessions) {
      user.sessions = [];
    }
    user.sessions.push(newSession);

    // Optional: Limit concurrent sessions
    if (user.sessions.length > 5) {
      user.sessions = user.sessions.slice(-5);
    }

    await user.save();

    // 5. Store refresh token in httpOnly cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({
      accessToken,
      _id: user._id,
      roles: user.roles,
    });
  } catch (error) {
    console.error("Google OAuth login error:", error.message || error);
    return res
      .status(401)
      .json({ message: "Google login failed. Please try again." });
  }
};

module.exports = {
  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
  registerUser,
  loginUser,
  logout,
  getActiveSessions,
  logoutSessionById,
  logoutAllSessions,
};
