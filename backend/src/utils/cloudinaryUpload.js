const cloudinary = require("../config/cloudinary.js");

async function uploadToCloudinary(base64String, { folder, public_id }) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(base64String, "base64");
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id,
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
      }
    );
    stream.end(buffer);
  });
}

module.exports = { uploadToCloudinary };
