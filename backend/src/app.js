const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const userRouter = require("./routes/user.route.js");
const tokenRouter = require("./routes/token.route.js");
const dreamRouter = require("./routes/dream.route.js");
const communityRouter = require("./routes/post.route.js");
const authRouter = require("./routes/auth.route.js");
const corsOptions = require("./config/corsOptions.js");
const credentials = require("./middlewares/credentials.js");
const {
  renderLandingPageHTML,
  renderLoginPageHTML,
  renderSignupPageHTML,
  renderHowAIInterpretsDreamsHTML,
  renderWhyWeDreamHTML,
  renderPrivacyPolicyHTML,
  renderTermsHTML,
  renderDisclaimerHTML,
} = require("./renderers/index.js");
const { getPublicDream } = require("./controllers/dream.controller.js");
const RawDream = require("./models/rawDream.model.js");
const ProcessedDream = require("./models/processedDream.model.js");

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(credentials);
app.use(cors(corsOptions));

// SSR pages

app.get("/", (req, res) => {
  const html = renderLandingPageHTML();

  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });

  res.send(html);
});
app.get("/login", (req, res) => {
  const html = renderLoginPageHTML();

  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });

  res.send(html);
});
app.get("/signup", (req, res) => {
  const html = renderSignupPageHTML();

  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });

  res.send(html);
});

app.get("/dream/public/:id", getPublicDream);

// SEO Pages

app.get("/how-ai-interprets-dreams", (req, res) => {
  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });
  res.status(200).send(renderHowAIInterpretsDreamsHTML());
});

app.get("/why-we-dream", (req, res) => {
  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });
  res.status(200).send(renderWhyWeDreamHTML());
});

// Legal Pages
app.get("/terms", (req, res) => {
  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });
  res.status(200).send(renderTermsHTML());
});

app.get("/privacy", (req, res) => {
  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });
  res.status(200).send(renderPrivacyPolicyHTML());
});

app.get("/disclaimer", (req, res) => {
  res.set({
    "Content-Type": "text/html",
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });
  res.status(200).send(renderDisclaimerHTML());
});

// Sitemap and robots routes

app.get("/sitemap.xml", async (req, res) => {
  try {
    const BASE_URL = process.env.PUBLIC_ORIGIN || "https://somniamind.com";

    // 1️⃣ Static URLs
    const staticUrls = [
      {
        loc: `${BASE_URL}/`,
        changefreq: "weekly",
        priority: "1.0",
      },
      {
        loc: `${BASE_URL}/login`,
        changefreq: "yearly",
        priority: "0.2",
      },
      {
        loc: `${BASE_URL}/signup`,
        changefreq: "yearly",
        priority: "0.2",
      },
      {
        loc: `${BASE_URL}/why-we-dream`,
        changefreq: "monthly",
        lastmod: "2025-12-26",
        priority: "0.8",
      },
      {
        loc: `${BASE_URL}/how-ai-interprets-dreams`,
        changefreq: "monthly",
        lastmod: "2025-12-26",
        priority: "0.8",
      },
    ];

    // 2️⃣ Dynamic public dream URLs
    const dreams = await RawDream.find(
      { analysis_status: "completed" },
      "_id updatedAt"
    ).lean();

    const dreamUrls = dreams.map((dream) => ({
      loc: `${BASE_URL}/dream/public/${dream._id}`,
      lastmod: dream.updatedAt.toISOString(),
      changefreq: "never",
      priority: "0.6",
    }));

    // 3️⃣ Combine all URLs
    const allUrls = [...staticUrls, ...dreamUrls];

    // 4️⃣ Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`
  )
  .join("")}
</urlset>`;

    res.set({
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    });

    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Unable to generate sitemap");
  }
});

app.get("/robots.txt", async (req, res) => {
  res.type("text/plain");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(`User-agent: *
Allow: /

# Block private & non-SEO routes
Disallow: /api/
Disallow: /dashboard
Disallow: /settings
Disallow: /my-dreams
Disallow: /community
Disallow: /dream/
Disallow: /auth/

# Allow public dream pages explicitly
Allow: /dream/public/

# Sitemap location
Sitemap: https://somniamind.com/sitemap.xml
Sitemap: https://somniamind.com/image-sitemap.xml
`);
});

app.get("/image-sitemap.xml", async (req, res) => {
  try {
    const BASE_URL = process.env.PUBLIC_ORIGIN || "https://somniamind.com";

    const dreams = await ProcessedDream.aggregate([
      {
        $match: {
          image_url: { $exists: true },
        },
      },
      {
        $addFields: {
          versionNumber: {
            $toDouble: {
              $substr: ["$analysis_version", 1, -1],
            },
          },
        },
      },
      {
        $match: {
          versionNumber: { $gte: 1.4 },
        },
      },
      {
        $project: {
          _id: 1,
          image_url: 1,
          updatedAt: 1,
          share_one_liner: 1,
        },
      },
    ]);

    const urls = dreams.map(
      (dream) => `
  <url>
    <loc>${BASE_URL}/dream/public/${dream._id}</loc>
    <image:image>
      <image:loc>${dream.image_url}</image:loc>
      <image:title>${escapeXML(
        dream.share_one_liner || "Dream visualization"
      )}</image:title>
      <image:caption>AI-generated dream imagery</image:caption>
    </image:image>
  </url>
`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${urls.join("")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Image sitemap error");
  }
});

// API & HTML routes FIRST
app.use("/api/user", userRouter);
app.use("/api/refresh", tokenRouter);
app.use("/api/dream", dreamRouter);
app.use("/api/community", communityRouter);
app.use("/api/auth", authRouter);

const distPath = path.join(__dirname, "../public/dist");

// Serve assets FIRST
app.use(
  "/assets",
  express.static(path.join(distPath, "assets"), {
    immutable: true,
    maxAge: "1y",
  })
);

// Serve other static files
app.use(express.static(distPath));

// SPA fallback (must be LAST)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dist/index.html"));
});

module.exports = app;
