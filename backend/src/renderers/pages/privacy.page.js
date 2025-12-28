const renderBaseHTML = require("../base/baseHTML");
const { safeJSONStringify } = require("../base/seoUtils");

const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || "http://localhost:8080";

module.exports = function renderPrivacyPolicyHTML() {
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
      margin-bottom: 24px;
      color: #ffffff;
      text-align: center;
    }

    .intro {
      font-size: 1.2rem;
      line-height: 1.7;
      color: #c7d2fe;
      text-align: center;
      margin-bottom: 80px;
    }

    h2 {
      font-size: 1.8rem;
      margin-top: 72px;
      margin-bottom: 16px;
      color: #f8fafc;
    }

    p {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #cbd5f5;
      margin-bottom: 18px;
    }

    ul {
      padding-left: 20px;
      margin-bottom: 24px;
    }

    li {
      margin-bottom: 10px;
      line-height: 1.7;
      color: #cbd5f5;
    }

    .footer-note {
      margin-top: 80px;
      font-size: 0.95rem;
      color: #94a3b8;
      text-align: center;
    }

    .footer-links {
  margin-top: 48px;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(203, 213, 225, 0.6); /* slate-300 / muted */
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.footer-links a {
  color: rgba(199, 210, 254, 0.75); /* indigo-200 */
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.footer-links a:hover {
  color: #ffffff;
  opacity: 0.9;
}

.footer-links span {
  opacity: 0.4;
  user-select: none;
}

  </style>

  <main class="seo-container">
    <h1>Privacy Policy</h1>

    <p class="intro">
      Your dreams are deeply personal. This policy explains how SomniaMind
      collects, uses, and protects your data — transparently and respectfully.
    </p>

    <h2>Information We Collect</h2>
    <p>
      We collect only the information necessary to provide our services. This may include:
    </p>
    <ul>
      <li>Dream content you choose to write or share</li>
      <li>Basic account information such as email address</li>
      <li>Usage data to improve performance and reliability</li>
    </ul>

    <h2>How Your Data Is Used</h2>
    <p>
      Your data is used solely to provide dream interpretation, analytics,
      and personalization features within SomniaMind.
    </p>
    <p>
      We do not sell, rent, or trade your personal data. Dreams remain private
      unless you explicitly choose to share them.
    </p>

    <h2>Analytics & Cookies</h2>
    <p>
      We may use privacy-respecting analytics tools to understand how the platform
      is used and improve user experience. These tools do not access your dream
      content.
    </p>

    <h2>Data Security</h2>
    <p>
      We implement industry-standard safeguards to protect your information.
      However, no system is completely secure, and you use the platform at your
      own discretion.
    </p>

    <h2>Your Rights</h2>
    <p>
      You may request access to, correction of, or deletion of your personal data
      at any time. You remain the owner of your dream content.
    </p>

    <div class="footer-note">
      Last updated: ${new Date().toLocaleDateString()}
    </div>

    <div class="footer-links">
  <a href="/privacy">Privacy Policy</a>
  <span>·</span>
  <a href="/terms">Terms of Use</a>
  <span>·</span>
  <a href="/disclaimer">Disclaimer</a>
</div>


  </main>
  `;

  return renderBaseHTML({
    title: "Privacy Policy – SomniaMind",
    description:
      "Learn how SomniaMind collects, uses, and protects your data. Your dreams are private, secure, and always yours.",
    canonical: `${PUBLIC_ORIGIN}/privacy`,
    ogTitle: "Privacy Policy – SomniaMind",
    ogDescription:
      "SomniaMind respects your privacy. Learn how we protect your dream data.",
    ogImage: `${PUBLIC_ORIGIN}/og-image.png`,
    ogUrl: `${PUBLIC_ORIGIN}/privacy`,
    bodyHTML,
  });
};
