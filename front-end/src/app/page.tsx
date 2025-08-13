import HomePage from "@/components/homepage/HomePage";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-between ">
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
}
