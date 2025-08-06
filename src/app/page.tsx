//"use client";
import Catagory from "@/components/Catagory";
import { FeaturedProductsCarousel } from "@/components/Featured";
import HomeSearchbar from "@/components/HomeSearchbar";
import Seasonal from "@/components/Sesonal";
import Footer from "@/components/footer";


export default function Page() {

  return (
    <>
      <div className="flex-row justify-center items-center mt-10">
        <HomeSearchbar />
        <FeaturedProductsCarousel />
        <Catagory />
        <Seasonal />
        <Footer />
      </div>
    </>
  );
}


