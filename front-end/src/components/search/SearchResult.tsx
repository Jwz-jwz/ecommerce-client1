"use client";
import { Product } from "@/context/ProductContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchProducts() {
  const params = useSearchParams();
  const router = useRouter();

  const search = params.get("search") || "";
  const page = parseInt(params.get("page") || "1");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { likedProductIds, toggleLike, fetchLiked } = useUserContext();

  useEffect(() => {
    fetchLiked();
  }, [fetchLiked]);

  const handleToggleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleLike(productId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/products/search?search=${encodeURIComponent(
            search
          )}&page=${page}`
        );
        const data = await res.json();
        setSearchProducts(data.products);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search, page]);

  const goToPage = (p: number) => {
    router.push(
      `/search-product?search=${encodeURIComponent(search)}&page=${p}`
    );
  };

  return (
    <div className="bg-white w-full mt-5 mb-15">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p> Ачааллаж байна</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Хайлтын үр дүн
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
            {searchProducts?.map((product) => {
              const discountedPrice =
                product.sale && product.sale > 0
                  ? Math.floor(
                      product.price - (product.price * product.sale) / 100
                    )
                  : null;

              const isLiked = likedProductIds?.some(
                (likedProduct) => likedProduct._id === product._id
              );

              return (
                <div
                  key={product?._id}
                  className="group relative bg-white rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-[var(--gray200)]"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-white">
                    {Number(product?.sale) > 0 && (
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
                        <div className="bg-[var(--pink500)] text-white px-1.5 py-0.5 sm:px-2 text-xs font-medium rounded">
                          {product?.sale}%
                        </div>
                      </div>
                    )}

                    <Link href={`/product/${product._id}`}>
                      <img
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 sm:p-3 lg:p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="p-2 sm:p-3 lg:p-4">
                    <Link href={`/product/${product._id}`} className="block">
                      <h3 className="text-xs sm:text-sm text-gray-900 mb-1 sm:mb-2 line-clamp-2 font-bold leading-tight">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        {/* Price Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
                          {discountedPrice !== null ? (
                            <>
                              <span className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                {discountedPrice?.toLocaleString()}₮
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 line-through truncate">
                                {product.price?.toLocaleString()}₮
                              </span>
                            </>
                          ) : (
                            <span className="text-sm sm:text-base font-medium text-gray-900 truncate">
                              {product.price?.toLocaleString() || "N/A"}₮
                            </span>
                          )}
                        </div>

                        {/* Like Button */}
                        <div className="flex items-center ml-2 flex-shrink-0">
                          <button
                            className="p-1 sm:p-1.5 hover:bg-gray-100 transition-colors rounded"
                            onClick={(e) => handleToggleLike(product._id, e)}
                          >
                            <Heart
                              size={14}
                              className={`sm:w-4 sm:h-4 ${
                                isLiked
                                  ? "text-[var(--pink500)] fill-[var(--pink500)]"
                                  : "text-[var(--gray600)] group-hover:text-gray-900"
                              } hover:cursor-pointer`}
                            />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalPages >= 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="px-4 py-2 hover:cursor-pointer rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={i + 1 === page ? "font-bold" : ""}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className="px-4 py-2  rounded disabled:opacity-50 hover:cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
