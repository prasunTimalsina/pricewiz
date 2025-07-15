"use client";

import React, { useRef, useEffect, useState } from "react";
import { Input } from "./ui/input";

interface Props {
    onSearch: (query: string) => void;
}

export default function InputForm({ onSearch }: Props) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        onSearch(input);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };
    return (
        <div className="flex gap-2 justify-center w-full ">
            <Input
                ref={inputRef}
                className="border rounded bg-gray-100 w-100 text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter product name"
            />
            <button
                className="bg-green-200 hover:bg-green-300 text-black px-2 py-1 rounded"
                onClick={handleSubmit}
            >
                Go
            </button>
        </div>
    );
}

