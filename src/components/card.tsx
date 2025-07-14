import React from "react";

interface Product {
    site: string;
    href: string;
    img: string;
    title: string;
    price: string;
}

export default function Card({ product }: { product: Product; }) {
    return (
        <a
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[400px] border rounded-lg shadow-lg p-4 flex flex-col items-center bg-white-100 hover:shadow-xl transition"
        >
            <img
                src={product.img}
                alt={product.title}
                className="w-40 h-40 object-cover mb-4 rounded"
            />
            <div className="font-bold text-center mb-2">{product.title}</div>
            <div className="text-green-600 font-semibold">{product.price}</div>
            <div className="text-sm text-white-500 mt-1">{product.site}</div>
        </a>
    );
}

