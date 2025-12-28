async function generateWorkerImage(prompt) {
  try {
    const res = await fetch(
      "https://image-generation.nidhishagarwal14.workers.dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_WORKER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Image generation failed");
    }

    const data = await res.json();

    const { imageBase64, mimeType } = data;

    if (!imageBase64) {
      throw new Error("No image returned from worker");
    }

    return { imageBase64, mimeType };
  } catch (er) {
    console.error("Error generating image from Cloudflare Worker:", er);
    throw er;
  }
}
module.exports = { generateWorkerImage };
