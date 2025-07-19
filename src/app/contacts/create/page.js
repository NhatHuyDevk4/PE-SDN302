'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { contactToasts } from '@/components/CustomToast';
import ContactForm from '@/components/ContactForm';

export default function CreateContact() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    const loadingToast = contactToasts.create.loading();

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        contactToasts.create.success(loadingToast);
        // Success - redirect to home page
        router.push('/');
      } else {
        // Handle error
        setError(data.error || 'Failed to create contact');
        contactToasts.create.error(data.error, loadingToast);
      }
    } catch (err) {
      setError('Failed to create contact. Please try again.');
      contactToasts.create.error('Không thể tạo liên hệ. Vui lòng thử lại.', loadingToast);
      console.error('Create contact error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Link>

          <div className="flex items-center space-x-3">
            <FaUserPlus className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Contact</h1>
              <p className="text-gray-600 mt-1">
                Fill in the details to add a new contact to your address book
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Contact Form */}
        <ContactForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitText="Create Contact"
        />
      </div>
    </div>
  );
}
