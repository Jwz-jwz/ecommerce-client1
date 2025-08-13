"use client";
import { useProductContext } from "@/context/ProductContext";
import { useCategoryContext } from "@/context/CategoryContext";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ImageOff, Heart, ChevronLeft } from "lucide-react";

export default function ProductByCategory() {
  const {
    products,
    page,
    setPage,
    totalPages,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    loading,
  } = useProductContext();
  const { categories } = useCategoryContext();
  const { likedProductIds, toggleLike } = useUserContext();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const selectCategory = (_id: string) => {
    setSelectedCategory(_id);
    setSelectedSubCategory("");
    setPage(1);
    if (_id !== "all" && _id !== "sale") {
      toggleCategory(_id);
    }
  };

  const selectSubCategory = (_id: string) => {
    setSelectedSubCategory(_id);
    setPage(1);
  };

  const handleToggleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleLike(productId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Get current category name for display
  const getCurrentCategoryName = () => {
    if (selectedCategory === "sale") return "Хямдралтай";
    if (selectedSubCategory) {
      return (
        categories
          ?.find((c) => c._id === selectedCategory)
          ?.subCat?.find((s) => s._id === selectedSubCategory)?.name || ""
      );
    }
    if (selectedCategory && selectedCategory !== "all") {
      return categories.find((c) => c._id === selectedCategory)?.name || "";
    }
    return "Бүх бүтээгдэхүүн";
  };

  return (
    <div className="bg-white w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Categories - Horizontal Scroll */}
        <div className="md:hidden mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* All Products Button */}
            <button
              onClick={() => selectCategory("all")}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              Бүгд
            </button>

            {/* Category Buttons */}
            {categories?.map((category) => (
              <button
                key={category._id}
                onClick={() => selectCategory(category._id)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
                  selectedCategory === category._id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.name}
              </button>
            ))}

            {/* Sale Button */}
            <button
              onClick={() => selectCategory("sale")}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${
                selectedCategory === "sale"
                  ? "bg-[var(--pink500)] text-white border-[var(--pink500)]"
                  : "bg-white text-[var(--pink500)] border-[var(--pink500)] hover:bg-[var(--pink500)] hover:text-white"
              }`}
            >
              SALE %
            </button>
          </div>

          {/* Mobile Subcategories */}
          {selectedCategory &&
            selectedCategory !== "all" &&
            selectedCategory !== "sale" && (
              <div className="mt-3">
                <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {categories
                    ?.find((c) => c._id === selectedCategory)
                    ?.subCat?.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => selectSubCategory(subCat._id)}
                        className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap ${
                          selectedSubCategory === subCat._id
                            ? "bg-gray-200 text-gray-900 border-gray-300"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {subCat.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Categories Sidebar */}
          <div className="hidden md:block w-full md:w-1/4">
            <div className="bg-white rounded-lg border border-[var(--gray200)] p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Ангилал
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => selectCategory("all")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors hover:cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-gray-100 text-gray-900"
                      : "text-[var(--gray600)] hover:bg-gray-50"
                  }`}
                >
                  Бүгд
                </button>
                {categories?.map((category) => (
                  <div key={category?._id} className="space-y-1">
                    <button
                      onClick={() => selectCategory(category._id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors flex items-center justify-between hover:cursor-pointer ${
                        selectedCategory === category._id
                          ? "bg-gray-100 text-gray-900"
                          : "text-[var(--gray600)] hover:bg-gray-50"
                      }`}
                    >
                      <span>{category.name}</span>
                      {category.subCat && category.subCat.length > 0 && (
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            expandedCategories[category._id] ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>
                    {expandedCategories[category._id] &&
                      category.subCat?.map((subCat) => (
                        <button
                          key={subCat._id}
                          onClick={() => selectSubCategory(subCat._id)}
                          className={`w-full text-left px-6 py-1.5 text-sm rounded-sm transition-colors hover:cursor-pointer ${
                            selectedSubCategory === subCat._id
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {subCat.name}
                        </button>
                      ))}
                  </div>
                ))}
                <button
                  onClick={() => selectCategory("sale")}
                  className={`w-full text-left px-3 py-2 text-[var(--pink500)] text-sm rounded-sm transition-colors hover:cursor-pointer ${
                    selectedCategory === "sale"
                      ? "bg-gray-100 "
                      : " hover:bg-gray-50"
                  }`}
                >
                  SALE %
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-5 mt-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {getCurrentCategoryName()}
              </h2>
            </div>

            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const discountedPrice =
                    product.sale && product.sale > 0
                      ? Math.floor(
                          product.price - (product.price * product.sale) / 100
                        )
                      : null;

                  const likedIds =
                    likedProductIds?.map((item) =>
                      typeof item === "string" ? item : item._id || item._id
                    ) || [];

                  const isLiked = likedIds.includes(product._id);

                  return (
                    <div
                      key={product._id}
                      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md border border-[var(--gray200)]"
                    >
                      {/* Product Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-white">
                        {/* Sale Badge */}
                        {product.sale && product.sale > 0 ? (
                          <div className="absolute top-2 right-2 z-10">
                            <div className="bg-[var(--pink500)] text-white px-2 py-0.5 text-xs font-medium rounded">
                              {product.sale}%
                            </div>
                          </div>
                        ) : null}

                        {/* Product Image */}
                        <Link href={`/product/${product._id}`}>
                          <img
                            src={product.images?.[0]?.url || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <Link
                          href={`/product/${product._id}`}
                          className="block"
                        >
                          <h3 className="text-sm text-gray-900 mb-1 line-clamp-2 font-bold">
                            {product.name}
                          </h3>

                          {/* Price Display */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {discountedPrice ? (
                                <>
                                  <span className="text-base font-medium text-gray-900">
                                    {discountedPrice.toLocaleString()}₮
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {product.price.toLocaleString()}₮
                                  </span>
                                </>
                              ) : (
                                <span className="text-base font-medium text-gray-900">
                                  {product.price.toLocaleString()}₮
                                </span>
                              )}
                            </div>
                            <button
                              className="p-1.5 hover:bg-gray-100 transition-colors"
                              onClick={(e) => handleToggleLike(product._id, e)}
                            >
                              <Heart
                                size={16}
                                className={
                                  isLiked
                                    ? "text-[var(--pink500)] fill-[var(--pink500)] hover:cursor-pointer"
                                    : "text-[var(--gray600)] group-hover:text-gray-900 hover:cursor-pointer"
                                }
                              />
                            </button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <ImageOff className="text-gray-400" size={30} />
                  <p className="text-sm text-gray-500">
                    {selectedCategory === "sale"
                      ? "Одоогоор хямдралтай бүтээгдэхүүн байхгүй байна."
                      : selectedSubCategory
                      ? "Энэ дэд ангилалд бүтээгдэхүүн байхгүй байна."
                      : "Энэ ангилалд бүтээгдэхүүн байхгүй байна."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-15 space-x-4">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 hover:cursor-pointer rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-1 rounded  hover:cursor-pointer  ${
                  page === pageNumber
                    ? "bg-gray-800 text-white "
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2  rounded disabled:opacity-50 hover:cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
