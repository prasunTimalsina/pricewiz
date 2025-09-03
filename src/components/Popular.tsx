"use client";

import { useEffect, useState } from "react";
import DbCard from "./Dbcard";
import SkeletonCard from "./Skeletoncard";

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

async function fetchPopularProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/popular-products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch popular products");
  }

  const data = await res.json();
  return data.products;
}

export default function Popular() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPopularProducts()
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-6 px-4 py-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%] xl:w-[18%] flex justify-center"
          >
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        No popular products found.
      </p>
    );
  }

  return (
    <>
      <h2 className="text-4xl md:text-6xl font-bold text-left mb-6 ml-[5%] text-gray-900 dark:text-white">
        Popular Products
      </h2>
      <div className="flex flex-wrap justify-center gap-y-6 px-4 mb-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%] xl:w-[18%] flex justify-center"
          >
            <DbCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
}

