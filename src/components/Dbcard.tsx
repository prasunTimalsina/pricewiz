'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";

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

export default function DbCard({ product }: { product: Product; }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listings = product.listings;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % listings.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [listings.length]);

  const currentListing = listings[currentIndex];

  return (
    <Link
      href={`/product/detail/${product.id}`}>
      <div
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-2xl transition-transform duration-300 transform hover:scale-105
        w-[260px] h-[400px] bg-white flex-shrink-0"
        style={{
          boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img
            key={currentListing.id}
            src={currentListing.imageUrl}
            alt={currentListing.title}
            className="w-full h-full object-contain transition-opacity duration-500 ease-in-out opacity-100"
          />
        </div>

        <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

        <div className="absolute bottom-0 z-20 p-4 w-full text-white">
          <h3 className="text-lg font-bold leading-tight mb-1 line-clamp-2">
            {product.title}
          </h3>
          <div className="text-sm italic mb-2">
            {currentListing.title}
          </div>
          <div className="text-xl font-extrabold mb-1">
            Rs {currentListing.price.toLocaleString()}
          </div>
          <p className="text-sm text-gray-200">{currentListing.platform}</p>
        </div>
      </div>
    </Link>
  );
}

