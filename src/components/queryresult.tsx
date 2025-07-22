"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "./card";

interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

async function fetchProducts(query: string): Promise<Product[]> {
  const res = await fetch('/api/all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
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

  if (!query) return <p>Please enter a search term.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <Card key={index} product={product} />
      ))}
    </div>
  );
}

