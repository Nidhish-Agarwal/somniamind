const { Cloudinary, Transformation } = require("@cloudinary/url-gen");
const { source } = require("@cloudinary/url-gen/actions/overlay");
const { text, color, image } = require("@cloudinary/url-gen/qualifiers/source");
const { TextStyle } = require("@cloudinary/url-gen/qualifiers/textStyle");
const { Position } = require("@cloudinary/url-gen/qualifiers/position");
const { compass } = require("@cloudinary/url-gen/qualifiers/gravity");
const { fill } = require("@cloudinary/url-gen/actions/resize");
const { shadow, blur } = require("@cloudinary/url-gen/actions/effect");
const {
  opacity,
  brightness,
  contrast,
} = require("@cloudinary/url-gen/actions/adjust");
const { byRadius } = require("@cloudinary/url-gen/actions/roundCorners");

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "dcrttccmd",
  },
});

function wrapText(text, maxLength) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxLength) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.join("%0A"); // URL-encoded newline for Cloudinary
}

const generateShareImageUrl = ({
  publicId,
  share_title,
  share_one_liner,
  theme,
}) => {
  /* ---------------------------
       3️⃣ Wrapping & line counts
    ---------------------------- */
  const TITLE_LINE_LIMIT = 28;
  const SUBTITLE_LINE_LIMIT = 42;

  const wrappedTitle = wrapText(share_title, TITLE_LINE_LIMIT);
  const wrappedSubtitle = wrapText(share_one_liner, SUBTITLE_LINE_LIMIT);

  const titleLines = wrappedTitle.split("%0A").length;
  const subtitleLines = wrappedSubtitle.split("%0A").length;

  /* ---------------------------
       2️⃣ Typography system
    ---------------------------- */
  const titleDensity = share_title.length / titleLines;

  let titleFontSize = 50;
  if (titleDensity > 18) titleFontSize = 46;
  if (titleDensity > 22) titleFontSize = 42;
  if (titleDensity > 26) titleFontSize = 38;

  const subtitleFontSize = 26;

  /* ---------------------------
       4️⃣ Card width calculation
    ---------------------------- */
  const MIN_CARD_WIDTH = 420;
  const MAX_CARD_WIDTH = 560;
  const CARD_PADDING = 30;

  const estimatedWidth = Math.min(
    MAX_CARD_WIDTH,
    Math.max(MIN_CARD_WIDTH, TITLE_LINE_LIMIT * 14)
  );

  const cardWidth = estimatedWidth;
  const textWidth = cardWidth - CARD_PADDING * 2;

  /* ---------------------------
       5️⃣ Card height calculation (D1)
    ---------------------------- */
  const TITLE_LINE_HEIGHT = 1.2;
  const SUBTITLE_LINE_HEIGHT = 1.35;
  const BLOCK_SPACING = 18;
  const BRAND_HEIGHT = 22;

  const titleBlockHeight = titleLines * titleFontSize * TITLE_LINE_HEIGHT;

  const subtitleBlockHeight =
    subtitleLines * subtitleFontSize * SUBTITLE_LINE_HEIGHT;

  const cardHeight = Math.round(
    CARD_PADDING * 2 +
      titleBlockHeight +
      BLOCK_SPACING +
      subtitleBlockHeight +
      BLOCK_SPACING +
      BRAND_HEIGHT
  );

  /* ---------------------------
   6️⃣ Positioning (A1 – FIXED ORDER + BASELINE)
---------------------------- */

  const CARD_OFFSET_X = 60;
  const CARD_OFFSET_Y = 60;

  const TITLE_GAP = 16;

  // Title (top-anchored)
  const titleBaselineY = Math.floor(
    CARD_OFFSET_Y + CARD_PADDING + titleFontSize * 0.25
  );

  // Subtitle (flow)
  const subtitleBaselineY = Math.floor(
    titleBaselineY + TITLE_GAP + subtitleFontSize * 1.4
  );

  // Brand (bottom-anchored)
  const brandBaselineY = Math.floor(CARD_OFFSET_Y + cardHeight - CARD_PADDING);

  /* ---------------------------
     7️⃣ Base image
  ---------------------------- */
  let img = cloudinary
    .image(publicId)
    .resize(fill().width(1200).height(630))
    .quality("auto")
    .format("auto")
    .effect(brightness(-5))
    .effect(contrast(5));

  /* ---------------------------
     8️⃣ Background Blur
  ---------------------------- */

  const blurBehindTransform = new Transformation()
    .resize(fill().width(cardWidth).height(cardHeight))
    .effect(blur(120))
    .adjust(opacity(35))
    .roundCorners(byRadius(24));

  img.overlay(
    source(image(publicId).transformation(blurBehindTransform)).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(CARD_OFFSET_X)
        .offsetY(CARD_OFFSET_Y)
    )
  );

  /* ---------------------------
     8️⃣ Dream Card (A1-R + G1)
  ---------------------------- */
  const cardTransform = new Transformation()
    .resize(fill().width(cardWidth).height(cardHeight))
    .adjust(opacity(30))
    .roundCorners(byRadius(24))
    .effect(shadow().color("#000000").strength(16).offsetX(0).offsetY(8));

  img.overlay(
    source(image("images_dgldbf").transformation(cardTransform)).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(CARD_OFFSET_X)
        .offsetY(CARD_OFFSET_Y)
    )
  );

  /* ---------------------------
     9️⃣ Title
  ---------------------------- */

  img.overlay(
    source(
      text(
        wrappedTitle,
        new TextStyle("Arial", titleFontSize).fontWeight("bold")
      )
        .textColor(theme.text)
        .transformation(new Transformation().resize(fill()))
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(CARD_OFFSET_X + CARD_PADDING)
        .offsetY(titleBaselineY)
    )
  );

  //   /* ---------------------------
  //      🔟 Subtitle
  //   ---------------------------- */
  img.overlay(
    source(
      text(wrappedSubtitle, new TextStyle("Arial", subtitleFontSize))
        .textColor("#374151")
        .transformation(new Transformation().resize(fill()))
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(CARD_OFFSET_X + CARD_PADDING)
        .offsetY(subtitleBaselineY)
    )
  );

  //   /* ---------------------------
  //      1️⃣1️⃣ Brand watermark
  //   ---------------------------- */

  // BRAND LOGO

  img.overlay(
    source(
      image("SomniMind_ICON_qvflju").transformation(
        new Transformation()
          .resize(fill().width(24).height(24))
          //   .adjust(opacity(55))
          .roundCorners(byRadius(24))
      )
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(CARD_OFFSET_X + CARD_PADDING)
        .offsetY(brandBaselineY - 8)
    )
  );

  img.overlay(
    source(
      text("Made With SomniaMind", new TextStyle("Arial", 14)).textColor(
        "#000000"
      )
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(CARD_OFFSET_X + CARD_PADDING + 28)
        .offsetY(brandBaselineY)
    )
  );

  return img.toURL();
};

module.exports = {
  generateShareImageUrl,
};
