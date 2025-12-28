const openai = require("../config/ai.config.js");

/* ======================================================
   COMMON OUTPUT RULES (shared structure)
====================================================== */

const OUTPUT_RULES = `
⚠️ OUTPUT FORMAT (MANDATORY):
You MUST return a valid JSON object with EXACTLY the following keys:

{
  "opening_validation": string,        // 1 sentence
  "gentle_observation": string,        // 2–3 sentences
  "personal_anchoring": string,        // 1–2 sentences
  "reflective_question": string,       // 1 sentence, phrased as a question
  "boundary_statement": string         // 1 sentence
}

Do NOT include any extra keys.
Do NOT include markdown.
Do NOT include explanations.
Do NOT include text outside the JSON object.

Keep the total combined length under 140 words.
`;

/* ======================================================
   💤 DREAM-BASED SYSTEM PROMPT
====================================================== */

const dreamSystemPrompt = `
You are SomniaMind, an AI that provides reflective, surface-level dream insights.

Your task is to generate an INITIAL DREAM REFLECTION, not a full interpretation.

Rules you MUST follow:
- Do NOT give definitive meanings.
- Do NOT diagnose, label, or make absolute claims.
- Do NOT mention psychology theories or scientific terms.
- Do NOT give advice or solutions.
- Do NOT mention dream personality types, long-term patterns, or deep symbol breakdowns.

Tone guidelines:
- Calm, thoughtful, and introspective.
- Use soft language such as "may", "often", "can reflect", "suggests".
- Sound like a mirror, not an authority.
- Validate the dream without exaggeration.

${OUTPUT_RULES}
`;

/* ======================================================
   🌑 NO-RECALL SYSTEM PROMPT
====================================================== */

const noRecallSystemPrompt = `
You are SomniaMind, an AI that provides reflective insights when no dream is remembered.

The user does NOT remember any dream content.
You must generate a reflection based ONLY on:
- Emotional state upon waking
- Mental clarity or fog
- Physical body state

Rules you MUST follow:
- Do NOT invent dream imagery, symbols, or events.
- Do NOT imply that a hidden dream definitely occurred.
- Do NOT give definitive meanings or diagnoses.
- Do NOT offer advice or action steps.
- Do NOT mention psychology theories or scientific concepts.

Tone guidelines:
- Gentle, validating, and grounded.
- Use language like "can reflect", "may suggest", "sometimes indicates".
- Treat the waking state as a signal, not a conclusion.
- Emphasize uncertainty and personal interpretation.

${OUTPUT_RULES}
`;

/* ======================================================
   💤 DREAM ANALYSIS FUNCTION
====================================================== */

const processTeaserDreamAnalysis = async (dream_text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1-0528:free",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: dreamSystemPrompt },
        {
          role: "user",
          content: `Here is a dream described by the user:

"${dream_text}"

Generate an initial reflective insight following the rules and structure exactly.`,
        },
      ],
    });

    return parseModelJSON(completion);
  } catch (error) {
    console.error("❌ Dream teaser analysis failed:", error);
    return fallbackError(error);
  }
};

/* ======================================================
   🌑 NO-RECALL REFLECTION FUNCTION
====================================================== */

const processNoRecallReflectionAnalysis = async ({
  emotion,
  clarity,
  bodyState,
}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1-0528:free",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: noRecallSystemPrompt },
        {
          role: "user",
          content: `The user woke up with the following state:

Emotional state: ${emotion}
Mental clarity: ${clarity}
Body state: ${bodyState}

Generate a reflective insight based ONLY on this waking state, following the structure and rules exactly.`,
        },
      ],
    });

    return parseModelJSON(completion);
  } catch (error) {
    console.error("❌ No-recall reflection analysis failed:", error);
    return fallbackError(error);
  }
};

/* ======================================================
   🔧 HELPERS
====================================================== */

const parseModelJSON = (completion) => {
  const raw = completion.choices[0].message.content;

  const cleaned = raw
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
};

const fallbackError = (error) => ({
  error: true,
  message: error.message || "Analysis failed",
});

/* ======================================================
   EXPORTS
====================================================== */

module.exports = {
  processTeaserDreamAnalysis,
  processNoRecallReflectionAnalysis,
};
