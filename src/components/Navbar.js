"use client";
import Link from "next/link";
import {FiShoppingCart} from "react-icons/fi";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md transition-colors duration-300 hover:bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-800 hover:text-gray-600 transition-colors duration-300"
          >
            ClothCart
          </Link>

          {/* Navigation Links */}
          <div className="space-x-4 flex items-center">
            <Link
              href="/"
              className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Home
            </Link>
            {/* Cart with quantity */}
            <Link
              href="/"
              className="relative flex items-center text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              <FiShoppingCart className="mr-1" />
              Cart
            </Link>
            {/* Auth Buttons */}
            <Link
              href="/"
              className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Login
            </Link>
            {" "}
          </div>
        </div>
      </div>
    </nav>
  );
}
