'use client';

import { useState } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaSave, FaTimes,
  FaUserFriends, FaBriefcase, FaHome, FaQuestion
} from 'react-icons/fa';

const ContactForm = ({
  initialData = { name: '', email: '', phone: '', group: '' },
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = 'Save Contact'
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const getGroupIcon = (group) => {
    const icons = {
      'Friends': FaUserFriends,
      'Work': FaBriefcase,
      'Family': FaHome,
      'Other': FaQuestion
    };
    const IconComponent = icons[group] || FaQuestion;
    return <IconComponent className="w-4 h-4 mr-2 text-gray-400" />;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone) {
      const numericPhone = formData.phone.replace(/\D/g, '');
      if (!/^\d{10,11}$/.test(numericPhone)) {
        newErrors.phone = 'Số điện thoại phải gồm 10 hoặc 11 chữ số';
      }
    }

    if (!formData.group) {
      newErrors.group = 'Please select a group';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="max-w-2xl p-8 mx-auto bg-white shadow-lg rounded-xl animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaUser className="w-4 h-4 mr-2 text-gray-400" />
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter full name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaEnvelope className="w-4 h-4 mr-2 text-gray-400" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter email address"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaPhone className="w-4 h-4 mr-2 text-gray-400" />
            Phone (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter phone number"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Group */}
        <div>
          <label htmlFor="group" className="flex items-center mb-2 text-sm font-medium text-gray-700">
            {getGroupIcon(formData.group)}
            Group *
          </label>
          <select
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            className={`w-full px-4 py-3 transition-colors border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.group ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isLoading}
          >
            <option value="" disabled>
              -- Please select a group --
            </option>
            <option value="Friends">👥 Friends</option>
            <option value="Work">💼 Work</option>
            <option value="Family">🏠 Family</option>
          </select>
          {errors.group && (
            <p className="mt-1 text-sm text-red-600">{errors.group}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex pt-6 space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center flex-1 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : submitText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center justify-center flex-1 px-6 py-3 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
