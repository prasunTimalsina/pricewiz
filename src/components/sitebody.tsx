"use client";

import React from "react";
import Card from "./card";

interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

export default function SiteBody({ result }: { result: Product[]; }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 px-4">
      {result.map((item, index) => (
        <Card key={index} product={item} />
      ))}
    </div>
  );
}

