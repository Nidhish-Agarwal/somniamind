const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderNotFoundHTML(req) {
  // Optional: rotate message per request
  const dreamMessages = [
    "This page exists only in dreams...",
    "The path has faded like morning mist...",
    "Lost in the realm between sleep and wake...",
  ];

  const dreamMessage =
    dreamMessages[Math.floor(Math.random() * dreamMessages.length)];

  const pageData = safeJSONStringify({
    pageType: "404",
  });

  const bodyHTML = `
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #312e81, #6b21a8, #831843);
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f8fafc;
      overflow: hidden;
    }

    .center {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
    }

    .card {
      max-width: 520px;
      width: 100%;
      padding: 48px 36px;
      border-radius: 28px;
      background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.12),
        rgba(255, 255, 255, 0.04)
      );
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
      text-align: center;
      position: relative;
      z-index: 2;
    }

    h1 {
      font-size: 6rem;
      font-weight: 300;
      background: linear-gradient(90deg, #ddd6fe, #fbcfe8, #c7d2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 24px;
      position: relative;
    }

    h2 {
      font-size: 1.6rem;
      font-weight: 300;
      margin-bottom: 12px;
      color: #f8fafc;
    }

    p {
      font-size: 1.05rem;
      line-height: 1.7;
      color: #e9d5ff;
      font-style: italic;
      margin-bottom: 36px;
    }

    .actions a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 24px;
      border-radius: 18px;
      text-decoration: none;
      font-weight: 400;
      color: white;
      margin-bottom: 14px;
      background: linear-gradient(90deg, rgba(139,92,246,.85), rgba(99,102,241,.85));
      border: 1px solid rgba(255,255,255,.25);
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .actions a.secondary {
      background: linear-gradient(90deg, rgba(236,72,153,.7), rgba(139,92,246,.7));
    }

    .actions a:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 30px rgba(168,85,247,.4);
    }

    .state {
      margin-top: 28px;
      font-size: .7rem;
      letter-spacing: .25em;
      color: #e9d5ff;
      opacity: .7;
    }

    /* Floating dream particles */
    .particle {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(90deg, rgba(255,255,255,.4), rgba(216,180,254,.6));
      animation: float 8s ease-in-out infinite;
      opacity: .5;
    }

    @keyframes float {
      0%,100% { transform: translateY(0); opacity:.3 }
      50% { transform: translateY(-30px); opacity:.8 }
    }
  </style>

  <div class="center">
    ${Array.from({ length: 14 })
      .map(
        () => `
      <div class="particle" style="
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation-delay:${Math.random() * 6}s;
      "></div>`
      )
      .join("")}

    <main class="card">
      <h1>404</h1>

      <h2>Lost in the Dream Realm</h2>

      <p>${dreamMessage}</p>

      <div class="actions">
        <a href="javascript:history.back()">Return to Previous Page</a>
        <a href="/" class="secondary">Wake Up to Home</a>
      </div>

      <div class="state">
        DREAM STATE · <span style="color:#f9a8d4">PAGE_NOT_MANIFESTED</span>
      </div>
    </main>
  </div>
  `;

  return renderBaseHTML({
    title: "404 – Page Not Found | SomniaMind",
    description:
      "This page could not be found. You seem to have wandered into a dream that was never manifested.",
    canonical: `${PUBLIC_ORIGIN}${req?.originalUrl || ""}`,
    ogTitle: "Lost in the Dream Realm",
    ogDescription:
      "The page you’re looking for exists only in dreams. Return safely to reality.",
    ogImage: `${PUBLIC_ORIGIN}/og-404.png`,
    ogUrl: `${PUBLIC_ORIGIN}${req?.originalUrl || ""}`,
    bodyHTML,
    pageData,
  });
};
