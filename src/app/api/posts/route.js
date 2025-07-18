import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";

export async function GET() {
  await dbConnect();
  const posts = await Post.find({});
  return NextResponse.json(posts);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const post = await Post.create(body);
  return NextResponse.json(post, { status: 201 });
}
