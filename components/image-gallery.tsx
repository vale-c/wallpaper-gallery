'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ImageData {
  s?: string;
  wfs?: string;
  dhd?: string;
  dsd?: string;
}

interface ImageGalleryProps {
  imagesData: Record<string, ImageData>;
}

export default function ImageGallery({ imagesData }: ImageGalleryProps) {
  const images = Object.entries(imagesData);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [columns, setColumns] = useState(4);
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 768) setColumns(2);
      else if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openFullScreen = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeFullScreen = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateImage = useCallback(
    (direction: 'next' | 'prev') => {
      if (selectedImageIndex === null) return;
      const newIndex =
        direction === 'next'
          ? (selectedImageIndex + 1) % images.length
          : (selectedImageIndex - 1 + images.length) % images.length;
      setSelectedImageIndex(newIndex);
    },
    [selectedImageIndex, images.length]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFullScreen();
      if (event.key === 'ArrowRight') navigateImage('next');
      if (event.key === 'ArrowLeft') navigateImage('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeFullScreen, navigateImage]);

  const overlayClass =
    theme === 'light' ? 'bg-white bg-opacity-60' : 'bg-black bg-opacity-80';

  const buttonClass =
    theme === 'light'
      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      : 'bg-gray-800 text-white hover:bg-gray-700';

  return (
    <>
      <Masonry
        breakpointCols={columns}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map(([id, image], index) => {
          const src = image.dsd || image.wfs || image.s;
          if (!src) return null;

          return (
            <div key={id} className="mb-4 cursor-pointer">
              <div
                className="relative aspect-auto overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => openFullScreen(index)}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${id}`}
                  width={500}
                  height={500}
                  className="object-cover w-full h-auto"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                />
              </div>
            </div>
          );
        })}
      </Masonry>

      {selectedImageIndex !== null && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-40 ${overlayClass} backdrop-blur-md`}
          onClick={closeFullScreen}
        >
          <button
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 cursor-pointer ${buttonClass} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              closeFullScreen();
            }}
          >
            <X size={24} />
          </button>
          <button
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 cursor-pointer ${buttonClass} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 cursor-pointer ${buttonClass} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
          >
            <ChevronRight size={24} />
          </button>
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={
                images[selectedImageIndex][1].dhd ||
                images[selectedImageIndex][1].s ||
                images[selectedImageIndex][1].dsd ||
                images[selectedImageIndex][1].wfs ||
                ''
              }
              alt={`Full screen image ${selectedImageIndex}`}
              layout="fill"
              objectFit="contain"
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
