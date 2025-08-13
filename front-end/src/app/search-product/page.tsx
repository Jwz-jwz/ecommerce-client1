"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import SearchProductPage from "@/components/search/SearchProductPage";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <SearchProductPage />
      <Footer />
    </div>
  );
}
