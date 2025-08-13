"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/products");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Ecommerce section (70%) */}
      <div className="w-[70%] relative bg-white">
        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 w-full z-10 px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="flex items-center">
              <svg
                className="w-8 h-8 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5H21L19 19H5L3 5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 10V5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Ecommerce Admin
            </span>
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="relative h-screen w-full">
          {/* Hero Background Image with subtle animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-800 animate-gradient-slow">
            <div className="absolute inset-0 opacity-20">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 8 0 L 0 0 0 8"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Manage Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
                  Ecommerce Empire
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--gray200)] mb-6 leading-relaxed">
                Та энд бүтээгдэхүүн, хэрэглэгч болон захиалгыг нэг дор удирдах
                боломжтой.
              </p>
              <div className="mt-2 inline-flex space-x-2 items-center text-indigo-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Зөвшөөрөлд суурилсан найдвартай удирдлагын систем</span>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 w-full px-8 md:px-16 lg:px-24">
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-indigo-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-indigo-200 font-semibold">
                      Захиалгын Менежмент
                    </p>
                    <p className="text-indigo-200/70 text-sm">
                      Захиалга хянах ба боловсруулах
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-indigo-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-indigo-200 font-semibold">
                      Бүтээгдэхүүний Менежмент
                    </p>
                    <p className="text-indigo-200/70 text-sm">
                      Бүтээгдэхүүн хянах ба шинэчлэх
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Clerk Auth section (30%) */}
      <div className="w-[30%] bg-gray-50 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {isSignedIn ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-indigo-100 flex items-center justify-center bg-indigo-50">
                <svg
                  className="w-8 h-8 text-indigo-600 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Нэвтэрч байна...
              </h2>
              <p className="text-gray-500">
                Удирдлагын самбар руу шилжиж байна
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ecommerce Admin-д тавтай морилно уу.
                </h2>
                <p className="text-gray-500 mb-8">
                  Та нэвтрэхийг хүсвэл доорх товчин дээр дарна уу.
                </p>
              </div>

              <div className="space-y-4">
                <SignInButton mode="modal">
                  <button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition px-4 py-3 rounded-lg font-medium flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Нэвтрэх
                  </button>
                </SignInButton>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <SignInButton mode="modal">
                  <button className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Бүртгүүлэх
                  </button>
                </SignInButton>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
