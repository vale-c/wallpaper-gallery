import ImageGallery from '@/components/image-gallery';
import { Suspense } from 'react';
import Loading from '@/components/loading';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';

async function getImages() {
  const res = await fetch(
    'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s',
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  if (!res.ok) {
    throw new Error('Failed to fetch images');
  }
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const imagesData = await getImages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 font-serif">
            Wallpaper Gallery
          </h1>
          <ModeToggle />
        </div>
        <Suspense fallback={<Loading />}>
          <ImageGallery imagesData={imagesData} />
        </Suspense>
      </main>
    </ThemeProvider>
  );
}

export const runtime = 'edge';
