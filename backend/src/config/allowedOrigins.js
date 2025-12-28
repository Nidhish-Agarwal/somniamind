require("dotenv").config();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  "http://localhost:5173",
  "https://unadministrative-yer-multijugate.ngrok-free.dev",
];

module.exports = allowedOrigins;
