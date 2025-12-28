const openai = require("../config/ai.config.js");
const ProcessedDream = require("../models/processedDream.model.js");
const RawDream = require("../models/rawDream.model.js");

const DreamPersonalityTypes = [
  {
    id: "dpt_visionary",
    short_description:
      "You see beyond reality. Your dreams often reveal abstract truths or future possibilities.",
    traits: ["creative", "introspective", "idealistic", "spiritual"],
  },
  {
    id: "dpt_wanderer",
    short_description:
      "You're on a journey — emotionally, mentally, or spiritually. Your dreams often involve movement and discovery.",
    traits: ["curious", "independent", "restless", "thoughtful"],
  },
  {
    id: "dpt_guardian",
    short_description:
      "You dream of protection and responsibility. You often take care of others in your dreams.",
    traits: ["empathetic", "protective", "loyal", "self-sacrificing"],
  },
  {
    id: "dpt_shadow_walker",
    short_description:
      "You face inner fears and buried truths. Your dreams explore the darker parts of your psyche.",
    traits: ["deep", "emotional", "brave", "complex"],
  },
  {
    id: "dpt_illusionist",
    short_description:
      "You bend reality in your dreams. Surreal landscapes, paradoxes, and shifting identities are common.",
    traits: ["mystical", "imaginative", "enigmatic", "unpredictable"],
  },
  {
    id: "dpt_healer",
    short_description:
      "Your dreams often deal with healing — emotionally or relationally. You bring peace to dream chaos.",
    traits: ["compassionate", "sensitive", "peace-seeking", "wise"],
  },
  {
    id: "dpt_seeker",
    short_description:
      "You search for meaning, signs, or answers. Your dreams are full of symbols and unanswered questions.",
    traits: ["philosophical", "spiritual", "analytical", "curious"],
  },
  {
    id: "dpt_trickster",
    short_description:
      "Your dreams challenge logic and norms. You're playful, chaotic, or unpredictable even in sleep.",
    traits: ["clever", "rebellious", "chaotic", "sharp-minded"],
  },
  {
    id: "dpt_architect",
    short_description:
      "You dream with structure. Recurring themes, patterns, or places reveal a deep inner design.",
    traits: ["analytical", "grounded", "methodical", "creative"],
  },
  {
    id: "dpt_echo",
    short_description:
      "You reflect the emotional weight of your daily life. Your dreams echo the unresolved, unspoken, or suppressed.",
    traits: ["intuitive", "sensitive", "reflective", "emotional"],
  },
];

const createAnalysisPrompt = (dream) => ({
  input: {
    title: dream.title,
    description: dream.description,
    date: dream.date,
    mood: dream.mood,
    intensity: dream.intensity,
    symbols: dream.symbols,
    themes: dream.themes,
    characters: dream.characters,
    setting: dream.setting,
    notes_to_ai: dream.notes_to_ai,
    real_life_link: dream.real_life_link,
  },

  instructions: {
    output_format: {
      short_interpretation:
        "Write 1–2 full sentences that give a warm, fun, and thoughtful summary.",

      symbol_meanings:
        "Pick out the key symbols and explain their meaning. String only.",

      emotion_journey:
        "Describe the emotional flow of the dream. Single paragraph string.",

      possible_psychological_roots:
        "Suggest emotional or real-life roots of this dream. One paragraph string.",

      mythical_archetypes:
        "Identify any archetypes (Hero, Shadow, etc.). One paragraph string.",

      what_you_might_learn:
        "Give 2-3 gentle reflective insights. 2–3 sentences.",

      dream_personality_type: {
        type: "Return only the ID from predefined types.",
        description:
          "Write a 1–2 sentence description matching the dreamer's traits.",
      },

      vibe: {
        tone: "One short phrase for the emotional tone.",
        keywords: ["Return 3–6 expressive keywords as an array of strings."],
      },

      highlight: "Describe the dream's most powerful moment in 1–2 sentences.",

      image_prompt: "Return a vivid prompt for image generation.",

      sentiment: {
        positive: "<number only>",
        negative: "<number only>",
        neutral: "<number only>",
      },

      // ⭐ NEW SHARE FIELDS ⭐
      share_title:
        "Create a short, aesthetic, poetic title (2–4 words). Avoid cliches.",

      share_one_liner:
        "Write a 1-sentence deep but simple meaning of the dream. Very short.",

      share_tags:
        "Return 3–6 short hashtag-style tags (no # needed). Lowercase. Array.",

      share_captions: {
        instagram:
          "Write a long aesthetic caption including share_title, share_one_liner, and 2–3 tags.",
        whatsapp:
          "Write a short friendly caption for WhatsApp. Include title + meaning.",
        twitter: "Write a 1–2 line punchy caption.",
        telegram: "Write a descriptive structured caption.",
        pinterest: "A dreamy aesthetic caption ideal for Pinterest.",
        generic: "Short universal caption containing title + meaning.",
      },

      share_image_theme:
        "Return a small object with 4 color values:{ primary: '<hex>', secondary: '<hex>', text: '<hex>', overlay: '<rgba>'} Choose colors inspired by the dream's vibe.",
    },

    dream_personality_type_instructions: {
      explanation: "Choose one dream personality type from the predefined set.",
      types: DreamPersonalityTypes,
    },

    vibe_instructions: "Infer tone and keywords from the dream’s energy.",

    image_prompt_instructions: "Return a vivid image prompt.",

    final_reminder:
      "RETURN JSON ONLY. Never skip any field. Always return empty strings if unsure.",
  },
});

