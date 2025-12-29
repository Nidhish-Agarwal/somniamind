const RawDream = require("../models/rawDream.model.js"); // Adjust the path as necessary
const User = require("../models/user.model.js"); // Import User model
const mongoose = require("mongoose");
const { addAnalysisJob } = require("../queues/analysis.queue.js");
const ProcessedDream = require("../models/processedDream.model.js");
const { addImageJob } = require("../queues/image.queue.js");
const { z } = require("zod");
const {
  processTeaserDreamAnalysis,
  processNoRecallReflectionAnalysis,
} = require("../services/teaser-analysis.service.js");
const {
  renderPublicDreamHTML,
  render404HTML,
} = require("../renderers/index.js");
const { emitAddDream } = require("../utils/socketHelper.js");

const moodLabels = ["Terrified", "Sad", "Neutral", "Happy", "Euphoric"];

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  date: z.string().min(1, "Date is required."),
  mood: z.enum(moodLabels),
  intensity: z.number().min(0).max(100),
  symbols: z.array(z.string()).optional(),
  themes: z.array(z.string()).optional(),
  characters: z.array(z.string()).optional(),
  setting: z.array(z.string()).optional(),
  notes_to_ai: z.string().optional(),
  real_life_link: z.string().optional(),
});

const getCurrentStreak = (dreamDates) => {
  const dates = new Set(
    dreamDates.map((d) => new Date(d).toISOString().split("T")[0])
  );

  let streak = 0;
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const hasLoggedToday = dates.has(todayStr);

  // Start from yesterday if user hasn't logged today's dream
  let current = new Date();
  if (!hasLoggedToday) {
    current.setDate(current.getDate() - 1);
  }

  while (true) {
    const dateStr = current.toISOString().split("T")[0];
    if (dates.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, hasLoggedToday };
};

const moodToIndex = {
  Terrified: 0,
  Sad: 1,
  Neutral: 2,
  Happy: 3,
  Euphoric: 4,
};
const indexToMood = ["Terrified", "Sad", "Neutral", "Happy", "Euphoric"];
const moodToEmoji = {
  Terrified: "😭",
  Sad: "😔",
  Neutral: "😐",
  Happy: "😊",
  Euphoric: "🤩",
};

const addRawDream = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate the incoming body using Zod schema
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      // Extract all error messages from zod error
      const errorMessages = parsedData.error.errors
        .map((e) => e.message)
        .join(", ");
      return res
        .status(400)
        .json({ error: `Validation failed: ${errorMessages}` });
    }

    // Parse and validate date separately as Date object
    const parsedDate = new Date(parsedData.data.date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Build the new dream object to save
    const newDreamData = {
      user_id: userId,
      title: parsedData.data.title,
      description: parsedData.data.description,
      date: parsedDate,
      mood: parsedData.data.mood,
      intensity: parsedData.data.intensity,
      symbols: parsedData.data.symbols || [],
      themes: parsedData.data.themes || [],
      characters: parsedData.data.characters || [],
      setting: parsedData.data.setting || [],
      notes_to_ai: parsedData.data.notes_to_ai || "",
      real_life_link: parsedData.data.real_life_link || "",
    };

    const newDream = new RawDream(newDreamData);
    const savedDream = await newDream.save();

    const rawDreamData = await RawDream.find({ user_id: userId }, "date");

    // Extract Dream dates to calculate streak
    const dreamDates = rawDreamData.map((dream) => dream.date);

    const { streak: currentStreak } = getCurrentStreak(dreamDates);

    if (currentStreak > user.maxDreamStreak) {
      user.maxDreamStreak = currentStreak;
    }
    user.dreamCount = user.dreamCount + 1;

    await user.save();
    // Adding To queue for AI processing
    await addAnalysisJob(savedDream._id, userId);

    // Send socket update to frontend for a new dream
    try {
      emitAddDream(userId, savedDream);
    } catch (er) {
      console.error("failed to emit dream update", er.message);
    }

    return res.status(201).json({
      ...savedDream.toObject(),
      analysis_status: "processing",
    });
  } catch (error) {
    console.error("Error saving dream:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

// Retry Analysis Controller
const retryAnalysis = async (req, res) => {
  try {
    const dream = await RawDream.findById(req.params.id);

    if (!dream) return res.status(404).json({ error: "Dream not found" });
    if (dream.retry_count >= 3) {
      return res.status(400).json({ error: "Max retries exceeded" });
    }

    dream.analysis_status = "pending";
    await dream.save();

    await addAnalysisJob(dream._id, req.userId);

    res.json({ message: "Retry initiated" });
  } catch (error) {
    res.status(500).json({ error: "Retry failed" });
  }
};

const retryImageGeneration = async (req, res) => {
  try {
    const dream = await ProcessedDream.findById(req.params.id);
    if (!dream) return res.status(404).json({ error: "Dream not found" });

    // Optional: Retry limit (can also track image_retry_count separately)
    if (dream.image_retry_count >= 3) {
      return res.status(400).json({ error: "Max image retries exceeded" });
    }

    // Reset image status and increment retry count
    dream.image_status = "pending";
    // dream.image_retry_count = (dream.image_retry_count || 0) + 1;
    await dream.save();

    // Add image generation job
    await addImageJob(dream._id, dream.image_prompt, req.userId);

    res.json({ message: "Image generation retry initiated." });
  } catch (err) {
    console.error("Image retry failed:", err);
    res.status(500).json({ error: "Image retry failed" });
  }
};

// Get All Dreams Controller
const getAllDreams = async (req, res) => {
  try {
    // Ensure userId is available
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const search = req.query.search?.trim() || "";
    const sortOption = req.query.sort || "newest";
    const likedOnly = req.query.likedOnly === "true";
    const mood = req.query.mood ? req.query.mood.split(",") : [];
    const dream_personality_type = req.query.dream_personality_type
      ? req.query.dream_personality_type.split(",")
      : [];
    const status = req.query.status ? req.query.status.split(",") : [];
    const from = req.query.from || "";
    const to = req.query.to || "";

    const filter = {
      user_id: req.userId,
    };

    if (likedOnly) {
      filter.isLiked = true;
    }

    if (mood.length > 0) {
      filter.mood = { $in: mood };
    }

    if (status.length > 0) {
      filter.analysis_status = { $in: status };
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    if (search) {
      // Enhanced search - look in both title and description
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // case-insensitive search on title
        { description: { $regex: search, $options: "i" } }, // also search in description
      ];
    }

    const processedFilter = {};
    if (dream_personality_type.length > 0) {
      processedFilter["dream_personality_type.type"] = {
        $in: dream_personality_type,
      };
    }

    let matchingDreamIds = null;
    if (Object.keys(processedFilter).length > 0) {
      const matchedProcessed = await ProcessedDream.find(processedFilter)
        .select("dream_id")
        .lean();
      matchingDreamIds = matchedProcessed.map((d) => d.dream_id.toString());

      // If no matching dreams from processed side, early return
      if (matchingDreamIds.length === 0) {
        return res.json({
          dreams: [],
          totalPages: 0,
          currentPage: 1,
          totalItems: 0,
        });
      }

      // Add to raw filter
      filter._id = { $in: matchingDreamIds };
    }

    let sort = { createdAt: -1 };
    switch (sortOption) {
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "liked":
        sort = { isLiked: -1, createdAt: -1 };
        break;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch paginated raw dreams for the user
    const rawDreamsResult = await RawDream.paginate(filter, {
      page,
      limit,
      sort,
      select: "-__v -createdAt -updatedAt",
      lean: true,
    });

    // If no dreams found, return an empty response
    if (!rawDreamsResult.docs.length) {
      return res.json({
        dreams: [],
        totalPages: rawDreamsResult.totalPages,
        currentPage: rawDreamsResult.page,
        message: "No dreams found for this user",
      });
    }

    // Extract raw dream IDs
    const rawDreamIds = rawDreamsResult.docs.map((doc) => doc._id);

    // Find corresponding processed dreams
    const processedDreams = await ProcessedDream.find({
      dream_id: { $in: rawDreamIds },
    })
      .select("-__v -createdAt -updatedAt")
      .lean();

    // Create a map for quick lookup
    const processedMap = processedDreams.reduce((acc, curr) => {
      acc[curr.dream_id.toString()] = curr;
      return acc;
    }, {});

    // Merge raw dreams with their processed data
    const mergedDreams = rawDreamsResult.docs.map((rawDream) => {
      const processed = processedMap[rawDream._id.toString()] || null;

      return {
        ...rawDream,
        analysis: processed ? processed : null,
      };
    });

    res.json({
      dreams: mergedDreams,
      totalPages: rawDreamsResult.totalPages,
      currentPage: rawDreamsResult.page,
      totalItems: rawDreamsResult.totalDocs,
    });
  } catch (error) {
    console.error("Error fetching dreams:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch dreams. Please try again later." });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // dream id
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const dream = await RawDream.findById(id);
    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }
    const newLikeStatus = !dream.isLiked;
    dream.isLiked = newLikeStatus;
    await dream.save();
    res.json({ success: true, isLiked: newLikeStatus });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to update like status" });
  }
};

const dreamScope = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const rawDreamData = await RawDream.find(
      { user_id: req.userId },
      "mood _id date"
    );

    // Extract Dream dates to calculate streak
    const dreamDates = rawDreamData.map((dream) => dream.date);

    const { streak: currentStreak, hasLoggedToday } =
      getCurrentStreak(dreamDates);
    // Extract dream IDs
    const dreamIds = rawDreamData.map((dream) => dream._id);

    // Extract mood list
    const moodList = rawDreamData.map((dream) => dream.mood);

    // Fetch corresponding sentiments from ProcessedDream
    const processedDreamData = await ProcessedDream.find(
      { dream_id: { $in: dreamIds } },
      "sentiment"
    );

    const sentiments = processedDreamData.map((dream) => dream.sentiment);

    return res
      .status(200)
      .json({ moodList, sentiments, currentStreak, hasLoggedToday });
  } catch (er) {
    console.error(er.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: er.message });
  }
};

