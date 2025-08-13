"use client";
import { useProductContext } from "@/context/ProductContext";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";

export default function SaledProducts() {
  const { saledProducts, loading } = useProductContext();
  const { likedProductIds, toggleLike } = useUserContext(); // Get likedProductIds and toggleLike function

  const handleToggleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleLike(productId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };
  // Show only the first 4
  const displayedProducts = saledProducts.slice(0, 4);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!saledProducts || saledProducts.length === 0) {
    return null; // Don't show anything
  }

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 my-20">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Хямдралтай
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {displayedProducts.map((product) => {
          const discountedPrice =
            product.sale && product.sale > 0
              ? Math.floor(product.price - (product.price * product.sale) / 100)
              : null;

          const isLiked = likedProductIds?.some(
            (likedProduct) => likedProduct._id === product._id
          ); // Check if product is liked

          return (
            <div
              key={product._id}
              className="group relative bg-white rounded-xl overflow-hidden border border-[var(--gray200)] hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-square bg-white">
                {Number(product?.sale) > 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-[var(--pink500)] text-white px-2 py-0.5 text-xs font-medium rounded">
                      {product.sale}%
                    </div>
                  </div>
                )}
                <Link href={`/product/${product._id}`}>
                  <img
                    src={product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="p-4">
                <Link href={`/product/${product._id}`} className="block">
                  <h3 className="text-sm font-bold mb-1 text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {discountedPrice !== null ? (
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
                          {product.price?.toLocaleString() || "N/A"}₮
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

      <div className="flex items-center justify-center mt-6">
        <Link
          href={"/product-listing"}
          className="inline-flex items-center gap-2 px-6 py-2 bg-gray-800 text-white border-gray-800 rounded-lg  font-medium  transition-all duration-300"
        >
          Бүгд
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
