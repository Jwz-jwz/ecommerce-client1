"use client";
import { useProductContext } from "@/context/ProductContext";
import { useAuth, useUser } from "@clerk/nextjs";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

type TCartItems = {
  productId: string;
  selectedSize: string | undefined; // Make it optional
  quantity: number;
  price: number;
  sale?: number;
};

type TOrderProduct = {
  name: string;
  totalPrice: string;
  phoneNumber: string;
  email: string;
  delivery: string;
  info: string;
  cartItemToBackend: TCartItems[];
};

const Checkout = () => {
  const { cartItems, clearCart } = useProductContext();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const cartItemsForBackend = cartItems.map((item) => ({
    productId: item._id || item._id,
    selectedSize: item?.selectedSize?.size || "", // Provide default empty string
    quantity: item.quantity,
    price: item.price,
    sale: item.sale,
  }));
  // Calculate original price total
  const originalTotal = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Calculate discounted price total
  const calculateDiscountedPrice = (price: number, sale?: number) => {
    if (sale && price) {
      const discount = (price * sale) / 100;
      return Math.floor(price - discount);
    }
    return price;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.sale
      ? calculateDiscountedPrice(item.price, item.sale)
      : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Calculate total discount amount
  const totalDiscount = originalTotal - subtotal;

  const shipping = 5000; // or whatever static/dynamic logic you use
  const total = subtotal + shipping;

  const validationSchema = Yup.object({
    name: Yup.string().required("Захиалагчийн нэрийг заавал оруулна уу"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{8}$/, "Утасны дугаар 8 оронтой байх ёстой")
      .required("Утасны дугаарыг заавал оруулна уу"),
    email: Yup.string()
      .email("Зөв имэйл хаягийг оруулна уу")
      .required("Имэйл хаягийг заавал оруулна уу"),
    delivery: Yup.string().required("Хүргэлтийн хаягийг заавал оруулна уу"),
  });

  const formik = useFormik<TOrderProduct>({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      delivery: "",
      info: "",
      cartItemToBackend: cartItemsForBackend,
      totalPrice: total.toString(),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setSubmitError("");

        const token = await getToken();
        const orderRequestData = {
          ...values,
          totalPrice: total.toString(),
        };

        const response = await fetch(`${API_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderRequestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Захиалга үүсгэхэд алдаа гарлаа"
          );
        }

        // Order successful
        clearCart();

        // ✅ Redirect AFTER successful response
        router.push(
          `/order-success?total=${total}&name=${encodeURIComponent(
            values.name
          )}`
        );
      } catch (error) {
        console.error("Order submission error:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Захиалга үүсгэхэд алдаа гарлаа"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleOrderSubmit = async () => {
    await formik.handleSubmit();

    // After successful form submission, navigate to success page
    // router.push(
    //   `/order-success?total=${formik.values.totalPrice}&name=${formik.values.name}`
    // );
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 my-12">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Захиалга баталгаажуулах
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Shipping Address Form */}
        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
              Хүргэлтийн мэдээлэл
            </h2>

            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Захиалагчийн нэр
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                placeholder="Овог Нэр"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>

            <div className="mb-5">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Утасны дугаар
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                required
                placeholder="99112233"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Имэйл
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                required
                placeholder="example@gmail.com"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="mb-5">
              <label
                htmlFor="delivery"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Хүргэлтийн хаяг (дэлгэрэнгүй)
              </label>
              <textarea
                id="delivery"
                name="delivery"
                value={formik.values.delivery}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                required
                placeholder="Дүүрэг, хороо, байр, хотхон, орц, давхар, тоот, орцны код ..."
                rows={3}
              />
              {formik.touched.delivery && formik.errors.delivery ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.delivery}
                </div>
              ) : null}
            </div>

            <div className="mb-5">
              <label
                htmlFor="info"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Нэмэлт мэдээлэл
              </label>
              <textarea
                id="info"
                name="info"
                value={formik.values.info}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                placeholder="Бидэнд мэдэгдэх нэмэлт мэдээлэл байвал оруулна уу ..."
                rows={3}
              />
            </div>
          </form>
        </div>

        {/* Right side - Order Summary */}
        <div className="w-full lg:w-2/5">
          <div className="rounded-lg border border-[var(--gray200)] p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6 pb-2 border-b">
              Таны захиалга
            </h2>

            {/* Products */}
            <div className="mb-6">
              {cartItems.length > 0 ? (
                <>
                  {/* Product Images - Flex row with scrollbar */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                      {cartItems.map((item, index) => (
                        <div
                          key={`img-${item?._id || item?._id}-${index}`}
                          className="flex-shrink-0 flex-col gap-1"
                        >
                          {item?.images && item?.images[0]?.url ? (
                            <div className="h-18 w-18 overflow-hidden rounded-md bg-gray-100 border border-[var(--gray200)] relative group">
                              <img
                                src={
                                  typeof item.images[0].url === "string"
                                    ? item.images[0].url
                                    : item.images[0].url[0]
                                }
                                alt={item?.name}
                                className="h-full w-full object-cover object-center"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50 text-black text-[10px] py-[2px] opacity-100 group-hover:opacity-100 transition-opacity text-center">
                                x{item.quantity}
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 w-16 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-md border border-[var(--gray200)]">
                              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                            </div>
                          )}
                          <div className="w-full mt-2">
                            <div className="flex justify-between items-start">
                              {item.selectedSize && (
                                <p className="text-xs text-gray-500">
                                  Size: {item.selectedSize.size}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  Сагсанд бүтээгдэхүүн байхгүй байна
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Захиалгын дүн:</span>
                <span>{originalTotal.toLocaleString()} ₮</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Хямдрал:</span>
                  <span className="text-red-500">
                    -{totalDiscount.toLocaleString()} ₮
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-700">
                <span>Хүргэлтийн төлбөр:</span>
                <span>{shipping.toLocaleString()} ₮</span>
              </div>

              <div className="h-px bg-[var(--gray200)] my-4"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>Нийт дүн: </span>
                <span>{total.toLocaleString()} ₮</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Төлбөрийн хэлбэр</h3>
              <div className="flex gap-3 mb-3">
                <div className="border border-gray-600 rounded-md p-3 flex items-center gap-2 cursor-pointer transition w-full">
                  <input
                    type="radio"
                    id="payment-card"
                    name="payment"
                    className="accent-gray-600"
                    defaultChecked
                  />
                  <label htmlFor="payment-card" className="cursor-pointer">
                    Дансаар шилжүүлэх
                  </label>
                </div>
              </div>
            </div>

            {/* Error message */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {submitError}
              </div>
            )}

            {/* Place Order Button */}
            <button
              type="button"
              onClick={handleOrderSubmit}
              disabled={isSubmitting || cartItems.length === 0}
              className={`w-full ${
                isSubmitting || cartItems.length === 0
                  ? "bg-[var(--gray200)] cursor-not-allowed"
                  : "bg-gray-800 text-white border-gray-800  "
              }  font-medium py-3 px-4 rounded-md transition-colors duration-300 focus:outline-none  focus:ring-gray-800  hover:cursor-pointer`}
            >
              {isSubmitting ? "Захиалж байна..." : "Захиалга баталгаажуулах"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
