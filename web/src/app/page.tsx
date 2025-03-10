"use client";

import {useState} from "react";
import Link from "next/link";

export default function Home() {
  const [imageId, setImageId] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && imageId.trim()) {
      const link = document.getElementById("imageLink");
      if (link) {
        (link as HTMLAnchorElement).click();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 dark:text-white text-center">PhotoBooth CP1500</h1>

        <div className="space-y-4 w-64">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter image ID"
              value={imageId}
              onChange={(e) => setImageId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
            />
            <Link
              id="imageLink"
              href={imageId.trim() ? `/${imageId.trim()}` : "#"}
              className={`w-full px-6 py-2 transition-colors text-center ${
                imageId.trim()
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 pointer-events-none"
              }`}
            >
              Find Image
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
