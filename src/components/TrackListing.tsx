"use client";

import React, { useEffect } from "react";

interface Listing {
  title: string;
  platform: string;
}

interface TrackListingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
}

const TrackListingPopup: React.FC<TrackListingPopupProps> = ({
  isOpen,
  onClose,
  listing,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2 text-black">
          Track Listing: <span>{listing.title}</span>
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Platform: <span className="font-medium">{listing.platform}</span>
        </p>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Price (Rs.)
            </label>
            <input
              type="number"
              required
              placeholder="Enter minimum price"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-[#E6E6E9] text-black font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Track
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackListingPopup;

