"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useProductContext } from "@/context/ProductContext";
import { useUserContext } from "@/context/UserContext";
import { useEffect } from "react";

export default function HomeProducts() {
  const { homeProducts, loading, fetchHomePageProducts } = useProductContext();
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

  return (
    <div className="bg-white w-full mx-auto my-12 sm:my-16 lg:my-20">
      <div className="mb-6 sm:mb-8 text-center px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Сүүлд нэмэгдсэн
        </h2>
      </div>

      {/* Responsive grid with better breakpoints */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          homeProducts?.map((product) => {
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
          })
        )}
      </div>

      {/* View All Button */}
      <div className="flex items-center justify-center mt-6 sm:mt-8 px-4">
        <Link
          href={"/product-listing"}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2 bg-gray-800 text-white border-gray-800  rounded-lg text-sm sm:text-base  font-medium   transition-all duration-300"
        >
          Бүгд
          <ArrowRight size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </div>
  );
}
