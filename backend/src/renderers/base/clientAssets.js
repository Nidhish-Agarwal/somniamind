const fs = require("fs");
const path = require("path");

/**
 * Finds Vite client entry from dist/assets
 */
function getClientAssets() {
  const assetsDir = path.join(__dirname, "../../../public/dist/assets");
  const files = fs.readdirSync(assetsDir);

  const js = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  const css = files.find((f) => f.startsWith("index-") && f.endsWith(".css"));

  if (!js) {
    throw new Error("Main JS bundle not found");
  }

  return {
    js: `assets/${js}`,
    css: css ? `assets/${css}` : null,
  };
}

module.exports = {
  CLIENT_ASSETS: getClientAssets(),
};
