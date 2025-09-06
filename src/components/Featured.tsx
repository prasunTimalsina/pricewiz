"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

interface Listing {
  id: number;
  platform: string;
  title: string;
  price: number;
  imageUrl: string;
  url: string;
}

interface Product {
  id: number;
  title: string;
  listings: Listing[];
}

const ProductCard = ({
  product,
  isActive,
  onClick,
  listingIndex,
}: {
  product: Product;
  isActive: boolean;
  onClick: () => void;
  listingIndex: number;
}) => {
  const listing = product.listings[listingIndex % product.listings.length];

  // Return null if listing doesn't exist
  if (!listing) {
    console.warn("No listing found for product:", product.title);
    return null;
  }

  return (
    <a
      href={`/product/detail/${product.id}`}
      className="relative w-64 h-[400px] overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl flex-shrink-0"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-white bg-contain bg-no-repeat bg-center transition-transform duration-500"
        style={{ backgroundImage: `url(${listing.imageUrl})` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
        <div className="text-xs font-medium text-gray-300 mb-1">
          {listing.platform}
        </div>
        <h3 className="text-2xl font-bold mb-2 line-clamp-2">
          {listing.title}
        </h3>
        <div className="text-3xl font-bold text-white mb-3">
          Rs {listing.price}
        </div>
        <h3 className="text-lg font-bold mb-1 line-clamp-2">{listing.title}</h3>
        <div className="text-xl font-bold text-white">Rs {listing.price}</div>
      </div>

      {isActive && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-20" />
      )}
    </a>
  );
};

const ProductContent = ({
  product,
  listingIndex,
}: {
  product: Product;
  listingIndex: number;
}) => {
  const listing = product.listings[listingIndex % product.listings.length];

  // Return null if listing doesn't exist
  if (!listing) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 mb-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {listing.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Buy the {product.title} from {listing.platform} for just Rs{" "}
              {listing.price}.
            </p>
            <div className="mt-8">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                Rs {listing.price}
              </div>
              <a
                href={`/product/detail/${product.id}`}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200"
              >
                Visit Product
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full h-80">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="w-full h-80 object-contain rounded-2xl shadow-2xl"
              />
            </div>
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-72 object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [listingIndices, setListingIndices] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const cardWidth = 256 + 16; // card width + gap
      const containerWidth = scrollRef.current.clientWidth;
      const scrollLeft = index * cardWidth - containerWidth / 2 + cardWidth / 2;
      const scrollLeft = index * cardWidth - containerWidth / 2 + cardWidth / 2;
      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("api/feature-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: [1, 6, 11, 20, 26, 12, 25] }),
        });

      const data = await res.json();
      setProducts(data);
      setListingIndices(Array(data.length).fill(0));
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setListingIndices((prev) =>
        prev.map((idx, i) =>
          products[i]?.listings.length
            ? (idx + 1) % products[i].listings.length
            : 0
        )
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="w-full py-2 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Featured Products
        </h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Discover real-time deals from trusted online stores
        </p>
      </div>

      <div className="w-screen overflow-x-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products
            .filter(
              (product) =>
                product && product.listings && product.listings.length > 0
            )
            .map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isActive={index === activeIndex}
                onClick={() => scrollToCard(index)}
                listingIndex={listingIndices[index] || 0}
              />
            ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === activeIndex
                ? "bg-blue-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === activeIndex
                ? "bg-blue-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {products[activeIndex] &&
        products[activeIndex].listings &&
        products[activeIndex].listings.length > 0 && (
          <ProductContent
            product={products[activeIndex]}
            listingIndex={listingIndices[activeIndex] || 0}
          />
        )}
    </div>
  );
}
