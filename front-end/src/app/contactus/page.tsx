import ContactUs from "@/components/contuct-us/ContactUs";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <ContactUs />
      <Footer />
    </div>
  );
}
