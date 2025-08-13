"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  Heart,
  CircleAlert,
  Truck,
  ShoppingCart,
  Package,
  BookOpen,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useProductContext } from "@/context/ProductContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

interface Timage {
  _id: string;
  url: string;
}

interface Tsize {
  _id: string;
  size: string;
  stock?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string | undefined;
  sale?: number | undefined;
  images?: Timage[];
  sizes?: Tsize[] | undefined;
  stock?: number;
  categoryId: string;
  subCategoryId?: string;
}

export default function ProductInfo() {
  const [product, setProduct] = useState<Product>();
  const [selectImg, setSelectImg] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Tsize | null>(null);
  const { id } = useParams();
  const {
    products,
    increaseQuantity,
    decreaseQuantity,
    quantity,
    addToCart,
    setQuantity,
  } = useProductContext();
  const { likedProductIds, toggleLike } = useUserContext();

  const isLiked = product
    ? likedProductIds.some((p) => p._id === product._id)
    : false;

  useEffect(() => {
    if (id) {
      const foundProduct = products?.find((product) => product?._id === id);
      setProduct(foundProduct);

      setQuantity(1);

      if (foundProduct?.images && foundProduct.images.length > 0) {
        setSelectImg(foundProduct.images[0].url);
      }
    }
  }, [id, products]);

  const calculateDiscountedPrice = () => {
    if (product?.sale && product.price) {
      const discount = (product.price * product.sale) / 100;
      return Math.floor(product.price - discount);
    }
    return product?.price;
  };

  const handleAddToCart = () => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.warning("Бүтээгдэхүүний хэмжээг сонгоно уу!");
      return;
    }

    if (selectedSize && selectedSize.stock && selectedSize.stock === 0) {
      toast.error("Сонгосон хэмжээ дууссан байна!");
      return;
    }

    if (!product?.sizes?.length && product?.stock && product?.stock === 0) {
      toast.error("Бараа дууссан байна!");
      return;
    }

    if (product) {
      addToCart(product, quantity, selectedSize);
    }
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
  const handleIncrease = () => {
    if (product?.sizes?.length && !selectedSize) {
      toast.warning("Бүтээгдэхүүний хэмжээг сонгоно уу!");
      return;
    }
    if (product?.sizes?.length && selectedSize) {
      const stock = selectedSize.stock ?? 0;
      if (quantity >= stock) {
        toast.warning("Захиалгын хэмжээ нөөцөөс хэтэрсэн байна!");
        return;
      }
    } else {
      const stock = product?.stock ?? 0;
      if (quantity >= stock) {
        toast.warning("Захиалгын хэмжээ нөөцөөс хэтэрсэн байна!");
        return;
      }
    }

    increaseQuantity();
  };

  // console.log(quantity);

  return (
    <div className="bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800">
            Нүүр
          </Link>{" "}
          /{" "}
          <Link href="/product-listing" className="hover:text-gray-800">
            Бүтээгдэхүүнүүд
          </Link>{" "}
          / <span className="text-gray-800">{product?.name}</span>
        </div>

        <div className="bg-white shadow-sm rounded-sm">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Main Image */}
                <div className="relative w-full md:h-80 bg-white overflow-hidden rounded-sm flex-1">
                  {selectImg ? (
                    <img
                      src={selectImg}
                      alt="Selected product view"
                      className="w-full h-full object-contain p-4 md:p-6 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="overflow-x-auto md:overflow-y-auto md:w-20">
                  <div className="flex md:flex-col gap-2 mt-2 md:mt-0">
                    {product?.images?.map((image, index) => (
                      <div
                        key={image._id || `${product?._id}-${index}`}
                        className={`w-20 h-20 p-1 border rounded-sm shrink-0 cursor-pointer transition-all ${
                          selectImg === image.url
                            ? "border-gray-400 shadow-sm"
                            : "border-[var(--gray200)] hover:border-gray-300"
                        }`}
                        onClick={() => setSelectImg(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={`Product thumbnail ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {product?.name}
                </h1>
                <button
                  className="p-1.5 hover:bg-gray-100 transition-colors rounded-sm hover:cursor-pointer"
                  onClick={(e) => product && handleToggleLike(product._id, e)}
                >
                  <Heart
                    size={20}
                    className={
                      isLiked
                        ? "text-[var(--pink500)] fill-[var(--pink500)]"
                        : "text-[var(--gray600)] hover:text-gray-900"
                    }
                  />
                </button>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {product?.sale && product?.price
                      ? `${calculateDiscountedPrice()?.toLocaleString() || ""}₮`
                      : product?.price
                      ? `${product.price.toLocaleString()}₮`
                      : "N/A"}
                  </span>
                  {product?.sale && product.sale > 0 ? (
                    <span className="text-lg text-gray-500 line-through">
                      {`${product?.price?.toLocaleString() || ""}₮`}
                    </span>
                  ) : null}
                  {Number(product?.sale) > 0 && (
                    <div className="bg-[var(--pink500)] text-white px-2 py-0.5 text-xs font-medium rounded-sm">
                      {product?.sale}%
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              {product?.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Хэмжээ сонгох
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size._id}
                        className={`px-4 py-2 text-sm border transition-all rounded-sm hover:cursor-pointer ${
                          selectedSize?._id === size._id
                            ? "border-gray-400  text-gray-900"
                            : "border-[var(--gray200)] text-[var(--gray600)] hover:border-gray-400"
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1); // reset quantity when size changes
                        }}
                      >
                        {size.size}
                        {typeof size.stock === "number" && (
                          <span className="block text-xs mt-1 text-gray-500">
                            {size.stock === 0 ? "Дууссан" : ``}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Тоо хэмжээ
                </p>
                <div className="flex items-center w-fit rounded-sm overflow-hidden border border-[var(--gray200)]">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:cursor-pointer border-r border-[var(--gray200)]"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-medium text-gray-800">
                    {quantity}
                  </span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:cursor-pointer border-l border-[var(--gray200)]"
                    onClick={handleIncrease}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={
                  selectedSize?.stock === 0 ||
                  (!product?.sizes?.length && product?.stock === 0)
                }
                className={`w-full py-3 px-6 font-medium transition-colors bg-gray-800 text-white border-gray-800 rounded-sm flex items-center justify-center gap-2 hover:cursor-pointer ${
                  selectedSize?.stock === 0 ||
                  (!product?.sizes?.length && product?.stock === 0)
                    ? "bg-red-300 text-white cursor-not-allowed"
                    : "bg-[var(--gray200)] text-gray-700 "
                }`}
              >
                <ShoppingCart size={18} />
                {selectedSize?.stock === 0 ||
                (!product?.sizes?.length && product?.stock === 0)
                  ? "Бараа дууссан"
                  : "Сагсанд нэмэх"}
              </button>
            </div>
          </div>

          {/* Description and Info */}
          <div className="mt-8 pt-6 border-t border-[var(--gray200)]">
            <div className="flex flex-col md:flex-row">
              {product?.description && (
                <div className="w-full md:w-3/5 px-6 pb-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex gap-3 border-b border-[var(--gray200)] mb-4 pb-2">
                      <BookOpen size={18} />
                      <h3 className="text-sm font-medium text-gray-900">
                        Товч мэдээлэл
                      </h3>
                    </div>
                    <div className="text-sm text-[var(--gray600)] product-description space-y-3">
                      {product.description
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full md:w-2/5 px-6 pb-6">
                <div className="border border-gray-100 shadow-sm rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-gray-100 rounded-full shrink-0">
                      <Truck size={18} className="text-gray-700" />
                    </div>
                    <p className="text-xs text-[var(--gray600)]">
                      100,000₮-с дээш худалдан авалтанд үнэгүй хүргэлттэй
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-gray-100 rounded-full shrink-0">
                      <Package size={18} className="text-gray-700" />
                    </div>
                    <p className="text-xs text-[var(--gray600)]">
                      2-3 ажлын өдөрт хүргэгдэнэ
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full shrink-0">
                      <CircleAlert size={18} className="text-gray-700" />
                    </div>
                    <p className="text-xs text-[var(--gray600)]">
                      30 хоногт буцаах боломжтой
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
