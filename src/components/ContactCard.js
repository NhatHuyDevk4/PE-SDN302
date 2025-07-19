'use client';

import { useState } from 'react';
import { FaEnvelope, FaPhone, FaEdit, FaTrash, FaUserFriends, FaBriefcase, FaHome, FaQuestion } from 'react-icons/fa';
import Link from 'next/link';
import ConfirmModal from './ConfirmModal';
import { useRouter } from 'next/navigation';


const ContactCard = ({ contact, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      await onDelete(contact._id);
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const getGroupColor = (group) => {
    const colors = {
      'Friends': 'bg-blue-100 text-blue-800',
      'Work': 'bg-green-100 text-green-800',
      'Family': 'bg-purple-100 text-purple-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[group] || colors['Other'];
  };

  const getGroupIcon = (group) => {
    const icons = {
      'Friends': FaUserFriends,
      'Work': FaBriefcase,
      'Family': FaHome,
      'Other': FaQuestion
    };
    const IconComponent = icons[group] || icons['Other'];
    return <IconComponent className="w-3 h-3 mr-1" />;
  };

  return (
    <>
      <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-lg hover:border-blue-200">
        {/* Header with name and group */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                {contact.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGroupColor(contact.group)}`}>
                {getGroupIcon(contact.group)}
                {contact.group}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <div
              onClick={() => router.push(`/contacts/edit/${contact._id}`)}
              className="p-2 text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50"
              title="Edit contact"
            >
              <FaEdit className="w-4 h-4" />
            </div>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-2 text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
              title="Delete contact"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-gray-600">
            <FaEnvelope className="w-4 h-4 text-gray-400" />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm truncate transition-colors duration-200 hover:text-blue-600"
            >
              {contact.email}
            </a>
          </div>

          {contact.phone && (
            <div className="flex items-center space-x-3 text-gray-600">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <a
                href={`tel:${contact.phone}`}
                className="text-sm transition-colors duration-200 hover:text-blue-600"
              >
                {contact.formattedPhone || contact.phone}
              </a>
            </div>
          )}
        </div>

        {/* Footer with creation date */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Added {new Date(contact.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact"
        message={`Are you sure you want to delete ${contact.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default ContactCard;