"use client";

import React, { useState, useEffect } from "react";
import Card from "./card";

interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

interface Props {
  ascproducts: Product[];
  decproducts: Product[];
  Iproducts: Product[];
  Dproducts: Product[];
  Hproducts: Product[];
  Fproducts: Product[];
}

export default function MainBody({
  ascproducts,
  decproducts,
  Iproducts,
  Dproducts,
  Hproducts,
  Fproducts,
}: Props) {
  const [viewAsc, setViewAsc] = useState(false);

  return (
    <div className="p-4 space-y-10">
      <div className="flex justify-end">
        <button
          onClick={() => setViewAsc(!viewAsc)}
          className="bg-green-200 hover:bg-green-300 text-black font-semibold px-4 py-2 rounded"
        >
          {viewAsc ? "Site Categorized" : "Filtered"}
        </button>
      </div>

      {viewAsc ? (
        <>
          <Section title="Low to High ▲" products={ascproducts} defaultOpen />
          <Section title="High to Low ▼" products={decproducts} defaultOpen />
          <Section title="Hamrobazaar" products={Hproducts} />
          <Section title="Foodmandu" products={Fproducts} />
        </>
      ) : (
        <>
          <Section title="Itti" products={Iproducts} />
          <Section title="Daraz" products={Dproducts} />
          <Section title="Hamrobazaar" products={Hproducts} />
          <Section title="Foodmandu" products={Fproducts} />
        </>
      )}
    </div>
  );
}

function Section({
  title,
  products,
  defaultOpen = false,
}: {
  title: string;
  products: Product[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  if (!products || products.length === 0) return null;

  return (
    <div className="border rounded-lg shadow">
      <button
        className="w-full flex justify-between items-center px-4 py-2 text-left text-lg font-semibold "
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 p-4">
          {products.map((item, index) => (
            <Card key={index} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}


