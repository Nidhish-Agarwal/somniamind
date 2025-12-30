const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Define your allowed origins for CORS
const allowedOrigins = require("./config/allowedOrigins.js");

let io;

module.exports = (server) => {
  console.log("Allowed origins for socket", allowedOrigins);
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  console.log("This is the socket io:", io);

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;
    console.log("Trying socket connection in backend", token);

    if (!token) {
      console.log("No token provided in socket connection");
      socket.disconnect(true);
      return;
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      socket.userId = decoded.userId;

      console.log("Socket connected for user:", socket.userId);

      // Join user-specific room (useful for sending events only to this user)
      socket.join(socket.userId);

      socket.on("disconnect", (reason) => {
        console.log(
          `Client disconnected: userID:${socket.userId} - socketId:${socket.id}, reason: ${reason}`
        );
      });
    } catch (err) {
      console.log("Socket auth failed:", err.message);
      // Inform client about auth failure
      socket.emit("auth_error", new Error("jwt expired"));
      socket.disconnect(true);
    }
  });

  return io;
};

module.exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
