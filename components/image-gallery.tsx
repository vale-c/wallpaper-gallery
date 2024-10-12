"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageData {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string; // Lower resolution for gallery
    thumb: string; // Thumbnail
  };
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
  description?: string;
  alt_description?: string;
}

interface ImageGalleryProps {
  imagesData: ImageData[];
  totalPages: number;
  page: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export default function ImageGallery({
  imagesData,
  totalPages,
  page,
  handleNext,
  handlePrev,
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Handle fullscreen opening
  const openFullScreen = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden"; // Disable scroll in fullscreen
  };

  // Close fullscreen
  const closeFullScreen = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "auto"; // Restore scroll
  }, []);

  // Navigate fullscreen
  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      if (selectedImageIndex === null) return;
      const totalImages = imagesData?.length ?? 0;
      const newIndex =
        direction === "next"
          ? (selectedImageIndex + 1) % totalImages
          : (selectedImageIndex - 1 + totalImages) % totalImages;
      setSelectedImageIndex(newIndex);
    },
    [selectedImageIndex, imagesData?.length]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFullScreen();
      if (event.key === "ArrowRight") navigateImage("next");
      if (event.key === "ArrowLeft") navigateImage("prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFullScreen, navigateImage]);

  return (
    <>
      <Masonry
        breakpointCols={4}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {imagesData?.map((image, index) => (
          <div
            key={image?.id}
            className="mb-4 cursor-pointer"
            onClick={() => openFullScreen(index)}
          >
            <div className="relative aspect-auto overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Image
                src={image?.urls?.small || image?.urls?.thumb || ""}
                alt={image?.alt_description || `Gallery image ${image?.id}`}
                width={500}
                height={500}
                className="object-cover w-full h-auto"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        ))}
      </Masonry>

      {/* Fullscreen Overlay */}
      {selectedImageIndex !== null && imagesData?.[selectedImageIndex] && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-80 backdrop-blur-md"
          onClick={closeFullScreen}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              closeFullScreen();
            }}
          >
            <X size={24} />
          </button>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagesData?.[selectedImageIndex]?.urls?.regular || ""}
              alt={
                imagesData?.[selectedImageIndex]?.alt_description ||
                "Fullscreen image"
              }
              layout="fill"
              objectFit="contain"
              quality={80} // Set to lower quality for faster loading
              priority
            />
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <Button onClick={handlePrev} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-lg">
          {page} / {totalPages}
        </span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </>
  );
}
