"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "./card";
import SkeletonCard from "./Skeletoncard";

interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

async function fetchProducts(query: string): Promise<Product[]> {

  const res = await fetch("/api/all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const [_, decproducts] = await res.json();
  return decproducts as Product[];
}

export default function Queryresult() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetchProducts(query)
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  if (!query)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Please enter a search term.
      </p>
    );

  if (loading)
    //return (
    //  <div className="flex justify-center items-center h-64">
    //    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900 dark:border-gray-100"></div>
    //  </div>
    //);
    return (
      <>
        <h2 className="text-4xl md:text-6xl font-bold text-left mb-6 ml-[5%] text-gray-900 dark:text-white">
          Scraping live Products for you ...
        </h2>
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
      </>
    );

  return (
    <>
      <h2 className="text-4xl md:text-6xl font-bold text-left mb-6 ml-[5%] text-gray-900 dark:text-white">
        Freshly Scraped Products
      </h2>
      <div className="flex flex-wrap justify-center gap-y-6 px-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%] xl:w-[18%] flex justify-center"
          >
            <Card product={product} />
          </div>
        ))}
      </div>
    </>
  );
}

