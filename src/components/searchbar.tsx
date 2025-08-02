
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
    <div className="w-full max-w-md">
      <div className="relative text-black dark:text-white">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for your perfect products ....."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          spellCheck={false}
          autoComplete="off"
          className="
            w-full
            px-4 py-3
            pr-20
            rounded-full
            bg-white text-black
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-black
            transition
            dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:ring-white
          "
        />
        <Link
          ref={linkRef}
          href={`/product/query?q=${encodeURIComponent(query.trim())}`}
          tabIndex={query.trim() ? 0 : -1}
          aria-disabled={!query.trim()}
          onClick={(e) => {
            if (!query.trim()) e.preventDefault();
          }}
          className="
            absolute top-1/2 right-1.5 -translate-y-1/2
            px-5 py-2
            rounded-full
            font-semibold
            select-none
            bg-[#66666E] text-white
            hover:bg-gray-800
            transition
            dark:bg-[#000000] dark:hover:bg-[#66666E]
            flex items-center justify-center
          "
        >
          <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </Link>
      </div>
    </div>
  );
}

