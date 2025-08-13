"use client";
import { UserButton } from "@clerk/nextjs";
import {
  Codesandbox,
  Menu,
  X,
  ShoppingBag,
  PlusCircle,
  Package,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  return (
    <header className="bg-white z-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Logo for mobile */}
        <Link href="/products" className="flex items-center gap-2">
          <Codesandbox className="w-6 h-6 text-gray-800" />
          <span className="text-lg font-bold">Ecommerce</span>
        </Link>

        {/* User button for mobile */}
        <div className="touch-auto">
          <UserButton />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="bg-white h-full w-64 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile sidebar content */}
            <div className="p-4 border-b flex items-center gap-3">
              <Codesandbox />
              <span className="text-lg font-bold">Ecommerce</span>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                      pathname === "/products"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Бүтээгдэхүүнүүд</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/addcategories"
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                      pathname === "/addcategories"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Ангилал нэмэх</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/addproduct"
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                      pathname === "/addproduct"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>Бүтээгдэхүүн нэмэх</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                      pathname === "/orders"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Захиалгууд</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Updated to match content height */}
      <div className="hidden md:flex flex-col min-h-screen">
        {/* Logo and Brand */}
        <div className="p-6 border-b flex-shrink-0">
          <Link href="/products" className="flex items-center gap-3 group">
            <UserButton />
            <h1 className="text-xl font-extrabold tracking-tight">Ecommerce</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 pb-20">
          <ul className="space-y-2">
            <li>
              <Link
                href="/products"
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                  pathname === "/products"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Бүтээгдэхүүнүүд</span>
              </Link>
            </li>
            <li>
              <Link
                href="/addcategories"
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                  pathname === "/addcategories"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Ангилал нэмэх</span>
              </Link>
            </li>
            <li>
              <Link
                href="/addproduct"
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                  pathname === "/addproduct"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Бүтээгдэхүүн нэмэх</span>
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                  pathname === "/orders"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Захиалгууд</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile at bottom - Fixed to bottom of screen */}
        <div className=" md:fixed md:bottom-0 md:left-0 md:w-64 p-4 border-t bg-white flex items-center gap-3 shadow-lg z-10">
          <Codesandbox className="w-7 h-7 text-gray-800 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium text-gray-700">Admin Panel</span>
        </div>
      </div>
    </header>
  );
}
