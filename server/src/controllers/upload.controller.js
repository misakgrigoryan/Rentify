import crypto from "crypto";

// Logged-in: upload one image to Cloudinary and return its public address
export const uploadImage = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (typeof image !== "string" || !image.startsWith("data:image/")) {
      return res.status(400).json({ message: "Please choose an image file" });
    }

    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !key || !secret) {
      return res.status(500).json({ message: "Image upload is not configured" });
    }

    // Sign the request: parameters sorted by name, then the secret appended, hashed with SHA-1
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "rentify";
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
      .digest("hex");

    const form = new URLSearchParams({ file: image, api_key: key, timestamp: String(timestamp), folder, signature });
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body: form,
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ message: "Upload failed, please try again" });
    }
    res.json({ url: data.secure_url });
  } catch (err) {
    next(err);
  }
};
