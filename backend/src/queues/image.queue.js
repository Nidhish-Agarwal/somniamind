const ProcessedDream = require("../models/processedDream.model.js");
const {
  generateGeminiImageAndUpload,
} = require("../services/image.service.js");
const { emitProcessedDreamUpdate } = require("../utils/socketHelper.js");

let PQueue;
let imageQueue;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Process one image job
const processImageJob = async (
  dreamId,
  prompt,
  userId,
  attempt = 1,
  isManual = false
) => {
  try {
    const update = {
      $set: { image_status: "processing", image_is_retrying: true },
    };

    if (isManual) {
      update.$inc = { image_retry_count: 1 };
    }

    const updatedDream = await ProcessedDream.findByIdAndUpdate(
      dreamId,
      update,
      { new: true, fields: { image_retry_count: 1 } }
    );

    try {
      emitProcessedDreamUpdate(userId, dreamId, {
        image_status: "processing",
        image_is_retrying: true,
        image_retry_count: updatedDream.image_retry_count,
      });
    } catch (er) {
      console.error("failed to emit dream image update", er.message);
    }

    const imageUrl = await generateGeminiImageAndUpload(prompt);

    if (imageUrl.success === false) {
      throw new Error(imageUrl.error || "Unknown error during image upload");
    }

    await ProcessedDream.findByIdAndUpdate(dreamId, {
      $set: {
        image_status: "completed",
        image_url: imageUrl?.imageUrl,
        image_is_retrying: false,
      },
      $push: {
        image_generation_attempts: { status: "success", timestamp: new Date() },
      },
    });
    try {
      emitProcessedDreamUpdate(userId, dreamId, {
        image_status: "completed",
        image_url: imageUrl?.imageUrl,
        image_is_retrying: false,
      });
    } catch (er) {
      console.error("failed to emit dream image update", er.message);
    }

    console.log(`Image generation succeeded for ${dreamId}`);
  } catch (error) {
    console.error(`Image gen failed for ${dreamId}:`, error.message);

    await ProcessedDream.findByIdAndUpdate(dreamId, {
      $set: { image_status: "failed" },
      $push: {
        image_generation_attempts: {
          status: "failed",
          error: error.message,
          timestamp: new Date(),
        },
      },
    });
    try {
      emitProcessedDreamUpdate(userId, dreamId, {
        image_status: "failed",
        image_error: error.message,
      });
    } catch (er) {
      console.error("failed to emit dream image update", er.message);
    }

    if (attempt < 3) {
      console.log(`Retrying image generation in 10s (attempt ${attempt + 1})`);
      await delay(10000);
      imageQueue.add(() =>
        processImageJob(dreamId, prompt, userId, attempt + 1, false)
      );
    } else {
      await ProcessedDream.findByIdAndUpdate(dreamId, {
        $set: {
          image_status: "failed",
          image_is_retrying: false,
        },
      });

      try {
        emitProcessedDreamUpdate(userId, dreamId, {
          image_status: "failed",
          image_error: error.message,
          image_is_retrying: false,
        });
      } catch (er) {
        console.error("failed to emit dream image update", er.message);
      }
    }
  }
};

// Add job to queue
const addImageJob = async (dreamId, prompt, userId) => {
  if (!imageQueue) {
    console.error("Image queue not initialized yet.");
    return;
  }
  imageQueue.add(() => processImageJob(dreamId, prompt, userId, 1, true));
};

// Init queue
(async () => {
  const { default: PQueueModule } = await import("p-queue");
  PQueue = PQueueModule;
  imageQueue = new PQueue({ concurrency: 2 }); // sequential to control Gemini calls
})();

module.exports = { addImageJob };
