"use client";

import React, { useState, useRef, useEffect } from "react";

interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

const ProductCard = ({
  product,
  isActive,
  onClick,
}: {
  product: Product;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="relative w-80 h-[460px] overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl flex-shrink-0"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{ backgroundImage: `url(${product.img})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
        <div className="text-sm font-medium text-gray-300 mb-2">
          {product.site}
        </div>
        <h3 className="text-2xl font-bold mb-2 line-clamp-2">{product.title}</h3>
        <div className="text-3xl font-bold text-white mb-3">Rs {product.price}</div>
      </div>

      {isActive && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-20" />
      )}
    </div>
  );
};

const ProductContent = ({ product }: { product: Product; }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 mb-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Buy the {product.title} from {product.site} for just Rs{" "}
              {product.price}.
            </p>
            <div className="mt-8">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                Rs {product.price}
              </div>
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200"
              >
                Visit Product
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={product.img}
              alt={product.title}
              className="w-full h-80 object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export function FeaturedProductsCarousel({ products }: { products: Product[]; }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const cardWidth = 336;
      const containerWidth = scrollRef.current.clientWidth;
      const scrollLeft =
        index * cardWidth - containerWidth / 2 + cardWidth / 2;
      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="w-full py-2 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Featured Products
        </h2>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
          Discover real-time deals from trusted online stores
        </p>
      </div>

      {/* Full-width Carousel */}
      <div className="w-screen overflow-x-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-4 scrollbar-hide pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              isActive={index === activeIndex}
              onClick={() => scrollToCard(index)}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-8">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === activeIndex
              ? "bg-blue-600 w-8"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
          />
        ))}
      </div>

      {/* Product Detail Section */}
      <div className="transition-all duration-500">
        <ProductContent product={products[activeIndex]} />
      </div>
    </div>
  );
}

