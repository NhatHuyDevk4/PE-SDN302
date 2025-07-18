'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function ImageUpload({ onUploaded, onUploadStatusChange, initialImageUrl }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialImageUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(initialImageUrl || null);
    const fileInputRef = useRef(null);

    // Hardcoded Cloudinary info
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dsenbweg2/image/upload';
    const UPLOAD_PRESET = 'UploadAnh';

    // Update preview when initialImageUrl changes (for edit mode)
    useEffect(() => {
        if (initialImageUrl && !file) {
            setPreviewUrl(initialImageUrl);
            setUploadedUrl(initialImageUrl);
        }
    }, [initialImageUrl, file]);

    // Create preview URL for selected file
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url); // cleanup
        }
    }, [file]);

    // Notify parent component about upload status changes
    useEffect(() => {
        if (onUploadStatusChange) {
            onUploadStatusChange(isUploading);
        }
    }, [isUploading, onUploadStatusChange]);

    const handleChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        if (!selectedFile.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }

        // Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
            return;
        }

        setFile(selectedFile);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const res = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.secure_url) {
                setUploadedUrl(data.secure_url);
                setPreviewUrl(data.secure_url); // Use uploaded URL for preview
                if (onUploaded) {
                    onUploaded(data.secure_url);
                }
            } else {
                console.error('Upload failed', data);
                alert('Tải ảnh thất bại! Vui lòng thử lại.');
                // Reset file selection on failure
                setFile(null);
                setPreviewUrl(uploadedUrl || initialImageUrl || null);
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Lỗi khi upload ảnh. Vui lòng kiểm tra kết nối mạng và thử lại.');
            // Reset file selection on error
            setFile(null);
            setPreviewUrl(uploadedUrl || initialImageUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreviewUrl(null);
        setUploadedUrl(null);
        if (onUploaded) {
            onUploaded('');
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Ảnh bài viết
            </label>

            <div className="relative">
                {!previewUrl ? (
                    /* Upload Zone - Modern Design */
                    <div className="relative group">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            disabled={isUploading}
                            className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />

                        <div className={`
                            relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 min-h-[240px] flex flex-col justify-center
                            ${isUploading
                                ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 hover:shadow-lg group-hover:scale-[1.01]'
                            }
                        `}>
                            {isUploading ? (
                                /* Loading State */
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <div className="text-blue-700">
                                        <p className="mb-1 text-xl font-bold">Đang tải ảnh lên...</p>
                                        <p className="text-sm opacity-80">Vui lòng đợi trong giây lát</p>
                                    </div>
                                    <div className="w-full h-2 max-w-xs bg-blue-200 rounded-full">
                                        <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            ) : (
                                /* Upload Prompt */
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 shadow-lg bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 rounded-3xl group-hover:shadow-xl group-hover:scale-110">
                                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="absolute flex items-center justify-center w-8 h-8 rounded-full shadow-lg -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-green-600">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="mb-2 text-xl font-bold text-gray-800">Chọn ảnh để tải lên</p>
                                        <p className="mb-3 text-sm text-gray-600">hoặc kéo thả ảnh vào đây</p>
                                        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Chọn file
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>JPG, PNG, GIF</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>Tối đa 5MB</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Image Preview - Enhanced */
                    <div className="relative group">
                        <div className="relative overflow-hidden transition-all duration-300 border-gray-200 shadow-lg border-3 rounded-2xl bg-gray-50 group-hover:shadow-xl">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="object-cover w-full transition-all duration-300 h-80 group-hover:scale-105"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 transition-all duration-300 opacity-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:opacity-100"></div>

                            {/* Action Buttons */}
                            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center px-4 py-2 font-medium text-gray-800 transition-all duration-200 shadow-lg bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-xl"
                                        disabled={isUploading}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Thay đổi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="flex items-center px-4 py-2 font-medium text-white transition-all duration-200 shadow-lg bg-red-500/90 backdrop-blur-sm rounded-xl hover:bg-red-600 hover:shadow-xl"
                                        disabled={isUploading}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            {/* Upload Progress Overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm">
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                        </div>
                                        <p className="text-lg font-semibold text-blue-600">Đang tải lên...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hidden file input for change */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            disabled={isUploading}
                            className="hidden"
                        />

                        {/* Success Badge */}
                        <div className="absolute flex items-center px-3 py-1 space-x-1 text-xs font-medium text-white bg-green-500 rounded-full shadow-lg -top-3 -right-3">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Đã tải lên</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Help Section */}
            <div className="p-4 border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1 text-sm">
                        <h4 className="mb-2 font-semibold text-gray-800">Hướng dẫn tải ảnh</h4>
                        <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 md:grid-cols-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>Định dạng:</strong> JPG, PNG, GIF</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>Kích thước:</strong> Tối đa 5MB</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span><strong>Khuyến nghị:</strong> 800x600px+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
