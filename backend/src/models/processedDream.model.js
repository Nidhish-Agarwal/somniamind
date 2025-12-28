const mongoose = require("mongoose");

const processedDreamSchema = new mongoose.Schema(
  {
    dream_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawDream",
      required: true,
    },

    title: { type: String, required: true },
    date: { type: Date, required: true },

    short_interpretation: {
      type: String,
      required: true,
      trim: true,
    },

    deep_analysis: {
      symbol_meanings: { type: String, default: "" },
      emotion_journey: { type: String, default: "" },
      possible_psychological_roots: { type: String, default: "" },
      mythical_archetypes: { type: String, default: "" },
      what_you_might_learn: { type: String, default: "" },
    },

    dream_personality_type: {
      type: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
    },

    vibe: {
      tone: {
        type: String,
        required: true,
        trim: true,
      },
      keywords: {
        type: [String],
        default: [],
      },
    },

    highlight: {
      type: String,
      required: true,
    },

    image_prompt: {
      type: String,
      trim: true,
      default: "",
    },

    sentiment: {
      positive: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      negative: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
      neutral: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },
    },

    analysis_version: {
      type: String,
      required: true,
      trim: true,
    },

    // ---------------------------
    // ⭐ NEW SHARE FIELDS ⭐
    // ---------------------------

    share_title: {
      type: String,
      required: true,
      trim: true,
    },

    share_one_liner: {
      type: String,
      required: true,
      trim: true,
    },

    share_tags: {
      type: [String],
      default: [],
    },

    share_captions: {
      instagram: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      twitter: { type: String, default: "" },
      telegram: { type: String, default: "" },
      pinterest: { type: String, default: "" },
      generic: { type: String, default: "" },
    },

    share_image_theme: {
      primary: { type: String, default: "#000000" },
      secondary: { type: String, default: "#000000" },
      text: { type: String, default: "#FFFFFF" },
      overlay: { type: String, default: "rgba(0,0,0,0.4)" },
    },

    share_image_url: { type: String, default: "" },

    // ---------------------------
    // Image generation related
    // ---------------------------

    image_status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    image_url: { type: String },
    image_retry_count: { type: Number, default: 0, max: 3 },
    image_generation_attempts: [
      {
        status: String,
        error: String,
        timestamp: Date,
      },
    ],
    image_is_retrying: {
      type: Boolean,
      default: false,
    },

    processed_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster lookups
processedDreamSchema.index({ dream_id: 1 });

const ProcessedDream = mongoose.model("ProcessedDream", processedDreamSchema);
module.exports = ProcessedDream;
