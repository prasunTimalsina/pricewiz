'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

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
      linkRef.current?.click();
    }
  };

  return (
    <div className="flex items-center w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for your perfect products ....."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="px-4 py-2 border w-full focus:outline-none rounded-l-2xl"
      />
      <Link

        ref={linkRef}
        href={`/product/query?q=${encodeURIComponent(query.trim())}`}
        className="px-4 py-2 bg-green-200 text-black font-semibold rounded-r-2xl hover:bg-green-300 transition"
      >
        Go
      </Link>
    </div>
  );
}

