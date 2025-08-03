import DbCard from "@/components/Dbcard";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import Queryresult from "@/components/queryresult";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Page() {

  return (
    <div className="h-screen">
      <AuroraBackground className="w-screen z-0 p-2 pb-4 rounded-b-2xl mb-6">
        <Header />
        <DbCard product={Dbproduct.product} />
        <Queryresult />

        <Footer />
      </AuroraBackground>
    </div>
  );
}

const Dbproduct = {
  "product": {
    "id": 1,
    "title": "apple iphone 16 pro",
    "popularity": 2,
    "createdAt": "2025-07-21T13:12:16.246Z",
    "updatedAt": "2025-08-03T10:35:37.954Z",
    "listings": [
      {
        "id": 2,
        "productId": 1,
        "platform": "IITI",
        "title": "Apple iPhone 16 Pro 1TB",
        "price": 289000,
        "imageUrl": "https://admin.itti.com.np/storage/product/apple-iphone-16-pro-1TBgb-price-nepal/thumb/183d055f-50d4-452a-87cf-ae1afe151bfb.jpeg",
        "url": "https://itti.com.np/product/apple-iphone-16-Pro-1TB-price-nepal",
        "scrapedAt": "2025-07-21T13:13:46.366Z"
      },
      {
        "id": 1,
        "productId": 1,
        "platform": "Hukut",
        "title": "Apple iPhone 16 Pro",
        "price": 168700,
        "imageUrl": "https://cdn.hukut.com/iphone-16-pro-desert-titanium.webp1728297752349",
        "url": "https://hukut.com/iphone-16-pro",
        "scrapedAt": "2025-07-21T13:13:46.374Z"
      },
      {
        "id": 4,
        "productId": 1,
        "platform": "Daraz",
        "title": "Apple iPhone 16 Pro Max - EvoStore",
        "price": 206999,
        "imageUrl": "https://img.drz.lazcdn.com/static/np/p/37432a92fe555203ea401a732c132f96.jpg_200x200q80.avif",
        "url": "https://www.daraz.com.np/products/apple-iphone-16-pro-max-evostore-i159948477.html",
        "scrapedAt": "2025-07-21T13:13:46.391Z"
      }
    ]
  },
  "recommendedProducts": [
    {
      "id": 5,
      "title": "apple iphone 15",
      "similarity": 0.23605170797123207
    }
  ]
};
