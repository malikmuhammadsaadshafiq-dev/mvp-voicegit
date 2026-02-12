"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  visible: boolean;
}

export function Toast({ message, type = "info", onClose, visible }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-slide-in",
        "transform transition-all duration-300",
        type === "success" && "bg-emerald-500/90 border-emerald-400 text-white",
        type === "error" && "bg-rose-500/90 border-rose-400 text-white",
        type === "info" && "bg-amber-500/90 border-amber-400 text-white"
      )}
    >
      <p className="font-medium text-sm">{message}</p>
    </div>
  );
}