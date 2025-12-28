const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderLandingPageHTML() {
  const pageData = safeJSONStringify({
    pageType: "landing",
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
      max-width: 1000px;
      margin: 0 auto;
      padding: 120px 24px 160px;
      text-align: center;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 24px;
      color: #ffffff;
    }

    .hero-sub {
      font-size: 1.4rem;
      line-height: 1.6;
      color: #c7d2fe;
      max-width: 720px;
      margin: 0 auto 96px;
    }

   

    h2 {
      font-size: 2.1rem;
      font-weight: 600;
      margin-top: 96px;
      margin-bottom: 20px;
      color: #f8fafc;
    }

    p {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #cbd5f5;
      max-width: 820px;
      margin: 0 auto 18px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      margin-top: 48px;
    }

    .feature {
      padding: 28px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      text-align: left;
    }

    .feature h3 {
      font-size: 1.2rem;
      margin-bottom: 8px;
      color: #f8fafc;
    }

    .cta {
      margin-top: 120px;
    }

    .cta a {
      display: inline-block;
      padding: 16px 40px;
      border-radius: 999px;
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      color: white;
      font-weight: 600;
      text-decoration: none;
    }
  </style>

  <main class="seo-container">
    <h1>Decode Your Dreams, Discover Yourself</h1>

    <p class="hero-sub">
      SomniaMind is an AI-powered dream journaling and interpretation platform.
      It helps you explore symbolism, emotions, and recurring patterns hidden
      within your subconscious.
    </p>

    <h2>What SomniaMind Does</h2>

    <p>
      Dreams are deeply personal narratives shaped by memory, emotion, and
      lived experience. SomniaMind uses artificial intelligence to reflect
      these narratives back to you — not as predictions, but as insights.
    </p>

    <p>
      By combining natural language understanding, symbolic analysis, and
      emotional pattern recognition, SomniaMind helps you make sense of
      recurring dreams, intense emotions, and unexplained imagery.
    </p>

    <div class="feature-grid">
      <div class="feature">
        <h3>AI Dream Interpretation</h3>
        <p>
          Receive thoughtful, human-centered interpretations based on symbols,
          emotional flow, and narrative context.
        </p>
      </div>

      <div class="feature">
        <h3>Emotional & Symbolic Analytics</h3>
        <p>
          Visualize recurring emotions, symbols, and themes across your dream
          history to uncover long-term patterns.
        </p>
      </div>

      <div class="feature">
        <h3>AI-Generated Dream Art</h3>
        <p>
          Transform dream imagery into visual art, giving form to your inner
          worlds and subconscious symbols.
        </p>
      </div>

      <div class="feature">
        <h3>Private Dream Journaling</h3>
        <p>
          Log dreams freely in a private, secure journal designed for reflection
          and self-discovery.
        </p>
      </div>
    </div>

    <h2>Built for Reflection, Not Prediction</h2>

    <p>
      SomniaMind does not claim to forecast the future or provide medical advice.
      Interpretations are reflective tools meant to help you notice patterns,
      emotional shifts, and meanings that resonate with your own life.
    </p>

    <p>
      You remain the final interpreter of your dreams. AI simply helps illuminate
      what your subconscious may already be expressing.
    </p>

    <div class="cta">
      <a href="/">Start exploring your dreams</a>
    </div>
  </main>
  `;

  return renderBaseHTML({
    title: "SomniaMind – AI Dream Interpretation & Journaling",
    description:
      "SomniaMind is an AI-powered dream interpretation and journaling platform. Explore dream symbolism, emotions, and patterns through thoughtful analysis and visual insights.",
    canonical: `${PUBLIC_ORIGIN}/`,
    ogTitle: "SomniaMind – Decode Your Dreams",
    ogDescription:
      "Explore your subconscious with AI-powered dream interpretations, emotional insights, and dream visualization.",
    ogImage: `${PUBLIC_ORIGIN}/og-image.png`,
    ogUrl: `${PUBLIC_ORIGIN}/`,
    bodyHTML,
    pageData,
  });
};
