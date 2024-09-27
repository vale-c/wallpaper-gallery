'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ClientModal({
  src,
  fullSrc,
  alt,
}: {
  src: string;
  fullSrc?: string;
  alt: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full h-auto">
        <div className="relative aspect-square">
          <Image
            src={fullSrc || src}
            alt={`Full size ${alt}`}
            fill
            className="object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
