import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useProductContext } from "@/context/ProductContext";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Anchor = "right";

export default function ShoppingCartDrawer() {
  const { cartItems, removeFromCart, updateCartItemQuantity } =
    useProductContext();

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleCheckout = () => {
    if (isSignedIn) {
      router.push("/checkout");
    } else {
      toast.warning("Та эхлээд сайтад нэвтэрнэ үү.");
      openSignIn(); // This will redirect to Clerk’s sign-in page/modal
    }
  };

  const calculateDiscountedPrice = (price: number, sale?: number) => {
    if (sale && price) {
      const discount = (price * sale) / 100;
      return Math.floor(price - discount);
    }
    return price;
  };

  // Calculate original price total
  const originalTotal = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Calculate discounted price total
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

  //   if (cartItems.length === 0) {
  //     return (
  //       <div className="container h-screen mx-auto px-4 py-16 text-center">
  //         <h2 className="text-2xl font-semibold mb-6">Таны сагс хоосон байна</h2>

  //         <p className="text-gray-500 mb-8">
  //           Та сагсанд бүтээгдэхүүн нэмээгүй байна
  //         </p>
  //         <Link
  //           href="/product-listing"
  //           className="inline-block bg-[var(--gray200)] text-gray-600 px-6 py-2 rounded-sm hover:bg-[var(--gray200)]"
  //         >
  //           Бүтээгдэхүүн үзэх
  //         </Link>
  //       </div>
  //     );
  //   }
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      setState({ ...state, [anchor]: open });
    };

  return (
    <div>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <button
            title="Сагс"
            className="!flex !justify-center !items-center !text-[14px] gap-2  !leading-[20px] !font-[700] !text-black !text-align hover:cursor-pointer"
            onClick={toggleDrawer(anchor, true)}
          >
            <div
              className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              {cartItems && cartItems.length > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[var(--pink500)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems?.length}
                </span>
              ) : null}
            </div>
            {/* <p className="text-center ">Сагс</p> */}
          </button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            className="!w-[586px]  !flex !flex-col !h-full"
          >
            <div className="flex flex-col gap-8 justify-between h-full p-6">
              {/* Cart Items */}
              <div className="w0full max-w-xl">
                <h2 className="text-xl font-bold pb-4 border-b">Таны сагс</h2>

                {cartItems?.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedSize?.size}`}
                    className="flex py-6 border-b"
                  >
                    {item.images && item.images.length > 0 ? (
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item?.images[0].url}
                          alt={item?.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        {/* <span className="text-gray-400 text-xs">No image</span> */}
                      </div>
                    )}

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {item.name}
                          </h3>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">
                              Size: {item.selectedSize.size}
                            </p>
                          )}
                          <div className="flex items-center gap-2 my-1">
                            {item?.sale ? (
                              <>
                                <span className="text-sm font-medium text-gray-900">
                                  {calculateDiscountedPrice(
                                    item?.price,
                                    item?.sale
                                  )?.toLocaleString()}
                                  ₮
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  {item.price?.toLocaleString()}₮
                                </span>
                                <span className="text-xs text-[var(--pink500)]">
                                  (-{item.sale}%)
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-medium text-gray-900">
                                {item.price?.toLocaleString() || "N/A"}₮
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="p-1 hover:cursor-pointer"
                          onClick={() =>
                            removeFromCart(item?._id, item?.selectedSize)
                          }
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            className="p-1 hover:cursor-pointer"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateCartItemQuantity(
                                  item._id,
                                  -1,
                                  item?.selectedSize
                                );
                              }
                            }}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            className="p-1 hover:cursor-pointer"
                            onClick={() => {
                              if (item?.sizes?.length && item.selectedSize) {
                                if (
                                  item.quantity >=
                                  (item.selectedSize.stock || 0)
                                ) {
                                  toast.warning(
                                    "Захиалгын хэмжээ нөөцөөс хэтэрсэн байна!"
                                  );
                                  return;
                                }
                              } else if (
                                !item?.sizes?.length &&
                                item?.stock &&
                                item?.stock === 0
                              ) {
                                if (item.quantity >= (item?.stock || 0)) {
                                  toast.warning(
                                    "Захиалгын хэмжээ нөөцөөс хэтэрсэн байна!"
                                  );
                                  return;
                                }
                              }

                              updateCartItemQuantity(
                                item._id,
                                1,
                                item?.selectedSize
                              );
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-right font-medium">
                          {(
                            (item.sale
                              ? calculateDiscountedPrice(item.price, item.sale)
                              : item.price) * item.quantity
                          ).toLocaleString()}
                          ₮
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-full">
                <div className="rounded-lg border border-[var(--gray200)] p-2">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-[var(--gray600)]">Захиалгын дүн:</p>
                      <p className="font-medium">
                        {originalTotal.toLocaleString()} ₮
                      </p>
                    </div>

                    {/* Display discount amount - only if there is a discount */}
                    {totalDiscount > 0 && (
                      <div className="flex justify-between">
                        <p className="text-[var(--gray600)]">Хямдрал:</p>
                        <p className="font-medium text-[var(--pink500)]">
                          -{totalDiscount.toLocaleString()} ₮
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <p className="text-[var(--gray600)]">
                        Хүргэлтийн төлбөр:
                      </p>
                      <p>{shipping.toLocaleString()} ₮</p>
                    </div>

                    <div className="h-px bg-[var(--gray200)] my-4"></div>

                    <div className="flex justify-between font-bold">
                      <p className="font-xl">Нийт төлбөрийн дүн:</p>
                      <p className="font-xl">{total.toLocaleString()} ₮</p>
                    </div>

                    {totalDiscount > 0 && (
                      <div className="bg-pink-100 p-3 rounded-md mt-2">
                        <p className="text-[var(--pink500)] text-sm font-medium">
                          Та нийт {totalDiscount.toLocaleString()}₮ хэмнэлээ
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleCheckout}
                      className="block w-full bg-[var(--gray200)] text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-[var(--gray200)] hover:cursor-pointer my-4 text-center"
                    >
                      Захиалах
                    </button>

                    <Link
                      href="/"
                      className="w-full text-center py-2 text-sm underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
