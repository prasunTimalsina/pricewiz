import Footer from "@/components/footer";
import Header from "@/components/Header";
import Popular from "@/components/Popular";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Page() {

  return (
    <div className="h-screen">
      <AuroraBackground className="w-screen z-0 p-2 pb-4 rounded-b-2xl mb-6">
        <Header />
        <Popular />
        <Footer />
      </AuroraBackground>
    </div>
  );
}

