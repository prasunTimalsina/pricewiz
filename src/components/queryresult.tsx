
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

  const data = await res.json();
  return data.products as Product[];
}

export default async function Queryresult({ query }: { query: string; }) {
  const products = await fetchProducts(query);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <Card key={index} product={product} />
      ))}
    </div>
  );
}

