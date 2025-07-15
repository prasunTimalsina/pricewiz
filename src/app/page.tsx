"use client";

import React, { useState } from "react";
import InputForm from "@/components/inputform";
import MainBody from "@/components/mainbody";
import CatagoryBar from "@/components/catagoryBar";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";


interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

export default function Page() {
  const [ascProducts, setAscProducts] = useState<Product[]>([]);
  const [decProducts, setDecProducts] = useState<Product[]>([]);
  const [iitiProducts, setIitiProducts] = useState<Product[]>([]);
  const [darazProducts, setDarazProducts] = useState<Product[]>([]);
  const [hamroProducts, setHamroProducts] = useState<Product[]>([]);
  const [foodmanduProducts, setFoodmanduProducts] = useState<Product[]>([]);

  const handleSearch = async (query: string) => {
    const res = await fetch("/api/all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const [ascproducts, decproducts, Iproducts, Dproducts, Hproducts, Fproducts] = await res.json();
    setAscProducts(ascproducts);
    setDecProducts(decproducts);
    setIitiProducts(Iproducts);
    setDarazProducts(Dproducts);
    setHamroProducts(Hproducts);
    setFoodmanduProducts(Fproducts);
  };
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">

          <InputForm onSearch={handleSearch} />

          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
        </header>

        <CatagoryBar />

        <div>
          <MainBody
            ascproducts={ascProducts}
            decproducts={decProducts}
            Iproducts={iitiProducts}
            Dproducts={darazProducts}
            Hproducts={hamroProducts}
            Fproducts={foodmanduProducts}
          />
        </div>

      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}

