"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TrackListingPopup from "./TrackListing";
import BellIcon from "./BellIcon";
import DbCard from "./Dbcard";
import Image from "next/image";

interface Listing {
  id: number;
  productId: number;
  platform: string;
  title: string;
  price: number;
  imageUrl: string;
  url: string;
  scrapedAt: string;
}

interface Product {
  id: number;
  title: string;
  popularity: number;
  createdAt: string;
  updatedAt: string;
  listings: Listing[];
}

type RecommendedProduct = Product;

interface ProductResponse {
  product: Product;
  recommendedProducts: RecommendedProduct[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [trackingListing, setTrackingListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        setProductData(data);
        console.log("data from api", data);

        if (data?.product?.listings?.[0]) {
          setSelectedListing(data.product.listings[0]);
        }
      } catch (err) {
        console.error("Error fetching product data", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!productData) return <div>Loading...</div>;

  const { product, recommendedProducts } = productData;

  const uniquePlatforms = Array.from(
    new Set(product.listings.map((l) => l.platform))
  );

  return (
    <div className="flex flex-col w-full px-6 z-10 items-center ">
      <section className="min-h-fit flex flex-col md:flex-row gap-6 py-10">
        <div className="md:w-1/2 flex items-center">
          <div className="flex flex-col gap-3 mt-4 flex-wrap p-6">
            {product.listings.map((listing) => (
              <div
                key={listing.id}
                className={`w-20 h-20 border rounded cursor-pointer ${
                  selectedListing?.imageUrl === listing.imageUrl
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedListing(listing)}
              >
                <Image
                  src={listing.imageUrl}
                  alt="Thumbnail"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          <div className="w-[500px] h-[500px] border rounded overflow-hidden flex items-center justify-center">
            {selectedListing && (
              <div className="relative w-full h-full">
                <Image
                  src={selectedListing.imageUrl}
                  alt="Selected product"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-start gap-4">
          <h1 className="text-5xl font-extrabold mt-8 mb-6 text-left">
            {product.title}
          </h1>
          {selectedListing && (
            <>
              <h2 className="text-3xl font-semibold text-gray-700">
                {selectedListing.title.toLocaleString()}
              </h2>

              <div className="flex">
                <p className="text-3xl font-semibold text-gray-700">
                  Rs. {selectedListing.price.toLocaleString()}
                </p>

                <button
                  onClick={() => {
                    setTrackingListing(selectedListing);
                    setIsPopupOpen(true);
                  }}
                  className="text-black text-sm font-medium py-1 px-3 rounded-lg hover:scale-105 transition w-fit"
                >
                  <BellIcon />
                </button>
              </div>

              <div className=" text-md text-gray-500">
                Available on:
                <ul className="list-disc ml-6 mt-1">
                  {uniquePlatforms.map((platform, i) => (
                    <li key={i}>{platform}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="w-full py-10 border-t ml-[900px]">
        <h2 className="text-2xl font-bold mb-4">Available Listings</h2>
        <div className="flex flex-col gap-4">
          {product.listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center gap-4 p-4 border rounded hover:bg-gray-50 transition w-1/2"
            >
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                width={100}
                height={100}
                className="object-contain w-24 h-24"
              />
              <div className="flex flex-col">
                <a
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-black hover:underline"
                >
                  {listing.title}
                </a>
                <div className="flex">
                  <span className="text-md text-gray-600 mr-[70px]">
                    Rs. {listing.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => {
                      setTrackingListing(selectedListing);
                      setIsPopupOpen(true);
                    }}
                    className="text-black text-sm font-medium py-1 px-3 rounded-lg hover:scale-105 transition w-fit"
                  >
                    <BellIcon />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Sold by {listing.platform}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-10 border-t">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Recommended products
        </h2>
        <ul className="flex flex-wrap justify-center">
          {recommendedProducts.map((rec) => (
            <div className="justify-center gap-y-6 px-4 mb-10">
              <DbCard key={rec.id} product={rec} />
            </div>
          ))}
        </ul>
      </section>

      {trackingListing && (
        <TrackListingPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          listing={trackingListing}
        />
      )}
    </div>
  );
};

export default ProductDetail;
