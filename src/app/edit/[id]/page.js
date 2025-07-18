"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "../../../components/PostForm";

export default function EditPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('API response:', data);
          setPost(data);
        });
    }
  }, [id]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      {post && <PostForm post={post} />}
    </div>
  );
}
