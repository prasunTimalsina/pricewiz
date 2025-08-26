"use client";

import React, { useEffect, useState } from "react";

interface Listing {
  title: string;
  price: number;
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
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const minPrice = formData.get("minPrice");

    try {
      const res = await fetch("/api/track-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          minPrice,
          title: listing.title,
          platform: listing.platform,
        }),
      });

      if (res.status === 200) {
        setMessage("✅ You will get updates when the price goes down.");
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      setMessage("⚠️Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl text-center font-bold mb-2 text-black">
          <span>{listing.title}</span>
        </h2>
        <h3
          className="text-gray-500 text-lg mb-4">
          Current Price: <span className="font-medium">{listing.price}</span>
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Platform: <span className="font-medium">{listing.platform}</span>
        </p>

        <form onSubmit={handleTrack} className="flex flex-col gap-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 outline-none mb-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Minimum Price (sends email when price drops below)
            </label>
            <input
              name="minPrice"
              type="number"
              required
              placeholder="Enter minimum price"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 outline-none mb-4"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#E6E6E9] text-black font-semibold py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackListingPopup;

