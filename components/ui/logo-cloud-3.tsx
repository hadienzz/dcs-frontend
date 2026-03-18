'use client';

import Image from 'next/image';
import { type ComponentProps } from 'react';

import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { cn } from '@/lib/utils';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = ComponentProps<'div'> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
        className
      )}
    >
      <InfiniteSlider gap={24} reverse speed={30} speedOnHover={60}>
        {logos.map((logo) => (
          <Image
            alt={logo.alt}
            className="pointer-events-none h-10 select-none opacity-90 saturate-110 md:h-12"
            height={logo.height ?? 48}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width ?? 220}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}
