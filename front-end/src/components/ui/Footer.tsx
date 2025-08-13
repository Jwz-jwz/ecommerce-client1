"use client";
import { useCategoryContext } from "@/context/CategoryContext";
import {
  Codesandbox,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { categories } = useCategoryContext();
  const limitedCategories = categories.slice(0, 4);

  return (
    <footer className="w-full bg-[var(--lightgray)] border-t border-[var(--gray200)]">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-8">
          {/* Logo & Info */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-3 mb-4">
              <Codesandbox className="w-7 h-7 text-gray-800" />
              <h2 className="text-xl font-extrabold tracking-tight">
                Ecommerce
              </h2>
            </div>
            <p className="text-[var(--gray600)] text-sm mb-4 max-w-sm">
              Бид олон жилийн туршлагатай худалдааны платформ бөгөөд
              хэрэглэгчдэд чанартай бүтээгдэхүүнийг хүргэхийг зорьж байна.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="hover:text-[var(--gray600)] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="hover:text-[var(--gray600)] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="hover:text-[var(--gray600)] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
            {/* Navigation Links */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Цэс</h3>
              <ul className="space-y-2 text-sm font-medium">
                <li>
                  <Link
                    href="/"
                    className="text-[var(--gray600)]  transition-colors hover:text-[var(--darkgray)] hover:underline"
                  >
                    Нүүр
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product-listing"
                    className="text-[var(--gray600)] hover:text-[var(--darkgray)] hover:underline transition-colors"
                  >
                    Ангилал
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aboutus"
                    className="text-[var(--gray600)] hover:text-[var(--darkgray)] hover:underline transition-colors"
                  >
                    Бидний тухай
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactus"
                    className="text-[var(--gray600)] hover:text-[var(--darkgray)] hover:underline transition-colors"
                  >
                    Холбоо барих
                  </Link>
                </li>
              </ul>
            </div>

            {/* Category Links */}
            <div>
              <h3 className="font-bold text-[var(--text)] mb-4">Ангилал</h3>
              <ul className="space-y-2 text-sm font-medium">
                {limitedCategories.map((category) => (
                  <li key={category?._id}>
                    <Link
                      href="/product-listing"
                      className="text-[var(--gray600)] hover:text-[var(--darkgray)] hover:underline transition-colors"
                    >
                      {category?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Холбоо барих</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--gray600)]" />
                  <span className="text-[var(--gray600)]">+976 9911-2233</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--gray600)]" />
                  <span className="text-[var(--gray600)]">
                    info@ecommerce.mn
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--gray600)] mt-1" />
                  <span className="text-[var(--gray600)]">
                    Улаанбаатар хот, Сүхбаатар дүүрэг
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-4 text-center md:text-left text-[14px] text-[var(--gray600)]">
          &copy; {new Date().getFullYear()} Ecommerce. Бүх эрх хуулиар
          хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
}
