"use client";
import { lazy, useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import Loading from "@/components/loading";

const ImageGallery = lazy(() => import("@/components/image-gallery"));

export default function Home() {
  const limit = 25;
  const totalPages = 10; // Assuming you have 10 pages for pagination
  const [initialImagesData, setInitialImagesData] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos?page=1&per_page=${limit}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch images from Unsplash API");
        }
        const data = await res.json();
        setInitialImagesData(data);
      } catch (error) {
        console.error("Error fetching initial images:", error);
      }
    };

    fetchImages(); // Fetch images for the first page when the component mounts
  }, [limit]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 font-serif">
            Wallpaper Gallery
          </h1>
        </div>
        <Suspense fallback={<Loading />}>
          <ImageGallery
            initialImagesData={initialImagesData}
            totalPages={totalPages}
          />
        </Suspense>
      </main>
    </ThemeProvider>
  );
}
