const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderLoginPageHTML() {
  const pageData = safeJSONStringify({
    pageType: "login",
    data: {
      title: "Welcome Back",
      subtitle: "Login to continue your dream journey",
    },
  });

  const bodyHTML = `
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a, #4c1d95, #312e81);
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .auth-skeleton {
      width: 100%;
      max-width: 420px;
      padding: 32px;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(16px);
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 40px 32px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
      text-align: center;
    }

    h1 {
      font-size: 2.1rem;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(90deg, #c7d2fe, #fbcfe8, #67e8f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      font-size: 0.95rem;
      color: #cbd5f5;
      margin-bottom: 28px;
    }

    .skeleton {
      position: relative;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      margin-bottom: 16px;
    }

    .skeleton::after {
      content: "";
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.35),
        transparent
      );
      animation: shimmer 1.4s infinite;
    }

    .input {
      height: 48px;
    }

    .button {
      height: 52px;
      border-radius: 18px;
      margin-top: 10px;
    }

    .divider {
      height: 1px;
      background: rgba(255,255,255,0.15);
      margin: 28px 0;
    }

    .text-small {
      height: 14px;
      width: 60%;
      margin: 0 auto;
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  </style>

  <main class="auth-skeleton">
    <div class="auth-card">
      <h1>Welcome Back</h1>
      <p>Login to continue your dream journey</p>

      <div class="skeleton input"></div>
      <div class="skeleton input"></div>
      <div class="skeleton button"></div>

      <div class="divider"></div>

      <div class="skeleton text-small"></div>
    </div>
  </main>
  `;

  return renderBaseHTML({
    title: "SomniaMind – Login",
    description:
      "Login to SomniaMind and explore the meaning behind your dreams using AI-powered interpretation.",
    canonical: `${PUBLIC_ORIGIN}/login`,
    ogTitle: "Login – SomniaMind",
    ogDescription: "Access your dream journal and AI-powered interpretations.",
    ogImage: `${PUBLIC_ORIGIN}/og-image.png`,
    ogUrl: `${PUBLIC_ORIGIN}/login`,
    bodyHTML,
    pageData,
  });
};
