"use client";

import { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { Button } from "@/components/ui/button";

interface ImageData {
  id: string; // The unique identifier for the image
  urls: {
    // Different sizes of the image
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    // Information about the author of the image
    name: string;
    username: string;
  };
  width: number; // Image width in pixels
  height: number; // Image height in pixels
  description?: string; // Optional description of the image
  alt_description?: string; // Optional alt text for the image
}

interface ImageGalleryProps {
  initialImagesData: ImageData[];
  totalPages: number;
}

export default function ImageGallery({
  initialImagesData,
  totalPages,
}: ImageGalleryProps) {
  const [imagesData, setImagesData] = useState(initialImagesData);
  const [page, setPage] = useState(1);

  const fetchImages = async (page: number) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos?page=${page}&per_page=25&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      setImagesData(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      fetchImages(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      fetchImages(page - 1);
    }
  };

  return (
    <>
      <Masonry
        breakpointCols={4}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {imagesData.map((image) => (
          <div key={image.id} className="mb-4 cursor-pointer">
            <div className="relative aspect-auto overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Image
                src={image.urls.regular}
                alt={`Gallery image ${image.id}`}
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
