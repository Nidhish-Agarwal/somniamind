const { CLIENT_ASSETS } = require("./clientAssets");

function renderBaseHTML({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  bodyHTML,
  pageData = null,
  noIndex = false,
}) {
  const pageDataScript = pageData
    ? `<script>
      window.__PAGE_DATA__ = ${pageData};
    </script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  ${noIndex ? `<meta name="robots" content="noindex, nofollow" />` : ""}

  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />

  <link rel="icon" href="/Logo.png" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDescription}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${ogUrl}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDescription}" />
  <meta name="twitter:image" content="${ogImage}" />

  ${
    CLIENT_ASSETS.css
      ? `<link rel="stylesheet" href="/${CLIENT_ASSETS.css}" />`
      : ""
  }

  ${pageDataScript}
</head>

<body>
  <div id="root">${bodyHTML}</div>
  <script type="module" src="/${CLIENT_ASSETS.js}"></script>
</body>
</html>`;
}

module.exports = renderBaseHTML;
