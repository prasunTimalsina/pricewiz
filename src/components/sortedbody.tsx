"use client";

import React, { useState, useEffect } from "react";
import Card from "./card";
import SelectTop10 from "../lib/top10Selection.js";

interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

interface Props {
  decproducts: Product[];
}

export default function SortedBody({ decproducts }: Props) {

  // Call SelectTop10 with decproducts
  const selected = SelectTop10(decproducts);

  return (
    <div className="p-4 space-y-10">
      <div className="flex justify-end"></div>
      <Section title="Top 10 Selected" products={selected} defaultOpen />
      <Section title="High to Low ▼" products={decproducts} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {products.map((item, index) => (
            <Card key={index} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

