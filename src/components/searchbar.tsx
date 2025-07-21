//'use client';
//
//import { useEffect, useRef, useState } from 'react';
//import { useRouter } from 'next/navigation';
//
//export default function SearchBar() {
//  const [query, setQuery] = useState('');
//  const inputRef = useRef<HTMLInputElement>(null);
//  const router = useRouter();
//
//  useEffect(() => {
//    const handleKeyDown = (e: KeyboardEvent) => {
//      if (e.key === '/' && document.activeElement !== inputRef.current) {
//        e.preventDefault();
//        inputRef.current?.focus();
//      }
//    };
//    window.addEventListener('keydown', handleKeyDown);
//    return () => window.removeEventListener('keydown', handleKeyDown);
//  }, []);
//
//  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//    if (e.key === 'Enter' && query.trim()) {
//      router.push(`/product/query?q=${encodeURIComponent(query.trim())}`);
//    }
//  };
//
//  return (
//    <input
//      ref={inputRef}
//      type="text"
//      placeholder="Search..."
//      value={query}
//      onChange={(e) => setQuery(e.target.value)}
//      onKeyDown={handleKeyPress}
//      className="px-4 py-2 border rounded-md w-full max-w-md focus:outline-none"
//    />
//  );
//}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/product/query?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex gap-2 items-center w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="px-4 py-2 border rounded-md w-full focus:outline-none"
      />
      <Link
        href={`/product/query?q=${encodeURIComponent(query.trim())}`}
        className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
      >
        Go
      </Link>
    </div>
  );
}

