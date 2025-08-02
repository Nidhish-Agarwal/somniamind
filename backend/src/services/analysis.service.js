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
        "Write 1–2 full sentences that give a warm, fun, and thoughtful summary of the dream. Help the user feel seen. Do NOT make this a title or short phrase — it must be a sentence or two.",

      symbol_meanings:
        "Pick out the key symbols from the dream and explain their possible meanings in a friendly and thoughtful way. Keep it relevant to the dream’s mood and story. Return this as a string — not an object.",

      emotion_journey:
        "Describe how the dreamer likely felt as the dream progressed. Highlight emotional highs, lows, and turning points. This must be a single paragraph (string), written gently and insightfully.",

      possible_psychological_roots:
        "Suggest what emotions, real-life challenges, or internal struggles might have inspired the dream. Write in a supportive tone — never judgmental. Return as a single paragraph string.",

      mythical_archetypes:
        "Write a **single-paragraph string** that describes any common archetypes (e.g., Hero, Shadow, Trickster) that show up in the dream, and explain what they might mean for the dreamer’s inner world. Do not return an object — this must be one paragraph as a string.",

      what_you_might_learn:
        "Offer a few kind insights or reflections on what the dream may be trying to reveal or teach. Write 2–3 sentences in an open-ended and encouraging tone — like a gentle invitation to reflect.",

      dream_personality_type: {
        type: "Choose one exact type from the predefined Dream Personality Types list and return it's ID.",
        description:
          "Explain this personality type in a short 1–2 sentence paragraph that matches the traits shown in this dream.",
      },

      vibe: {
        tone: "Return one short phrase that describes the dream’s overall emotional feel — like 'mysterious and dreamlike' or 'tense and chaotic'. Return as a string.",
        keywords: [
          "Return 3–6 vivid, lowercase words that capture the dream’s emotional energy and setting. Use an array of strings.",
        ],
      },

      highlight:
        "Describe the most emotionally or visually powerful moment of the dream in 1–2 rich sentences. Return this as a string.",

      image_prompt:
        "Write a vivid and detailed DALL·E-style image prompt that visually recreates the dream's setting, mood, characters, and symbols. Include color, lighting, mood, and symbolic elements. Return as a string.",

      sentiment: {
        positive:
          "<number — percentage of how much of the dream feels positive. Return a number only — no % sign.>",
        negative:
          "<number — how much of the dream feels heavy, stressful, or negative. Return a number only — no % sign.>",
        neutral:
          "<number — how much of the dream is emotionally unclear or neutral. Return a number only — no % sign.>",
      },
    },

    dream_personality_type_instructions: {
      explanation:
        "Choose one dream personality type from the official predefined set that best fits the dream. Do not make one up. Match based on patterns in the dream.",
      types: DreamPersonalityTypes,
    },

    vibe_instructions:
      "Infer the tone and keywords from the dream’s language, emotional energy, and setting.",

    image_prompt_instructions:
      "Return a vivid and creative image prompt — like you’re helping a concept artist visually recreate the dream. Be descriptive and expressive with setting, lighting, colors, characters, and symbolism.",

    final_reminder:
      "ALWAYS return every field listed in output_format, even if it's empty. Use empty string '' or {} where needed. NEVER rename or skip any fields. STRICTLY follow the types: if a field should return a string, return a string — not an object or array.",
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
    const match = str.match(/\{[\s\S]*\}/); // crude but effective
    if (!match) throw new Error("No JSON block found in response");

    const json = JSON.parse(match[0]);
    return json;
  } catch (err) {
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
    if (!(daField in output.deep_analysis)) {
      throw new Error(`Missing deep_analysis field: ${daField}`);
    }
  }

  for (const sField of sentimentFields) {
    if (!(sField in output.sentiment)) {
      throw new Error(`Missing sentiment field: ${sField}`);
    }
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
            "You are a highly perceptive dream analyst. Analyze the dream using psychological, symbolic, and emotional insight. You are a precise JSON API. Only return valid JSON. Do not include markdown, explanations, or extra words. Begin and end your output with a JSON object only. The user input contains a JSON object with structured fields. You must return a matching JSON response per the format.",
        },
        {
          role: "user",
          content: JSON.stringify(createAnalysisPrompt(rawDream)),
        },
      ],
      model: "deepseek/deepseek-r1:free",
      response_format: { type: "json_object" }, // Enforce JSON in capable models
    });

    let rawResponse = completion.choices[0].message.content;

    const cleanedResponse = rawResponse
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    if (!isValidJson(cleanedResponse)) {
      console.error("❌ Deepseek returned invalid JSON:", cleanedResponse);
      throw new Error("Invalid JSON format in AI response");
    }

    const analysis = extractJsonSafely(cleanedResponse);

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

    // Optional sanity check for required keys
    if (!validateProcessedDreamOutput(regroupedAnalysis)) {
      throw new Error("Parsed response missing required keys");
    }

    // Store processed result
    const saved = await ProcessedDream.create({
      dream_id: dreamId,
      title: rawDream.title,
      date: rawDream.date,
      ...regroupedAnalysis,
      analysis_version: "v1.3",
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
