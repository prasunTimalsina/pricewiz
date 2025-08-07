"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        setProductData(data);
        console.log("data from api", data);

        if (data?.product?.listings?.[0]?.imageUrl) {
          setSelectedImage(data.product.listings[0].imageUrl);
        }
      } catch (err) {
        console.error("Error fetching product data", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!productData) return <div>Loading...</div>;

  const { product, recommendedProducts } = productData;

  return (
    <div className="flex flex-col w-full px-6">
      {/* SECTION 1: Main product image + info */}
      <section className="min-h-screen flex flex-col md:flex-row gap-6 py-10">
        {/* Left: Product title, price, platforms */}
        <div className="md:w-1/2 flex flex-col justify-center gap-4">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold text-gray-700">
            Rs. {product.listings[0]?.price.toLocaleString()}
          </p>
          <div className="text-md text-gray-500">
            Available on:
            <ul className="list-disc ml-6 mt-1">
              {product.listings.map((listing) => (
                <li key={listing.id}>{listing.platform}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md aspect-square border rounded overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage}
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
                className={`w-20 h-20 border rounded cursor-pointer ${selectedImage === listing.imageUrl ? "ring-2 ring-blue-500" : ""
                  }`}
                onClick={() => setSelectedImage(listing.imageUrl)}
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
      </section>

      <section className="w-full py-10 border-t">
        <h2 className="text-2xl font-bold mb-4">Available Listings</h2>
        <div className="flex flex-col gap-4">
          {product.listings.map((listing) => (
            <a
              key={listing.id}
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
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
                <span className="text-lg font-semibold">{listing.title}</span>
                <span className="text-md text-gray-600">Rs. {listing.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Sold by {listing.platform}</span>
              </div>
            </a>
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
    </div>
  );
};

export default ProductDetail;

