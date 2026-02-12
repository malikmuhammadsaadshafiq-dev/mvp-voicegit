"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`skeleton rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
    />
  );
}