const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderHowAIInterpretsDreamsHTML() {
  const pageData = safeJSONStringify({
    pageType: "howAIInterpretsDreams",
  });

  const bodyHTML = `
  <style>
    body {
      margin: 0;
      background: radial-gradient(circle at top, #1e1b4b, #020617);
      color: #e5e7eb;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .seo-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 120px 24px 160px;
    }

    h1 {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1.1;
      background: linear-gradient(90deg, #a78bfa, #ec4899, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 24px;
    }

    h2 {
      font-size: 1.75rem;
      margin-top: 64px;
      margin-bottom: 16px;
      color: #f8fafc;
    }

    p {
      font-size: 1.05rem;
      line-height: 1.8;
      color: #cbd5f5;
      margin-bottom: 16px;
    }

    .highlight {
      color: #f472b6;
      font-weight: 500;
    }

    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 32px;
      margin-top: 40px;
    }

    .cta {
      margin-top: 80px;
      text-align: center;
    }

    .cta a {
      display: inline-block;
      padding: 16px 36px;
      border-radius: 999px;
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      color: white;
      font-weight: 600;
      text-decoration: none;
    }
  </style>

  <main class="seo-container">
    <h1>How AI Interprets Dreams</h1>

    <p>
      Dreams are not random stories. They are deeply personal narratives shaped by
      memory, emotion, and subconscious processing.
    </p>

    <p>
      At <span class="highlight">SomniaMind</span>, AI does not predict your future
      or assign fixed meanings. Instead, it helps uncover patterns, emotional shifts,
      and symbolic relationships already present in your dream.
    </p>

    <div class="card">
      <h2>Symbols, Not Dictionaries</h2>
      <p>
        A house does not mean the same thing for everyone. AI considers context —
        your emotions, recurring themes, and narrative flow — rather than relying
        on generic dream dictionaries.
      </p>
    </div>

    <div class="card">
      <h2>Emotion as the Anchor</h2>
      <p>
        How you felt during the dream often matters more than what happened.
        Fear, joy, relief, or confusion shape meaning more than literal events.
      </p>
    </div>

    <div class="card">
      <h2>Reflection, Not Authority</h2>
      <p>
        AI interpretations are reflective tools, not absolute truths. They invite
        you to notice what resonates — helping you understand the present, not
        dictate answers.
      </p>
    </div>

    <div class="cta">
      <a href="/">Analyze your own dream</a>
    </div>
  </main>
  `;

  return renderBaseHTML({
    title: "How AI Interprets Dreams – SomniaMind",
    description:
      "Learn how AI interprets dreams using symbols, emotions, and patterns — without prediction or fortune-telling.",
    canonical: `${PUBLIC_ORIGIN}/how-ai-interprets-dreams`,
    ogTitle: "How AI Interprets Dreams",
    ogDescription:
      "Discover how artificial intelligence helps reflect meaning in dreams using symbols and emotional context.",
    ogImage: `${PUBLIC_ORIGIN}/og-image.png`,
    ogUrl: `${PUBLIC_ORIGIN}/how-ai-interprets-dreams`,
    bodyHTML,
    pageData,
  });
};
