'use client';

import React from 'react';

const HNLoader = ({ size = "text-4xl" }) => {
  return (
    <div className="relative flex items-center justify-center font-black tracking-tighter select-none">
      {/* 1. Base Text (Empty/Gray State) */}
      <span className={`${size} text-muted-foreground/30`}>
        HN
      </span>

      {/* 2. Filling Text (Colored State) */}
      <div className="absolute inset-0 overflow-hidden animate-text-fill">
        <span className={`${size} text-primary block`}>
          HN
        </span>
      </div>

      {/* Custom Keyframe for this component only */}
      <style jsx>{`
        .animate-text-fill {
          animation: fillUp 2s ease-in-out infinite;
          height: 0%; /* Start empty */
          display: flex;
          align-items: flex-end; /* Fill from bottom */
        }
        
        @keyframes fillUp {
          0% { height: 0%; opacity: 1; }
          50% { height: 100%; opacity: 1; }
          90% { height: 100%; opacity: 0; }
          100% { height: 0%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HNLoader;