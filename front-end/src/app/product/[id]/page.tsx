"use client";

import Header from "@/components/ui/Header";
import ProductInfo from "@/components/product/ProductInfo";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <ProductInfo />
      <Footer />
    </div>
  );
}
