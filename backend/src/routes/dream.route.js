const express = require("express");
const {
  addRawDream,
  retryAnalysis,
  getAllDreams,
  toggleLike,
  retryImageGeneration,
  dreamScope,
  getDashboardInsights,
  dashboardExplore,
  getTeaserAnalysis,
} = require("../controllers/dream.controller.js");

// Middleware to verify the access token
const verifyJWT = require("../middlewares/verifyJWT.js");

const router = express.Router();

router.post("/", verifyJWT, addRawDream);
router.get("/getdreams", verifyJWT, getAllDreams);
router.post("/:id/retry", verifyJWT, retryAnalysis);
router.put("/:id/like", verifyJWT, toggleLike);
router.post("/retry-image/:id", verifyJWT, retryImageGeneration);
router.get("/dreamscope", verifyJWT, dreamScope);
router.get("/insights", verifyJWT, getDashboardInsights);
router.get("/explore", verifyJWT, dashboardExplore);
router.post("/teaser-analysis", getTeaserAnalysis);

module.exports = router;