const getDashboardInsights = async (req, res) => {
  try {
    const userId = req.userId;

    // Step 1: Fetch raw and processed dreams
    const rawDreams = await RawDream.find({ user_id: userId });
    const processedDreams = await ProcessedDream.find({
      dream_id: { $in: rawDreams.map((d) => d._id) },
    });

    if (!rawDreams.length) {
      return res.json({
        totalDreams: 0,
        averageMood: "Neutral",
        topSymbol: null,
        commonTheme: null,
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
        moodHistory: [],
        calendarData: [],
      });
    }

    // Step 2: Total dreams
    const totalDreams = rawDreams.length;

    // Step 3: Average Mood
    const moodValues = rawDreams
      .map((d) => moodToIndex[d.mood])
      .filter((v) => v !== undefined);
    const averageMoodIndex = Math.round(
      moodValues.reduce((a, b) => a + b, 0) / moodValues.length
    );
    const averageMood = indexToMood[averageMoodIndex];

    // Step 4: Top Symbol
    const symbolCount = {};
    rawDreams.forEach((d) => {
      d.symbols?.forEach((s) => {
        symbolCount[s] = (symbolCount[s] || 0) + 1;
      });
    });
    const topSymbol =
      Object.entries(symbolCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Step 5: Common Theme
    const themeCount = {};
    rawDreams.forEach((d) => {
      d.themes?.forEach((t) => {
        themeCount[t] = (themeCount[t] || 0) + 1;
      });
    });
    const commonTheme =
      Object.entries(themeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Step 6: Sentiment Breakdown
    const totalSentiment = { positive: 0, neutral: 0, negative: 0 };
    processedDreams.forEach((d) => {
      totalSentiment.positive += d.sentiment?.positive || 0;
      totalSentiment.neutral += d.sentiment?.neutral || 0;
      totalSentiment.negative += d.sentiment?.negative || 0;
    });
    const total = Object.values(totalSentiment).reduce((a, b) => a + b, 0);
    const sentimentBreakdown = {
      positive: Math.round((totalSentiment.positive / total) * 100),
      neutral: Math.round((totalSentiment.neutral / total) * 100),
      negative: Math.round((totalSentiment.negative / total) * 100),
    };

    // Step 7: Mood History
    const moodHistory = rawDreams.map((d) => ({
      date: d.date.toISOString().split("T")[0],
      mood: d.mood,
      intensity: d.intensity,
    }));

    // Step 8: Calendar Data
    const moodCalendar = {};
    rawDreams.forEach((d) => {
      const key = d.date.toISOString().split("T")[0];
      if (!moodCalendar[key]) {
        moodCalendar[key] = {
          date: key,
          count: 1,
          mood: moodToEmoji[d.mood] || "❓",
        };
      } else {
        moodCalendar[key].count++;
      }
    });
    const calendarData = Object.values(moodCalendar);

    // Step 9: Dreams in the current month
    const now = new Date();
    const currentMonth = now.getMonth(); // 0 = Jan
    const currentYear = now.getFullYear();

    const dreamsThisMonth = rawDreams.filter((d) => {
      const date = new Date(d.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const totalDreamsThisMonth = dreamsThisMonth.length;

    // Final response
    return res.json({
      totalDreams,
      averageMood,
      totalDreamsThisMonth,
      topSymbol,
      commonTheme,
      sentimentBreakdown,
      moodHistory,
      calendarData,
    });
  } catch (err) {
    console.error("Dashboard insights error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const dashboardExplore = async (req, res) => {
  try {
    const userId = req.userId;

    // Step 1: Fetch recent raw dreams
    const recentRawDreams = await RawDream.find({ user_id: userId })
      .sort({ date: -1 })
      .limit(5)
      .select("_id title date mood analysis_status");

    const recentDreamIds = recentRawDreams.map((d) => d._id);

    // Step 2: Fetch corresponding processed dreams
    const processedRecentDreams = await ProcessedDream.find({
      dream_id: { $in: recentDreamIds },
    }).select("dream_id dream_personality_type");

    // Create a lookup map for fast access
    const dptMap = {};
    processedRecentDreams.forEach((pd) => {
      dptMap[pd.dream_id] = pd.dream_personality_type;
    });

    // Step 3: Merge into final recentDreams output
    const recentDreams = recentRawDreams.map((rd) => ({
      _id: rd._id,
      title: rd.title,
      date: rd.date,
      mood: rd.mood,
      analysis_status: rd.analysis_status,
      dream_personality_type: dptMap[rd._id] || null,
    }));

    // Fetch all dreams for stats
    const allRawDreams = await RawDream.find({ user_id: userId }).select("_id");
    const allDreamIds = allRawDreams.map((d) => d._id);

    const allProcessedDreams = await ProcessedDream.find({
      dream_id: { $in: allDreamIds },
    }).select(" dream_personality_type");

    // Symbol Frequency
    const allRawDreamsWithSymbols = await RawDream.find({
      user_id: userId,
      symbols: { $exists: true, $ne: [] },
    }).select("symbols");

    const symbolFreq = {};
    allRawDreamsWithSymbols.forEach((dream) => {
      (dream.symbols || []).forEach((symbol) => {
        symbolFreq[symbol] = (symbolFreq[symbol] || 0) + 1;
      });
    });

    const emojiRegex = /^[\p{Emoji}]/u;

    const commonSymbols = Object.entries(symbolFreq)
      .map(([label, count]) => ({
        label,
        count,
        emoji: emojiRegex.test(label.trim())
          ? label.trim().split(" ")[0]
          : null,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // DPT Frequency
    const dptFreq = {};
    allProcessedDreams.forEach((dream) => {
      const dpt = dream.dream_personality_type?.type;
      if (dpt) dptFreq[dpt] = (dptFreq[dpt] || 0) + 1;
    });

    const [mostDPT = "", count = 0] =
      Object.entries(dptFreq).sort((a, b) => b[1] - a[1])[0] || [];

    const aiSuggestions = []; // Placeholder for future insights

    return res.json({
      recentDreams,
      commonSymbols,
      mostFrequentDPT: {
        id: mostDPT,
        count,
      },
      aiSuggestions,
    });
  } catch (er) {
    console.error("dashboardExplore error", er.message);
    return res.status(500).json({
      message: "Internal server error",
      error: er.message,
    });
  }
};

const getTeaserAnalysis = async (req, res) => {
  try {
    const { mode } = req.body;

    // -------------------- MODE VALIDATION --------------------
    if (!mode) {
      return res.status(400).json({
        message: "mode is required (dream | no_recall)",
      });
    }

    // ==================== 💤 DREAM MODE ====================
    if (mode === "dream") {
      const { dream_text } = req.body;

      if (!dream_text || dream_text.trim().length === 0) {
        return res.status(400).json({
          message: "dream_text is required for dream analysis.",
        });
      }

      const analysis = await processTeaserDreamAnalysis(dream_text);

      return res.status(200).json({ analysis });
    }

    // ==================== 🌑 NO-RECALL MODE ====================
    if (mode === "no_recall") {
      const { emotion, clarity, body_state } = req.body;

      // Minimal but strict validation
      if (!emotion || !clarity || !body_state) {
        return res.status(400).json({
          message:
            "emotion, clarity, and body_state are required for no_recall analysis.",
        });
      }

      const analysis = await processNoRecallReflectionAnalysis({
        emotion,
        clarity,
        bodyState: body_state,
      });

      return res.status(200).json({ analysis });
    }

    // -------------------- INVALID MODE --------------------
    return res.status(400).json({
      message: "Invalid mode. Allowed values: dream, no_recall",
    });
  } catch (err) {
    console.error("Teaser analysis error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getPublicDream = async (req, res) => {
  try {
    const { id } = req.params;

    res.set({
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    });

    // ❌ Invalid ObjectId → 404 HTML
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(render404HTML());
    }

    const dream = await RawDream.findById(id);
    const processedDream = await ProcessedDream.findOne({ dream_id: id });

    // ❌ Dream not found → 404 HTML
    if (!dream || !processedDream) {
      return res.status(404).send(render404HTML());
    }

    // ✅ Valid dream → render public HTML
    const fullDream = {
      ...dream.toObject(),
      analysis: processedDream.toObject(),
    };

    return res.status(200).send(renderPublicDreamHTML(fullDream));
  } catch (er) {
    console.error("Error in public dream route:", er);

    // ❌ Server error → 500 HTML (optional but recommended)
    return res.status(500).send(render404HTML?.() || "Server error");
  }
};

module.exports = {
  addRawDream,
  retryAnalysis,
  getAllDreams,
  toggleLike,
  retryImageGeneration,
  dreamScope,
  getDashboardInsights,
  dashboardExplore,
  getCurrentStreak,
  getTeaserAnalysis,
  getPublicDream,
};
