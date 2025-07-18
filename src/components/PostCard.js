"use client";
import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }) {
  return (
    <div className="group relative overflow-hidden shadow hover:shadow-lg transition bg-white rounded-xl">
      <div className="relative">
        {post.image && (
          <Image
            src={post.image}
            alt={post.name}
            width={400}
            height={250}
            className="w-full h-56 object-contain bg-gray-50"
            priority={false}
            // fill    

          />
        )}
        <div className="absolute top-2 right-2 z-10">
          <Link
            href={`/edit/${post._id}`}
            className="bg-white/80 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow transition-colors duration-200"
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 text-center">{post.name}</h2>
        <p className="text-gray-600 text-sm line-clamp-2 text-center">{post.description}</p>
      </div>
    </div>
  );
}
