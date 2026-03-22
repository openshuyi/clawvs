import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Claw VS Logo"
    >
      <title>Claw VS Logo</title>
      {/* Outer Industrial Hexagon/Octagon Frame */}
      <path
        d="M15,35 L35,15 L85,15 L105,35 L105,85 L85,105 L35,105 L15,85 Z"
        stroke="currentColor"
        strokeWidth="4"
        className="text-text-primary"
      />
      
      {/* Cyber/Tech Accents (corners) */}
      <path d="M10,35 L15,35 M105,35 L110,35 M10,85 L15,85 M105,85 L110,85" stroke="var(--accent-cyan)" strokeWidth="4" />
      <path d="M35,10 L35,15 M85,10 L85,15 M35,105 L35,110 M85,105 L85,110" stroke="var(--accent-orange)" strokeWidth="4" />

      {/* The "C" (Claw) - Sharp, angular */}
      <path
        d="M 55 35 L 35 35 L 25 50 L 25 70 L 35 85 L 55 85"
        stroke="var(--accent-cyan)"
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="drop-shadow-[0_0_8px_var(--accent-cyan)]"
      />
      
      {/* The "V" (VS) - Sharp, intersecting */}
      <path
        d="M 65 35 L 80 85 L 95 35"
        stroke="var(--accent-orange)"
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="drop-shadow-[0_0_8px_var(--accent-orange)]"
      />

      {/* Terminal Cursor / Tech Node */}
      <rect x="25" y="55" width="10" height="10" fill="var(--accent-cyan)" />
    </svg>
  );
}
