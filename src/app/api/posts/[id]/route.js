
import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Post from "@/models/Post";


export async function GET(req, paramsPromise) {
  await dbConnect();
  const { params } = await paramsPromise;
  console.log('API GET /api/posts/[id] id:', params.id);
  if (!params?.id) {
    return NextResponse.json({ error: 'Missing id param' }, { status: 400 });
  }
  try {
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid id or server error', detail: err.message }, { status: 500 });
  }
}


export async function PUT(req, paramsPromise) {
  await dbConnect();
  const { params } = await paramsPromise;
  const body = await req.json();
  const updated = await Post.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}


export async function DELETE(req, paramsPromise) {
  await dbConnect();
  const { params } = await paramsPromise;
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
