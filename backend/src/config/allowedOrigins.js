require("dotenv").config();

const allowedOrigins = [process.env.PUBLIC_ORIGIN];

module.exports = allowedOrigins;
