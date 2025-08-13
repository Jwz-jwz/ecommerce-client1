import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Checkout from "@/components/checkout/CheckOutPage";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default async function CheckoutPage() {
  const { userId } = await auth(); // ✅ await auth()

  // If user is not authenticated, redirect to the Clerk sign-in page
  if (!userId) {
    return redirect("/sign-in?redirect_url=/checkout"); // Ensure this URL is correct
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <Checkout />
      <Footer />
    </div>
  );
}
