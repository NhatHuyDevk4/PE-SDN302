'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter, FaSort } from 'react-icons/fa';

const SearchBar = ({
    onSearch,
    onFilterChange,
    onSortChange,
    searchValue = '',
    filterValue = 'all',
    sortValue = 'name',
    sortOrder = 'asc'
}) => {
    const [search, setSearch] = useState(searchValue);
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, onSearch]);

    const handleClearSearch = () => {
        setSearch('');
        onSearch('');
    };

    const handleFilterChange = (e) => {
        onFilterChange(e.target.value);
    };

    const handleSortChange = (field) => {
        if (sortValue === field) {
            // Toggle sort order if same field
            onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to ascending
            onSortChange(field, 'asc');
        }
    };

    return (
        <div className="p-6 mb-6 bg-white shadow-md rounded-xl">
            {/* Search Input */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full py-3 pl-10 pr-10 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search contacts by name..."
                />
                {search && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    <FaFilter className="w-4 h-4 mr-2" />
                    Filters
                </button>

                {/* Sort Buttons */}
                <div className="flex items-center space-x-2">
                    <span className="mr-2 text-sm font-medium text-gray-700">Sort by:</span>
                    <button
                        onClick={() => handleSortChange('name')}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${sortValue === 'name'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Name
                        {sortValue === 'name' && (
                            <FaSort className={`w-3 h-3 ml-1 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                    </button>
                    <button
                        onClick={() => handleSortChange('createdAt')}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${sortValue === 'createdAt'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Date Added
                        {sortValue === 'createdAt' && (
                            <FaSort className={`w-3 h-3 ml-1 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Group Filter */}
                        <div>
                            <label htmlFor="group-filter" className="block mb-2 text-sm font-medium text-gray-700">
                                Filter by Group
                            </label>
                            <select
                                id="group-filter"
                                value={filterValue}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">🌐 All Groups</option>
                                <option value="Friends">👥 Friends</option>
                                <option value="Work">💼 Work</option>
                                <option value="Family">🏠 Family</option>
                                <option value="Other">❓ Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;