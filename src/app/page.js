"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const filtered = posts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <input
            placeholder="Search by name..."
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-xs"
          />
          <Link
            href="/create"
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition"
          >
            + Add Post
          </Link>
        </div>

        {filtered.length === 0 && <p>No posts found.</p>}

        <ul className="space-y-4">
          {filtered.map((post) => (
            <li key={post._id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
