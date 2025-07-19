'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { contactToasts } from '@/components/CustomToast';
import ContactForm from '@/components/ContactForm';

export default function EditContact() {
  const router = useRouter();
  const { id } = useParams();

  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  const [error, setError] = useState('');

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${id}`);
        const data = await response.json();

        if (data.success) {
          setContact(data.data);
        } else {
          setError(data.error || 'Contact not found');
        }
      } catch (err) {
        setError('Failed to load contact');
        console.error('Fetch contact error:', err);
      } finally {
        setIsLoadingContact(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    const loadingToast = contactToasts.update.loading();

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        contactToasts.update.success(loadingToast);
        // Success - redirect to home page
        router.push('/');
      } else {
        // Handle error
        setError(data.error || 'Failed to update contact');
        contactToasts.update.error(data.error, loadingToast);
      }
    } catch (err) {
      setError('Failed to update contact. Please try again.');
      contactToasts.update.error('Không thể cập nhật liên hệ. Vui lòng thử lại.', loadingToast);
      console.error('Update contact error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  // Loading state
  if (isLoadingContact) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !contact) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center mb-4 text-blue-600 transition-colors hover:text-blue-700"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Link>

          <div className="p-6 border border-red-200 rounded-lg bg-red-50">
            <h2 className="mb-2 text-lg font-semibold text-red-800">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center mb-4 text-blue-600 transition-colors hover:text-blue-700"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Link>

          <div className="flex items-center space-x-3">
            <FaEdit className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Contact</h1>
              <p className="mt-1 text-gray-600">
                Update the contact information below
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && contact && (
          <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Contact Form */}
        {contact && (
          <ContactForm
            initialData={{
              name: contact.name,
              email: contact.email,
              phone: contact.phone || '',
              group: contact.group
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitText="Update Contact"
          />
        )}
      </div>
    </div>
  );
}
