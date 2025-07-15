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


interface Product {
  site: string;
  href: string;
  img: string;
  title: string;
  price: string;
}

export default function Page() {
  const [result, setResult] = useState<Product[]>([]);

  const handleSearch = async (query: string) => {
    const res = await fetch("/api/all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResult(data);
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
          <MainBody result={result} />
        </div>

      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}

