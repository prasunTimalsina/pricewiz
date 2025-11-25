"use client";
import Dbqueryresult from "@/components/DbQueryresult";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import Queryresult from "@/components/queryresult";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

async function fetchDbProducts(query: string): Promise<Product[]> {
  const res = await fetch(`/api/products?query=${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch DB products");
  }

  return await res.json();
}

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetchDbProducts(query)
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="h-screen">
      <AuroraBackground className="w-screen z-0 p-2 pb-4 rounded-b-2xl mb-6">
        <Header />
        <Dbqueryresult products={products} loading={loading} />
        {!loading && products.length === 0 && query && <Queryresult />}
        <Footer />
      </AuroraBackground>
    </div>
  );
}
