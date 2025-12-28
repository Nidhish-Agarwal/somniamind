const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderPublicDreamHTML(dream) {
  const pageData = safeJSONStringify({
    pageType: "dream",
    data: {
      color: "from-indigo-50 via-purple-50 to-pink-50",
      image: dream?.analysis?.image_url,
      title: dream.title,
      interpretation: dream.analysis?.short_interpretation,
      powerfulMoment: dream.analysis?.highlight,
      vibes: dream.analysis?.vibe?.keywords || [],
    },
  });

  const bodyHTML = `
  <style>
    body {
      margin: 0;
      background: linear-gradient(135deg, #eef2ff, #f5f3ff, #fdf2f8);
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      color: #334155;
    }

    .dream-shell {
      max-width: 420px;
      margin: 0 auto;
      padding: 48px 16px 96px;
    }

    .image-placeholder {
      width: 100%;
      aspect-ratio: 4 / 5;
      border-radius: 24px;
      background: linear-gradient(135deg, #e9d5ff, #ddd6fe);
      margin-bottom: 24px;
    }

    h1 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 12px;
      font-weight: 600;
    }

    p {
      text-align: center;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 16px;
    }

    blockquote {
      font-style: italic;
      background: rgba(255, 255, 255, 0.7);
      padding: 16px;
      border-radius: 16px;
      margin: 24px 0;
    }

    .vibes {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .vibe {
      background: rgba(255,255,255,0.8);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.85rem;
    }
  </style>

  <main class="dream-shell">
    <img src="${dream.analysis?.image_url}" alt="${
    dream.analysis?.share_one_liner
  }" class="image-placeholder" />

    <h1>${dream.title}</h1>

    <p>${dream.analysis?.short_interpretation}</p>

    <blockquote>${dream.analysis?.highlight}</blockquote>

    <div class="vibes">
      ${(dream.analysis?.vibe?.keywords || [])
        .map((k) => `<span class="vibe">${k}</span>`)
        .join("")}
    </div>

    <p style="margin-top:32px; font-size:12px; color:#94a3b8;">
      This dream was interpreted using AI on SomniaMind
    </p>
  </main>
  `;

  return renderBaseHTML({
    title: `${dream.title} – Dream Interpretation`,
    description: dream.analysis?.short_interpretation || "Dream Analysis",
    canonical: `${PUBLIC_ORIGIN}/dream/public/${dream._id}`,
    ogTitle: dream.title,
    ogDescription: dream.analysis?.short_interpretation || "Dream Analysis",
    ogImage: dream.analysis?.image_url || `${PUBLIC_ORIGIN}/og-image.png`,
    ogUrl: `${PUBLIC_ORIGIN}/dream/public/${dream._id}`,
    bodyHTML,
    pageData,
  });
};
