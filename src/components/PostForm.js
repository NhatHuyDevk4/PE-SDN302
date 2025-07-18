"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

export default function PostForm({ post }) {
  const [name, setName] = useState(post?.name || "");
  const [desc, setDesc] = useState(post?.description || "");
  const [imageUrl, setImageUrl] = useState(post?.image || "");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle image upload completion
  const handleImageUploaded = (uploadedImageUrl) => {
    setImageUrl(uploadedImageUrl);
  };

  // Handle image upload status
  const handleImageUploadStatus = (isUploading) => {
    setIsImageUploading(isUploading);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if image is still uploading
    if (isImageUploading) {
      alert('Vui lòng đợi ảnh upload xong trước khi gửi!');
      return;
    }

    setLoading(true);

    try {
      const body = {
        name,
        description: desc,
        image: imageUrl
      };

      let response;
      if (post) {
        response = await fetch(`/api/posts/${post._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push("/");
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          {post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h1>
        <p className="text-gray-600">
          {post ? "Cập nhật thông tin bài viết của bạn" : "Chia sẻ câu chuyện của bạn với mọi người"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nhập tiêu đề bài viết..."
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || isImageUploading}
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Nội dung bài viết <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            placeholder="Chia sẻ suy nghĩ của bạn..."
            value={desc}
            onChange={e => setDesc(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled={loading || isImageUploading}
          />
          <p className="text-xs text-gray-500">
            Tối thiểu 10 ký tự. Hiện tại: {desc.length} ký tự
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <ImageUpload
            onUploaded={handleImageUploaded}
            onUploadStatusChange={handleImageUploadStatus}
            initialImageUrl={imageUrl}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 font-medium text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={loading || isImageUploading}
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            className="flex-1 px-6 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            disabled={loading || isImageUploading || desc.length < 10}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                <span>{post ? "Đang cập nhật..." : "Đang tạo..."}</span>
              </div>
            ) : isImageUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Đang upload ảnh...</span>
              </div>
            ) : (
              <span>{post ? "Cập nhật bài viết" : "Tạo bài viết"}</span>
            )}
          </button>
        </div>


      </form>
    </div>
  )
}
