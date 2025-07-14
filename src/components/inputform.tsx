"use client";

import React, { useState } from "react";
import Card from "./card";

interface Product {
    site: string;
    href: string;
    img: string;
    title: string;
    price: string;
}

export default function InputForm() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<Product[]>([]);

    const handleSubmit = async () => {
        const res = await fetch("/api/all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: input }),
        });

        const data = await res.json();
        setResult(data);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-10">
            <div className="flex gap-6 ">
                <input
                    className="border p-2 rounded bg-white text-black"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter product name"
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                >
                    Go
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {result.map((item, index) => (
                    <Card key={index} product={item} />
                ))}
            </div>
        </div>
    );
}

