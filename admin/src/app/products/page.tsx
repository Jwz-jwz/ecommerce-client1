import AdminProduct from "@/components/products/Products";
import Header from "@/components/ui/Header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth(); // ✅ await auth()

  // If user is not authenticated, redirect to the Clerk sign-in page
  if (!userId) {
    return redirect("/sign-in?redirect_url=/checkout"); // Ensure this URL is correct
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Header as sidebar - will take full screen height */}
        <div className="w-full md:w-64 shadow-md bg-white">
          <Header />
        </div>

        {/* Main content area */}
        <div className="w-full flex-1 px-4">
          <AdminProduct />
        </div>
      </div>
    </div>
  );
}
