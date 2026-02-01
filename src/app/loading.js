'use client';

import HNLoader from "@/components/HNLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background">
      <HNLoader size="text-7xl md:text-9xl" />
    </div>
  );
}