"use client";
import { CartItem, TOrder, useOrderContext } from "@/context/OrderContext";
import {
  Eye,
  Info,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  DollarSign,
} from "lucide-react";
import { useCallback, useState } from "react";

type ProductId =
  | {
      _id: string;
      name: string;
      price: number;
      images: { url: string }[];
      sale: number;
    }
  | string;

function OrdersPage() {
  const {
    orders,
    loading,
    error,
    handleProcessChange,
    deleteOrder,
    refreshOrders,
    page,
    setPage,
    totalPages,
  } = useOrderContext();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refreshOrders]);

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

  const toggleOrderDetails = (orderId: string | undefined) => {
    if (!orderId) return;
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const countProducts = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const calculateTotalPrice = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      if (!item.quantity) return total;
      const effectivePrice =
        item.sale && item.sale > 0
          ? item.price * (1 - item.sale / 100)
          : item.price;
      return total + effectivePrice * item.quantity;
    }, 0);
  };

  const groupOrdersByDate = (orders: TOrder[] | null | undefined) => {
    const grouped: { [key: string]: TOrder[] } = {};
    if (!orders || !Array.isArray(orders)) {
      return grouped;
    }
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateKey = date.toISOString().slice(0, 10);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(order);
    });
    return grouped;
  };

  const formatDateHeader = (dateKey: string) => {
    const date = new Date(dateKey);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm sm:text-base text-gray-600">
          Ачааллаж байна
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 p-4 bg-red-50 text-red-600 rounded-md">
        <p className="text-sm sm:text-base">Error loading orders: {error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <h2 className="text-lg sm:text-xl font-medium text-[var(--gray600)]">
          Захиалга олдсонгүй.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          Одоогоор захиалга хийгдээгүй байна.
        </p>
      </div>
    );
  }

  const groupedOrders = groupOrdersByDate(orders);

  return (
    <div className="flex flex-col gap-2 p-2 sm:p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-lg sm:text-xl">📑</span>
          Захиалгууд
        </h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Шинэчлэх
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table Header - Only visible on large screens */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-4 font-semibold text-gray-700 border-b pb-2 px-4 py-3 bg-gray-50 text-sm">
          <p>Захиалгын № / Он сар</p>
          <p>Бүтээгдэхүүн</p>
          <p>Хэрэглэгчийн мэдээлэл</p>
          <p>Төлбөрийн мэдээлэл</p>
          <p>Процесс</p>
          <p>Үйлдэл</p>
        </div>

        {/* Orders */}
        <div className="divide-y divide-[var(--gray200)]">
          {Object.keys(groupedOrders)
            .sort()
            .reverse()
            .map((dateKey) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="bg-gray-100 px-3 sm:px-4 py-3 font-medium text-gray-700 text-center text-sm sm:text-base">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDateHeader(dateKey)}
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {groupedOrders[dateKey].map((order) => (
                    <div key={order._id} className="text-sm">
                      {/* Mobile Card Layout */}
                      <div className="block lg:hidden">
                        <div
                          className={`p-4 space-y-4 ${
                            expandedOrder === order._id
                              ? "bg-blue-100 border-l-4 border-blue-400"
                              : ""
                          }`}
                        >
                          {/* Order Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-800 text-base">
                                  #
                                  {typeof order._id === "string"
                                    ? order._id.slice(-6)
                                    : ""}
                                </span>
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
                              </div>
                              <p className="text-xs text-gray-500 mb-2">
                                {formatDate(order.createdAt)}
                              </p>

                              {/* Customer Info */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="font-medium text-gray-700 text-sm">
                                    {order.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {order.phoneNumber}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleOrderDetails(order._id)}
                                className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    order?._id &&
                                    confirm("Та энэ захиалгыг устгах уу?")
                                  ) {
                                    deleteOrder(order._id);
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>

                          {/* Products and Price Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {countProducts(order.cartItemToBackend)}{" "}
                                бүтээгдэхүүн
                              </span>
                              {/* Product Images */}
                              <div className="flex -space-x-1">
                                {order.cartItemToBackend
                                  .slice(0, 3)
                                  .map((item, idx) => {
                                    if (!isPopulatedProduct(item.productId))
                                      return null;
                                    return (
                                      <div
                                        key={idx}
                                        className="w-6 h-6 rounded-full border border-white overflow-hidden bg-gray-100"
                                      >
                                        {item.productId.images?.length > 0 ? (
                                          <img
                                            src={
                                              item.productId.images[0].url ||
                                              "/api/placeholder/100/100"
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.src =
                                                "/api/placeholder/100/100";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-[var(--gray200)]"></div>
                                        )}
                                      </div>
                                    );
                                  })}
                                {order.cartItemToBackend.length > 3 && (
                                  <div className="w-6 h-6 rounded-full bg-[var(--gray200)] flex items-center justify-center text-xs font-medium border border-white">
                                    +{order.cartItemToBackend.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600">
                                {formatPrice(order.totalPrice || 0)} ₮
                              </span>
                            </div>
                          </div>

                          {/* Process Selector */}
                          <div>
                            <select
                              value={order?.process || "Захиалсан"}
                              onChange={(e) =>
                                handleProcessChange(order._id, e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="Захиалсан">Захиалсан</option>
                              <option value="Баталгаажсан">Баталгаажсан</option>
                              <option value="Хүргэгдсэн">Хүргэгдсэн</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Grid Layout */}
                      <div
                        className={`hidden lg:grid lg:grid-cols-6 gap-4 p-4 ${
                          expandedOrder === order._id
                            ? "bg-blue-100 border-l-4 border-blue-400"
                            : ""
                        }`}
                      >
                        {/* Order ID */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">
                            #
                            {typeof order._id === "string"
                              ? order._id.slice(-6)
                              : ""}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        {/* Products */}
                        <div>
                          <span className="font-medium">
                            {countProducts(order.cartItemToBackend)}{" "}
                            бүтээгдэхүүн
                          </span>
                          <div className="flex -space-x-2 mt-1">
                            {order.cartItemToBackend
                              .slice(0, 3)
                              .map((item, idx) => {
                                if (!isPopulatedProduct(item.productId))
                                  return null;
                                return (
                                  <div
                                    key={idx}
                                    className="w-8 h-8 rounded-full border border-white overflow-hidden bg-gray-100"
                                  >
                                    {item.productId.images?.length > 0 ? (
                                      <img
                                        src={
                                          item.productId.images[0].url ||
                                          "/api/placeholder/100/100"
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.src =
                                            "/api/placeholder/100/100";
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-[var(--gray200)]"></div>
                                    )}
                                  </div>
                                );
                              })}
                            {order.cartItemToBackend.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-[var(--gray200)] flex items-center justify-center text-xs font-medium border border-white">
                                +{order.cartItemToBackend.length - 3}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer */}
                        <div className="flex flex-col">
                          <span className="font-medium">{order.name}</span>
                          <span className="text-xs text-gray-500">
                            {order.phoneNumber}
                          </span>
                        </div>

                        {/* Price */}
                        <div>
                          <div className="font-bold text-blue-600">
                            {formatPrice(order.totalPrice || 0)} ₮
                          </div>
                        </div>

                        {/* Process */}
                        <div>
                          <select
                            value={order?.process || "Захиалсан"}
                            onChange={(e) =>
                              handleProcessChange(order._id, e.target.value)
                            }
                            className="px-2 py-1 rounded-lg bg-gray-50 border border-[var(--gray200)] focus:ring-2 focus:ring-blue-500 w-full text-sm"
                          >
                            <option value="Захиалсан">Захиалсан</option>
                            <option value="Баталгаажсан">Баталгаажсан</option>
                            <option value="Хүргэгдсэн">Хүргэгдсэн</option>
                          </select>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleOrderDetails(order._id)}
                            className="p-2 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                order?._id &&
                                confirm("Та энэ захиалгыг устгах уу?")
                              ) {
                                deleteOrder(order._id);
                              }
                            }}
                            className="p-2 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedOrder === order._id && (
                        <div className="bg-gray-50 p-3 sm:p-4 lg:p-6 border-t border-gray-100">
                          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                            {/* Products Table */}
                            <div className="w-full lg:w-2/3">
                              <h3 className="font-semibold text-gray-700 mb-4 text-base">
                                Захиалсан бүтээгдэхүүн
                              </h3>

                              {/* Mobile Product List */}
                              <div className="block sm:hidden space-y-3">
                                {order.cartItemToBackend.map((item, idx) => {
                                  if (!isPopulatedProduct(item.productId)) {
                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white p-3 rounded-md shadow-sm text-gray-400 text-xs"
                                      >
                                        <p>Product data not available</p>
                                      </div>
                                    );
                                  }
                                  const product = item.productId;
                                  const salePrice =
                                    item?.sale && item?.sale > 0
                                      ? item.price * (1 - item.sale / 100)
                                      : item.price;
                                  return (
                                    <div
                                      key={idx}
                                      className="bg-white p-3 rounded-md shadow-sm"
                                    >
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                          {product.images?.length > 0 && (
                                            <img
                                              src={
                                                product.images[0].url ||
                                                "/api/placeholder/100/100"
                                              }
                                              alt={product.name}
                                              className="w-full h-full object-cover"
                                            />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-800 text-sm truncate">
                                            {product.name}
                                          </div>
                                          <div className="text-xs text-gray-500 space-x-2">
                                            <span>
                                              Хэмжээ: {item.selectedSize || "-"}
                                            </span>
                                            <span>
                                              Тоо: {item.quantity || 0}ш
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm font-medium text-gray-800">
                                            {formatPrice(salePrice)} ₮
                                          </div>
                                          {product.sale > 0 && (
                                            <div className="text-xs line-through text-gray-400">
                                              {formatPrice(item.price)} ₮
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Desktop/Tablet Product Table */}
                              <div className="hidden sm:block overflow-x-auto">
                                <div className="min-w-[500px]">
                                  <div className="grid grid-cols-[2fr_80px_80px_100px] gap-4 text-xs font-medium text-gray-500 px-2 mb-2">
                                    <div>Бүтээгдэхүүн</div>
                                    <div>Хэмжээ</div>
                                    <div>Тоо ширхэг</div>
                                    <div>Үнэ</div>
                                  </div>
                                  {order.cartItemToBackend.map((item, idx) => {
                                    if (!isPopulatedProduct(item.productId)) {
                                      return (
                                        <div
                                          key={idx}
                                          className="bg-white p-3 rounded-md shadow-sm text-gray-400 text-xs"
                                        >
                                          <p>Product data not available</p>
                                        </div>
                                      );
                                    }
                                    const product = item.productId;
                                    const salePrice =
                                      item?.sale && item?.sale > 0
                                        ? item.price * (1 - item.sale / 100)
                                        : item.price;
                                    return (
                                      <div
                                        key={idx}
                                        className="grid grid-cols-[2fr_80px_80px_100px] gap-4 items-center bg-white p-3 rounded-md shadow-sm text-sm mb-2"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            {product.images?.length > 0 && (
                                              <img
                                                src={
                                                  product.images[0].url ||
                                                  "/api/placeholder/100/100"
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                              />
                                            )}
                                          </div>
                                          <div className="font-medium text-gray-800 min-w-0">
                                            {product.name}
                                          </div>
                                        </div>
                                        <div>{item.selectedSize || "-"}</div>
                                        <div>{item.quantity || 0}ш</div>
                                        <div>
                                          <div className="text-gray-800 font-medium">
                                            {formatPrice(salePrice)} ₮
                                          </div>
                                          {product.sale > 0 && (
                                            <div className="text-xs line-through text-gray-400">
                                              {formatPrice(item.price)} ₮
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Order Total */}
                              <div className="bg-white p-4 rounded-md shadow-sm mt-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-700">
                                    Захиалгын дүн:
                                  </span>
                                  <div className="text-right">
                                    <div className="text-blue-600 font-bold text-lg">
                                      {formatPrice(
                                        calculateTotalPrice(
                                          order.cartItemToBackend
                                        ) + 5000
                                      )}{" "}
                                      ₮
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="w-full lg:w-1/3">
                              <h3 className="font-semibold text-gray-700 mb-4 text-base">
                                Хүргэлтийн мэдээлэл
                              </h3>
                              <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <User className="mt-1 w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-xs text-gray-500">
                                        Нэр
                                      </div>
                                      <p className="text-sm font-medium text-gray-700 break-words">
                                        {order.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Phone className="mt-1 w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-xs text-gray-500">
                                        Утасны дугаар
                                      </div>
                                      <p className="text-sm font-medium text-gray-700 break-words">
                                        {order.phoneNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Mail className="mt-1 w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-xs text-gray-500">
                                        Имэйл
                                      </div>
                                      <p className="text-sm font-medium text-gray-700 break-words">
                                        {order.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-xs text-gray-500">
                                        Хаяг дэлгэрэнгүй
                                      </div>
                                      <p className="text-sm font-medium text-gray-700 break-words">
                                        {order.delivery}
                                      </p>
                                    </div>
                                  </div>
                                  {order.info && (
                                    <div className="flex items-start gap-3">
                                      <Info className="mt-1 w-4 h-4 text-gray-500 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <div className="text-xs text-gray-500">
                                          Нэмэлт мэдээлэл
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 break-words">
                                          {order.info}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {orders.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 py-4 px-4">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Mobile pagination - show only current page and total */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
            </div>

            {/* Desktop pagination - show page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 7) {
                  pageNumber = i + 1;
                } else if (page <= 4) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                } else {
                  pageNumber = page - 3 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 rounded-lg border transition-colors text-sm ${
                      page === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
