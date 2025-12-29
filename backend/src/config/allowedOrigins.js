require("dotenv").config();

const allowedOrigins = [process.env.PUBLIC_ORIGIN, "http://localhost:5173"];

module.exports = allowedOrigins;
