import Header from "@/components/ui/Header";
import AddCategories from "@/components/products/AddCategories";
import CategoryDisplay from "@/components/products/FetchedCategory";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth(); // ✅ await auth()

  // If user is not authenticated, redirect to the Clerk sign-in page
  if (!userId) {
    return redirect("/sign-in?redirect_url=/checkout"); // Ensure this URL is correct
  }
  return (
    <div className="w-full  min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 md:min-h-screen">
          <Header />
        </div>

        <div className="w-full flex-1 px-4 pt-6">
          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column: Add Categories */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700 p-6 rounded-lg bg-white shadow-sm">
                ➕ Ангилал үүсгэх
              </h2>
              <div className="h-full">
                <AddCategories />
              </div>
            </div>

            {/* Right column: Category Display */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700  p-6 rounded-lg bg-white shadow-sm">
                Одоогийн ангилалууд
              </h2>
              <div className="h-full">
                <CategoryDisplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
