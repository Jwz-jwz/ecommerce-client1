"use client";
import { useUserContext } from "@/context/UserContext";
import { CalendarClock, RefreshCw, Package } from "lucide-react";
import { Key, useCallback, useState } from "react";

type ProductId =
  | string
  | {
      _id: string;
      name: string;
      price: number;
      images: { url: string }[];
      sale: number;
    };

type CartItem = {
  productId: ProductId;
  selectedSize?: string;
  quantity?: number;
  _id?: string;
  price: number;
  sale?: number;
};

type Order = {
  _id?: string;
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
  delivery: string;
  info?: string;
  totalPrice?: string;
  cartItemToBackend: CartItem[];
  createdAt: Date;
  process?: any;
};

const isPopulatedProduct = (
  productId: any
): productId is Exclude<ProductId, string> => {
  return productId && typeof productId === "object";
};

const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const formatPrice = (price: string | number) => {
  return parseInt(String(price)).toLocaleString();
};

function UserOrders() {
  const { userOrders, loading, error, refreshOrders } = useUserContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refreshOrders]);

  if (loading.orders) {
    return (
      <div className="col-span-full flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error.orders) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-sm sm:text-base">
            Error loading orders: {error.orders}
          </p>
          <button
            onClick={handleRefresh}
            className="text-blue-600 flex items-center gap-1 justify-center sm:justify-start"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-medium text-[var(--gray600)]">
          Захиалга олдсонгүй.
        </h2>
        <p className="mt-2 text-gray-500">Танд захиалгын түүх байхгүй байна.</p>
      </div>
    );
  }

  const renderOrderCard = (order: Order) => (
    <div
      key={order._id as Key}
      className="container mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      {/* Desktop header - unchanged */}
      <div className="hidden md:flex justify-between bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              order?.process === "Захиалсан"
                ? "bg-yellow-100 text-yellow-800"
                : order?.process === "Баталгаажсан"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {order?.process || "Захиалсан"}
          </span>
          <span className="text-l font-bold text-black">
            {formatPrice(order.totalPrice || 0)} ₮
          </span>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-gray-100 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4" />
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-red-400">
            {order?.process}
          </span>
          <span className="text-lg font-bold text-black">
            {formatPrice(order.totalPrice || 0)} ₮
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        <div className="space-y-3 w-full">
          {/* Desktop grid header - unchanged */}
          <div className="hidden md:grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr] gap-4 text-xs font-semibold text-gray-500 px-2">
            <div>Бүтээгдэхүүн</div>
            <div>Нэр</div>
            <div>Хэмжээ</div>
            <div>Тоо ширхэг</div>
            <div>Үнэ</div>
            <div>Нийт</div>
          </div>

          {order.cartItemToBackend.map(
            (item: CartItem, idx: Key | null | undefined) => {
              if (!isPopulatedProduct(item.productId)) {
                return (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-md shadow-sm text-gray-400 text-xs"
                  >
                    <p>Product data not available (ID: {item.productId})</p>
                  </div>
                );
              }

              const product = item.productId;
              const itemSale = item.sale || 0;
              const salePrice =
                itemSale > 0 ? item.price * (1 - itemSale / 100) : item.price;

              return (
                <div key={idx}>
                  {/* Desktop layout - unchanged */}
                  <div className="hidden md:grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-gray-50 p-4 rounded-md shadow-sm text-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      {product.images?.length > 0 && (
                        <img
                          src={
                            product.images[0].url || "/api/placeholder/100/100"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/100/100";
                          }}
                        />
                      )}
                    </div>

                    <div className="font-medium text-gray-800">
                      {product.name}
                    </div>
                    <div>{item.selectedSize || "-"}</div>
                    <div>{item.quantity || 0}ш</div>
                    <div>
                      <span className="text-gray-800 font-medium">
                        {formatPrice(salePrice)} ₮
                      </span>
                      {itemSale > 0 && (
                        <span className="ml-1 text-xs line-through text-gray-400">
                          {formatPrice(item.price)} ₮
                        </span>
                      )}
                    </div>
                    <div className="text-black font-medium">
                      {item.quantity
                        ? formatPrice(salePrice * item.quantity)
                        : "N/A"}{" "}
                      ₮
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden bg-gray-50 p-4 rounded-md shadow-sm mb-3">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {product.images?.length > 0 && (
                          <img
                            src={
                              product.images[0].url ||
                              "/api/placeholder/100/100"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/api/placeholder/100/100";
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm mb-2 truncate">
                          {product.name}
                        </h4>

                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Хэмжээ:</span>
                            <span className="font-medium">
                              {item.selectedSize || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Тоо ширхэг:</span>
                            <span className="font-medium">
                              {item.quantity || 0}ш
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Үнэ:</span>
                            <div>
                              <span className="text-gray-800 font-medium">
                                {formatPrice(salePrice)} ₮
                              </span>
                              {itemSale > 0 && (
                                <span className="ml-1 text-xs line-through text-gray-400">
                                  {formatPrice(item.price)} ₮
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between border-t pt-1 mt-2">
                            <span className="font-medium">Нийт:</span>
                            <span className="text-black font-bold">
                              {item.quantity
                                ? formatPrice(salePrice * item.quantity)
                                : "N/A"}{" "}
                              ₮
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 my-4 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Таны захиалгын түүх
        </h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 text-black px-3 py-1 rounded-md hover:bg-gray-100 hover:cursor-pointer w-fit"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Шинэчлэх
        </button>
      </div>

      <div className="space-y-6 mt-4">
        {userOrders.map((order) => renderOrderCard(order))}
      </div>
    </div>
  );
}

export default UserOrders;
