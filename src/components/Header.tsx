'use client';

import React from 'react';
import SearchBar from './searchbar';
import Logo from './Logo';

function Header() {
  return (
    <div className="w-full flex justify-between light mb-10 mt-6">
      <Logo />
      <SearchBar />
      <div></div>
    </div>
  );
}

export default Header;

