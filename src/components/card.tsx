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
            className="group relative overflow-hidden rounded-2xl transition-transform duration-300 transform hover:scale-105
                 w-[260px] h-[400px] bg-white
                 flex-shrink-0"
            style={{
                boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.2)",
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>

            <div className="absolute bottom-0 z-20 p-4 w-full text-white">
                <h3 className="text-lg font-bold leading-tight mb-1 line-clamp-2">
                    {product.title}
                </h3>
                <div className="text-xl font-extrabold mb-2">{product.price}</div>
                <p className="text-sm text-gray-200">{product.site}</p>
            </div>
        </a>
    );
}

