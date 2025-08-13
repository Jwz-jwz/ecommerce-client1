import AboutUs from "@/components/about-us/AboutUs";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <AboutUs />
      <Footer />
    </div>
  );
}
