'use client';

import Link from 'next/link';
import { FaAddressBook, FaPlus, FaHome } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold text-gray-800 transition-colors duration-200 hover:text-blue-600"
          >
            <FaAddressBook className="w-6 h-6 text-blue-600" />
            <span>Contact Manager</span>
          </Link>

          {/* Navigation Links */}
          {/* <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center px-3 py-2 space-x-2 font-medium text-gray-700 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
