'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null); // Ref for link

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
      linkRef.current?.click(); // Simulate link click
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
        ref={linkRef}
        href={`/product/query?q=${encodeURIComponent(query.trim())}`}
        className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
      >
        Go
      </Link>
    </div>
  );
}

