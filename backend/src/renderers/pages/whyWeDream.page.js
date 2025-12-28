const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderWhyWeDreamHTML() {
  const pageData = safeJSONStringify({
    pageType: "whyWeDream",
  });

  const bodyHTML = `
  <style>
    body {
      margin: 0;
      background: linear-gradient(to bottom, #020617, #1e1b4b, #020617);
      color: #e5e7eb;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .seo-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 120px 24px 160px;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 300;
      text-align: center;
      margin-bottom: 32px;
      color: #f8fafc;
    }

    .hero-sub {
      text-align: center;
      font-size: 1.4rem;
      line-height: 1.6;
      color: #c7d2fe;
      margin-bottom: 96px;
    }

    h2 {
      font-size: 2rem;
      font-weight: 400;
      margin-top: 80px;
      margin-bottom: 20px;
      color: #f8fafc;
    }

    p {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #cbd5f5;
      margin-bottom: 18px;
    }

    .highlight {
      color: #f472b6;
      font-weight: 500;
    }

    .quote {
      margin: 64px 0;
      padding: 32px 36px;
      border-left: 4px solid #8b5cf6;
      background: rgba(255, 255, 255, 0.04);
      font-size: 1.3rem;
      font-style: italic;
      color: #e0e7ff;
    }

    .card {
      margin-top: 32px;
      padding: 28px 32px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .timeline {
      margin-top: 40px;
    }

    .timeline-item {
      margin-bottom: 28px;
    }

    .timeline-item strong {
      color: #f8fafc;
    }

    .cta {
      margin-top: 120px;
      text-align: center;
    }

    .cta a {
      display: inline-block;
      padding: 16px 40px;
      border-radius: 999px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      color: white;
      font-weight: 500;
      text-decoration: none;
    }
  </style>

  <main class="seo-container">
    <h1>Why We Dream</h1>

    <p class="hero-sub">
      Every night, the mind creates stories without intention or control. <br />
      Science offers clues. Culture offers meaning. <br />
      The mystery remains.
    </p>

    <h2>What happens when we sleep</h2>

    <p>
      During REM sleep, the brain becomes highly active while the body remains still.
      Memory, emotion, and imagination begin to interact in unusual ways.
    </p>

    <p>
      Experiences from waking life are fragmented and reassembled — not logically,
      but emotionally. Yesterday’s stress may become tonight’s symbol.
    </p>

    <div class="quote">
      Dreams don’t follow logic. They follow feeling.
    </div>

    <p>
      Neuroscientists believe this process helps the brain integrate memory, regulate
      emotion, and explore connections that are difficult to access while awake.
    </p>

    <h2>Dreams across cultures</h2>

    <div class="timeline">
      <div class="timeline-item">
        <strong>Ancient Egypt:</strong>
        Dreams were believed to be messages from the gods, carefully recorded and interpreted.
      </div>

      <div class="timeline-item">
        <strong>Indigenous Australia:</strong>
        Dreamtime connected the living world to ancestral creation and spiritual law.
      </div>

      <div class="timeline-item">
        <strong>Ancient Greece:</strong>
        Dreams were divine encounters, often sought deliberately for healing.
      </div>

      <div class="timeline-item">
        <strong>Medieval Islam:</strong>
        Dreams were categorized as true, false, or self-generated, each carrying different meaning.
      </div>
    </div>

    <h2>What dreams do for us today</h2>

    <div class="card">
      <p>
        Modern psychology suggests dreams play a role in emotional processing,
        memory consolidation, creative problem-solving, and mental rehearsal.
      </p>

      <p>
        Some dreams help us process grief. Others rehearse fears. Some simply reflect
        unresolved thoughts without a clear purpose.
      </p>
    </div>

    <p>
      Yet even with modern tools, there is no single answer to why we dream.
      The experience remains deeply personal — shaped by memory, culture, and emotion.
    </p>

    <div class="cta">
      <a href="/">Explore your dreams</a>
    </div>
  </main>
  `;

  return renderBaseHTML({
    title: "Why We Dream – SomniaMind",
    description:
      "Explore why humans dream through science, psychology, and cultural perspectives. Discover what dreams may reveal about emotion and memory.",
    canonical: `${PUBLIC_ORIGIN}/why-we-dream`,
    ogTitle: "Why We Dream",
    ogDescription:
      "From neuroscience to ancient cultures, discover the many perspectives on why humans dream.",
    ogImage: `${PUBLIC_ORIGIN}/og-image.png`,
    ogUrl: `${PUBLIC_ORIGIN}/why-we-dream`,
    bodyHTML,
    pageData,
  });
};
