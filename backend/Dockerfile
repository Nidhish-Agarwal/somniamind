# ---- Base image ----
FROM node:20-alpine

# ---- Set working directory ----
WORKDIR /app

# ---- Copy package files first (better caching) ----
COPY package.json package-lock.json ./

# ---- Install only production dependencies ----
RUN npm ci --only=production

# ---- Copy rest of the backend code ----
COPY . .

# ---- Expose port (Fly.io / Render will map it) ----
EXPOSE 8080

# ---- Start the server ----
CMD ["node", "src/index.js"]
