'use client';
import React, { useState } from "react";
import InputForm from "@/components/inputform";
import CatagoryBar from "@/components/catagoryBar";

import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SiteBody from "@/components/sitebody";


interface Product {
    site: string;
    href: string;
    img: string;
    title: string;
    price: string;
}

export default function Page() {
    const [hamrobazarProducts, setHamrobazarproducts] = useState<Product[]>([]);

    const handleSearch = async (query: string) => {
        const res = await fetch("/api/secondhand", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        const response = await res.json();
        setHamrobazarproducts(response);
    };
    return (
        <SidebarProvider>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4" >
                    <Link href={"/"}>
                        <Button>Home</Button>
                    </Link>

                    <InputForm onSearch={handleSearch} />

                    < SidebarTrigger className="-mr-1 ml-auto rotate-180" />
                </header>

                < CatagoryBar />
                <SiteBody result={hamrobazarProducts} />


            </SidebarInset>
            < AppSidebar side="right" />
        </SidebarProvider>
    );
}


