const { generateGeminiImage } = require("./gemini.service.js");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload.js");
const { generateWorkerImage } = require("./cloudflare-worker-image.service.js");

const generateGeminiImageAndUpload = async (prompt, dreamId) => {
  try {
    // Generate image buffer from Gemini
    // const base64Image = await generateGeminiImage(prompt);

    // if (!base64Image) throw new Error("Failed to generate image from Gemini.");

    const { imageBase64 } = await generateWorkerImage(prompt);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageBase64, {
      folder: "dream_images",
      public_id: `dream_${dreamId}_${Date.now()}`,
    });

    return {
      success: true,
      imageUrl: uploadResult.url,
      publicId: uploadResult.public_id,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = { generateGeminiImageAndUpload };
