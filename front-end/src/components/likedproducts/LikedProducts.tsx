"use client";
import { useProductContext } from "@/context/ProductContext";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import { Heart, ImageOff } from "lucide-react";

export default function LikedProducts() {
  const { products } = useProductContext();
  const { likedProductIds, toggleLike } = useUserContext();

  // likedProductIds already contains the full product objects of liked products
  const likedProducts = likedProductIds || [];

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
    <div className="bg-white w-full mt-5 mb-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Таны хадгалсан бүтээгдэхүүнүүд
        </h2>

        {likedProducts && likedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
            {likedProducts.map((product, index) => {
              const discountedPrice =
                product.sale && product.sale > 0
                  ? Math.floor(
                      product.price - (product.price * product.sale) / 100
                    )
                  : null;

              // All products in likedProducts are by definition liked
              const isLiked = true;

              return (
                <div
                  key={product._id ?? `${product.name}-${index}`}
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
                    <Link href={`/product/${product._id}`} className="block">
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
                              {product.price?.toLocaleString() || "N/A"}₮
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleToggleLike(product._id, e)}
                        >
                          <Heart
                            size={16}
                            className={`${
                              isLiked
                                ? "text-[var(--pink500)] fill-[var(--pink500)]"
                                : "text-gray-400"
                            } hover:cursor-pointer transition-colors`}
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
                Таалагдсан бүтээгдэхүүн байхгүй байна.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
