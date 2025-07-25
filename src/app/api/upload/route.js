import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const { image } = await req.json();
  const upload = await cloudinary.v2.uploader.upload(image, { folder: "posts" });
  return NextResponse.json({ url: upload.secure_url });
}