// Utility: Check if a string is valid JSON
function isValidJson(str) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

function extractJsonSafely(str) {
  try {
    const match = str.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON block found in response");
    const json = JSON.parse(match[0]);
    return json;
  } catch {
    throw new Error("Malformed JSON in AI response");
  }
}

function validateProcessedDreamOutput(output) {
  const requiredFields = [
    "short_interpretation",
    "deep_analysis",
    "dream_personality_type",
    "vibe",
    "highlight",
    "image_prompt",
    "sentiment",
    "share_title",
    "share_one_liner",
    "share_tags",
    "share_captions",
    "share_image_theme",
  ];

  const deepAnalysisFields = [
    "symbol_meanings",
    "emotion_journey",
    "possible_psychological_roots",
    "mythical_archetypes",
    "what_you_might_learn",
  ];

  const sentimentFields = ["positive", "negative", "neutral"];

  for (const field of requiredFields) {
    if (!(field in output)) throw new Error(`Missing field: ${field}`);
  }

  for (const daField of deepAnalysisFields) {
    if (!(daField in output.deep_analysis))
      throw new Error(`Missing deep_analysis field: ${daField}`);
  }

  for (const sField of sentimentFields) {
    if (!(sField in output.sentiment))
      throw new Error(`Missing sentiment field: ${sField}`);
  }

  return true;
}

const processDreamAnalysis = async (dreamId) => {
  try {
    const rawDream = await RawDream.findById(dreamId);
    if (!rawDream) throw new Error("Dream not found");

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a precise JSON API for dream analysis. RETURN ONLY JSON.",
        },
        {
          role: "user",
          content: JSON.stringify(createAnalysisPrompt(rawDream)),
        },
      ],
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1-0528:free",
      response_format: { type: "json_object" },
    });

    let rawResponse = completion.choices[0].message.content;

    const cleanedResponse = rawResponse
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    if (!isValidJson(cleanedResponse)) {
      console.error("❌ Invalid JSON:", cleanedResponse);
      throw new Error("Invalid JSON format from AI");
    }

    const analysis = extractJsonSafely(cleanedResponse);

    // Extract deep_analysis components
    const {
      symbol_meanings,
      emotion_journey,
      possible_psychological_roots,
      mythical_archetypes,
      what_you_might_learn,
      ...rest
    } = analysis;

    const regroupedAnalysis = {
      ...rest,
      deep_analysis: {
        symbol_meanings,
        emotion_journey,
        possible_psychological_roots,
        mythical_archetypes,
        what_you_might_learn,
      },
    };

    validateProcessedDreamOutput(regroupedAnalysis);

    const saved = await ProcessedDream.create({
      dream_id: dreamId,
      title: rawDream.title,
      date: rawDream.date,
      ...regroupedAnalysis,
      analysis_version: "v1.4",
    });

    return saved.toObject();
  } catch (error) {
    console.error(
      `❌ Analysis failed for dream ${dreamId}:`,
      error.message,
      error
    );
    return {
      error: true,
      message: error.message || "Failed to analyze dream",
    };
  }
};

module.exports = processDreamAnalysis;
