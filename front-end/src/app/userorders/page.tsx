import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import UserOrders from "@/components/userOrders/UserOrders";

export default async function Home() {
  const { userId } = await auth(); // ✅ await auth()

  // If user is not authenticated, redirect to the Clerk sign-in page
  if (!userId) {
    return redirect("/sign-in?redirect_url=/checkout"); // Ensure this URL is correct
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <UserOrders />
      <Footer />
    </div>
  );
}
