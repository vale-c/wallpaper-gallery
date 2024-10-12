"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import ImageGallery from "@/components/image-gallery";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const limit = 25;
  const totalPages = 10;
  const [imagesData, setImagesData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos?page=${page}&per_page=${limit}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );
        const data = await res.json();
        setImagesData(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="absolute top-4 right-4 z-20">
        <ModeToggle />
      </div>
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 font-serif">
            Wallpaper Gallery 🖼️
          </h1>
        </div>
        <ImageGallery
          imagesData={imagesData}
          totalPages={totalPages}
          page={page}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </main>
    </ThemeProvider>
  );
}
