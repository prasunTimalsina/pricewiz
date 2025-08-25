"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TrackListingPopup from "./TrackListing";

interface Listing {
  id: number;
  productId: number;
  platform: string;
  title: string;
  price: number;
  imageUrl: string;
  url: string;
}

interface Product {
  id: number;
  title: string;
  popularity: number;
  createdAt: string;
  updatedAt: string;
  listings: Listing[];
}

interface RecommendedProduct {
  id: number;
  title: string;
  similarity: number;
}

interface ProductResponse {
  product: Product;
  recommendedProducts: RecommendedProduct[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Popup state
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
    <div className="flex flex-col w-full px-6 z-10">
      <section className="min-h-fit flex flex-col md:flex-row gap-6 py-10">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md aspect-square border rounded overflow-hidden">
            {selectedListing && (
              <img
                src={selectedListing.imageUrl}
                alt="Selected product"
                width={500}
                height={500}
                className="object-contain w-full h-full"
              />
            )}
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            {product.listings.map((listing) => (
              <div
                key={listing.id}
                className={`w-20 h-20 border rounded cursor-pointer ${selectedListing?.imageUrl === listing.imageUrl
                  ? "ring-2 ring-blue-500"
                  : ""
                  }`}
                onClick={() => setSelectedListing(listing)}
              >
                <img
                  src={listing.imageUrl}
                  alt="Thumbnail"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-start gap-4">
          <h1 className="text-5xl font-extrabold mt-8 mb-6 text-left">
            {product.title}
          </h1>
          {selectedListing && (
            <>
              <p className="text-3xl font-semibold text-gray-700">
                Rs. {selectedListing.price.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  setTrackingListing(selectedListing);
                  setIsPopupOpen(true);
                }}
                className="mt-2 bg-[#E6E6E9] text-black text-sm font-medium py-1 px-3 rounded-lg hover:bg-[#9999A1] transition w-fit"
              >
                Track this Listing
              </button>
            </>
          )}
          <div className="text-md text-gray-500">
            Available on:
            <ul className="list-disc ml-6 mt-1">
              {uniquePlatforms.map((platform, i) => (
                <li key={i}>{platform}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full py-10 border-t">
        <h2 className="text-2xl font-bold mb-4">Available Listings</h2>
        <div className="flex flex-col gap-4">
          {product.listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center gap-4 p-4 border rounded hover:bg-gray-50 transition"
            >
              <img
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
                <span className="text-md text-gray-600">
                  Rs. {listing.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  Sold by {listing.platform}
                </span>

                <button
                  onClick={() => {
                    setTrackingListing(listing);
                    setIsPopupOpen(true);
                  }}
                  className="mt-2 bg-[#E6E6E9] text-black text-sm font-medium py-1 px-3 rounded-lg hover:bg-[#9999A1] transition w-fit"
                >
                  Track this Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-10 border-t">
        <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
        <ul className="list-disc ml-6">
          {recommendedProducts.map((rec) => (
            <li key={rec.id}>{rec.title}</li>
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

