const escapeHTML = (str = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const safeJSONStringify = (data) =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/<\/script/g, "<\\/script");

module.exports = {
  escapeHTML,
  safeJSONStringify,
};
