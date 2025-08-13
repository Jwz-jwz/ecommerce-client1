import ProductByCategory from "@/components/listing/ProductByCategory";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <ProductByCategory />
      <Footer />
    </div>
  );
}
