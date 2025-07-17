"use client";

import React, { useState } from "react";
import InputForm from "@/components/inputform";
import CatagoryBar from "@/components/catagoryBar";
import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import SortedBody from "@/components/sortedbody";


interface Product {
    site: string;
    href: string;
    img: string;
    title: string;
    price: string;
}

export default function Page() {
    const [decProducts, setDecProducts] = useState<Product[]>([]);

    const handleSearch = async (query: string) => {
        const res = await fetch("/api/all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        const [decproducts] = await res.json();
        setDecProducts(decproducts);
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
                    <SortedBody
                        decproducts={decProducts}
                    />
                </div>

            </SidebarInset>
            <AppSidebar side="right" />
        </SidebarProvider>
    );
}

