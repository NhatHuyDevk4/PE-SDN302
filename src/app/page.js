'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaAddressBook } from 'react-icons/fa';
import { contactToasts } from '@/components/CustomToast';
import ContactCard from '@/components/ContactCard';
import SearchBar from '@/components/SearchBar';
import ContactStats from '@/components/ContactStats';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchQuery,
        group: filterGroup,
        sort: sortField,
        order: sortOrder
      });

      const response = await fetch(`/api/contacts?${params}`);
      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Fetch contacts error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete contact
  const handleDeleteContact = async (contactId) => {
    const loadingToast = contactToasts.delete.loading();

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setContacts(prev => prev.filter(contact => contact._id !== contactId));
        contactToasts.delete.success(loadingToast);
      } else {
        contactToasts.delete.error(data.error, loadingToast);
      }
    } catch (err) {
      contactToasts.delete.error('Không thể xóa liên hệ', loadingToast);
      console.error('Delete contact error:', err);
    }
  };

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter handler
  const handleFilterChange = (group) => {
    setFilterGroup(group);
  };

  // Sort handler
  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  // Fetch contacts when search/filter/sort changes
  useEffect(() => {
    fetchContacts();
  }, [searchQuery, filterGroup, sortField, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaAddressBook className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Manager</h1>
                <p className="mt-1 text-gray-600">
                  Manage your contacts with ease
                </p>
              </div>
            </div>

            <Link
              href="/contacts/create"
              className="flex items-center px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Contact
            </Link>
          </div>
        </div>

        {/* Contact Statistics */}
        {!loading && contacts.length > 0 && (
          <ContactStats contacts={contacts} />
        )}

        {/* Search and Filter Bar */}
        <SearchBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          searchValue={searchQuery}
          filterValue={filterGroup}
          sortValue={sortField}
          sortOrder={sortOrder}
        />

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Contacts Grid */}
        {!loading && (
          <>
            {contacts.length === 0 ? (
              <div className="py-12 text-center">
                <FaAddressBook className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No contacts found
                </h3>
                <p className="mb-6 text-gray-600">
                  {searchQuery || filterGroup !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first contact.'
                  }
                </p>
                <Link
                  href="/contacts/create"
                  className="inline-flex items-center px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact, index) => (
                    <div
                      key={contact._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ContactCard
                        contact={contact}
                        onDelete={handleDeleteContact}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
