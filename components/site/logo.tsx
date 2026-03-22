import React from 'react';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Claw VS Logo"
      width={120}
      height={120}
      className={className}
      priority
    />
  );
}
