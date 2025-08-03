import React from "react";

export default function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl w-[270px] h-[400px] bg-white flex-shrink-0 relative overflow-hidden"
      style={{
        boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full h-full bg-gray-200 rounded-md"></div>
      </div>

      <div className="absolute inset-0 bg-black/70 z-10"></div>

      <div className="absolute bottom-0 z-20 p-4 w-full text-white">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );
}

