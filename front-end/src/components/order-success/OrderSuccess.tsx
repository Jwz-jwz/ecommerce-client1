"use client";
import { useSearchParams } from "next/navigation";
import { CircleCheck } from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const total = searchParams.get("total");
  const name = searchParams.get("name");

  // Format the price with commas
  const formatPrice = (price: string | null) => {
    if (!price) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex flex-col items-center justify-center py-15 md:py-18  px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 max-w-md w-full text-center">
        <CircleCheck className="text-green-500 w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
        <h1 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
          Эрхэм хэрэглэгч, {name}!
        </h1>
        <p className="text-[var(--gray600)] mb-6">
          Таны захиалга амжилттай илгээгдлээ. 🎉🎉🎉 Төлбөрийн мэдээллийг доорх
          хэсгээс шалгана уу.
        </p>

        <div className="bg-gray-100 rounded-lg p-4 text-left">
          <p className="mb-2">
            <span className="font-medium">💳 Дансны дугаар:</span> 123456789
          </p>
          <p className="mb-2">
            <span className="font-medium">🏦 Банк:</span> Голомт банк
          </p>
          <p className="mb-2">
            <span className="font-medium">👤 Хүлээн авагч:</span> Cozy Home LLC
          </p>
          <p className="mb-2">
            <span className="font-medium">💰 Төлөх дүн:</span>{" "}
            <span className="text-red-500 font-semibold">
              {formatPrice(total)} ₮
            </span>
          </p>
          <p className="mb-2">
            <span className="font-medium">📒 Гүйлгээний утга:</span> Нэр, утасны
            дугаараа оруулна уу
          </p>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Манайхыг сонгон үйлчлүүлсэн танд Баярлалаа! Дараа дахин үйлчлүүлээрэй
          😊.
        </p>
      </div>
    </div>
  );
}
