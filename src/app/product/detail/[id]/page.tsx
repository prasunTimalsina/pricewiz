import Footer from "@/components/footer";
import Header from "@/components/Header";
import ProductDetail from "@/components/ProductdetailScreen";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Page() {

  return (
    <div className="h-screen">
      <AuroraBackground className="w-screen z-0 p-2 pb-4 rounded-b-2xl mb-6">
        <Header />
        <ProductDetail />
        <Footer />
      </AuroraBackground>
    </div>
  );
}

