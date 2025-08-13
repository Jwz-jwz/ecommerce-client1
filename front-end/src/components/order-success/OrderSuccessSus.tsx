import { Suspense } from "react";
import OrderSuccessPage from "./OrderSuccess";

export default function OrderSuccessSus() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <OrderSuccessPage />
    </Suspense>
  );
}
