/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export default function ArabesquePattern({ className = "opacity-5" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* Arabic Geometric Pattern overlay */}
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="arabesque" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 10,0 L 20,10 L 10,20 L 0,10 Z M 10,5 L 15,10 L 10,15 L 5,10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.25"
            />
            <circle cx="10" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.25" />
            <circle cx="0" cy="0" r="1" fill="none" stroke="currentColor" strokeWidth="0.25" />
            <circle cx="20" cy="0" r="1" fill="none" stroke="currentColor" strokeWidth="0.25" />
            <circle cx="0" cy="20" r="1" fill="none" stroke="currentColor" strokeWidth="0.25" />
            <circle cx="20" cy="20" r="1" fill="none" stroke="currentColor" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arabesque)" />
      </svg>
    </div>
  );
}

export function ElegantStar({ className = "text-amber-500/30" }: { className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArabesqueBorder() {
  return (
    <div className="flex items-center justify-center gap-2 my-2 opacity-30 text-amber-500">
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-current" />
      <ElegantStar className="w-4 h-4" />
      <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}
