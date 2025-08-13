"use client";
import { useProductContext } from "@/context/ProductContext";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import {
  Codesandbox,
  Search,
  CircleUserRound,
  ShoppingCart,
  Menu,
  X,
  List,
  Heart,
  Home,
  PackageSearch,
  Phone,
  HeadsetIcon,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { cartItems, user, refreshProducts } = useProductContext();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { refreshOrders } = useUserContext();

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileMenu]);

  useEffect(() => {
    refreshOrders(); // Always fetch latest orders when the page loads
  }, []);

  const handleClick = () => {
    if (isSignedIn) {
      router.push("/liked-products");
    } else {
      toast.info("Та сайтад нэвтэрсэн байх шаардлагатай.");
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Navigate to search page or update the URL with query
    router.push(
      `/search-product?search=${encodeURIComponent(searchTerm)}&page=1`
    );
  };

  return (
    <div className="w-full sticky top-0 z-50">
      <div className="w-full h-10 bg-[var(--gray200)] flex justify-center items-center">
        <p className="text-xs text-gray-400">OFFICIAL ECOMMERCE ONLINE STORE</p>
      </div>
      <header className="w-full lg:flex lg:justify-center sticky top-0 bg-white shadow-sm z-50 px-2 sm:px-5">
        <div className="container px-2 sm:px-3 py-3 sm:py-5 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center mr-4 sm:mr-8">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <Youtube className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800 transition-transform group-hover:scale-110" />
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Youtube
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <div className="flex gap-6 lg:gap-8 text-[14px] font-[500]">
              <Link
                href="/"
                className="font-medium text-gray-800 hover:text-[var(--darkgray)] hover:underline transition-colors"
              >
                Нүүр
              </Link>
              <Link
                href="/product-listing"
                className="font-medium text-gray-800 hover:text-[var(--darkgray)] hover:underline transition-colors"
              >
                Ангилал
              </Link>
              <Link
                href="/aboutus"
                className="font-medium text-gray-800 hover:text-[var(--darkgray)] hover:underline transition-colors"
              >
                Бидний тухай
              </Link>
              <Link
                href="/contactus"
                className="font-medium text-gray-800 hover:text-[var(--darkgray)] hover:underline transition-colors"
              >
                Холбоо барих
              </Link>
            </div>
          </nav>

          {/* Actions: Search, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Search Bar - Desktop and Tablet */}
            <form
              onSubmit={handleSubmit}
              className={`relative hidden md:flex items-center border rounded-lg overflow-hidden transition-all w-48 lg:w-64 border-gray-400 ring-2 ring-[var(--gray200)]`}
            >
              <input
                type="text"
                placeholder="Хайх"
                className="w-full py-2 px-3 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <Search className="w-5 h-5 ml-3 text-gray-500 mr-2 hover:cursor-pointer" />
              </button>
            </form>

            {/* <div
              className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCartDrawer />
            </div> */}

            {/* Cart Button with Counter */}
            <button
              onClick={handleClick}
              className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Liked Products"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--pink500)] fill-[var(--pink500)] hover:cursor-pointer" />
            </button>
            <Link
              href="/cartpage"
              className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Сагс"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              {cartItems && cartItems.length > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[var(--pink500)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems?.length}
                </span>
              ) : null}
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="touch-auto">
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Захиалгын түүх"
                      labelIcon={
                        <List className="w-4 h-4 text-[var(--pink500)]" />
                      }
                      onClick={() => router.push("/userorders")}
                    />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Таалагдсан бүтээгдэхүүнүүд"
                      labelIcon={
                        <Heart className="w-4 h-4 text-[var(--pink500)] fill-[var(--pink500)]" />
                      }
                      onClick={() => router.push("/liked-products")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
                aria-label="Sign In"
              >
                <CircleUserRound className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? "Close Menu" : "Open Menu"}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search (displayed full width below header) */}
        <div className="md:hidden px-4 sm:px-6 pb-3 sm:pb-4">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Хайх"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 outline-none text-sm"
            />
            <button type="submit">
              <Search className="w-5 h-5 ml-3 text-gray-500 mr-2 hover:cursor-pointer" />
            </button>
          </form>
        </div>

        {/* Mobile Navigation Menu with blur effect overlay */}
        <div
          className={`fixed inset-0  bg-opacity-70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowMobileMenu(false)}
        ></div>

        <div
          className={`fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            showMobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-bold">Цэс</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <nav className="flex flex-col">
            <Link
              href="/"
              className="px-6 py-4 font-medium text-gray-800 hover:bg-gray-50 border-b"
              onClick={() => setShowMobileMenu(false)}
            >
              <div className="flex gap-2 items-center">
                <Home className="w-5 h-5" />
                <p>Нүүр</p>
              </div>
            </Link>
            <Link
              href="/product-listing"
              className="px-6 py-4 font-medium text-gray-800 hover:bg-gray-50 border-b"
              onClick={() => setShowMobileMenu(false)}
            >
              <div className="flex gap-2 items-center">
                <PackageSearch className="w-5 h-5" />
                <p>Ангилал</p>
              </div>
            </Link>
            <Link
              href="/aboutus"
              className="px-6 py-4 font-medium text-gray-800 hover:bg-gray-50 border-b"
              onClick={() => setShowMobileMenu(false)}
            >
              <div className="flex gap-2 items-center">
                <HeadsetIcon className="w-5 h-5" />
                <p>Бидний тухай</p>
              </div>
            </Link>
            <Link
              href="/contactus"
              className="px-6 py-4 font-medium text-gray-800 hover:bg-gray-50 border-b"
              onClick={() => setShowMobileMenu(false)}
            >
              <div className="flex gap-2 items-center">
                <Phone className="w-5 h-5" />
                <p>Холбоо барих</p>
              </div>
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
