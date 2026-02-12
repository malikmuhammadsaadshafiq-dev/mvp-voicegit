"use client";

import { cn } from "@/lib/utils";

interface CommitCardProps {
  author: string;
  date: string;
  cost: string;
  transcript: string;
  commitMessage: string;
  status: string;
  onDelete: () => void;
  onRegenerate: () => void;
  delay?: number;
}

export function CommitCard({
  author,
  date,
  cost,
  transcript,
  commitMessage,
  status,
  onDelete,
  onRegenerate,
  delay = 0,
}: CommitCardProps) {
  return (
    <div
      className={cn(
        "fade-in-up bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100",
        "hover-lift p-6 flex flex-col gap-4 dark:bg-stone-800/70 dark:border-stone-700"
      )}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{author}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
        </div>
        <span className="text-amber-600 font-bold text-sm bg-amber-100 px-3 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-300">
          {cost}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="bg-amber-50/50 p-3 rounded-lg border border-orange-100 dark:bg-stone-900/50 dark:border-stone-700">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Voice Transcript</p>
          <p className="text-gray-700 italic dark:text-gray-300">{transcript}</p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-3 rounded-lg border border-orange-100 dark:from-stone-900 dark:to-stone-900 dark:border-stone-700">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Generated Commit</p>
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200 block">
            {commitMessage}
          </code>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={onRegenerate}
          className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-sm font-medium py-2 px-4 rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all btn"
        >
          Regenerate
        </button>
        <button
          onClick={onDelete}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-xl transition-colors dark:bg-stone-700 dark:text-gray-300 dark:hover:bg-stone-600"
        >
          Delete
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={cn(
          "w-2 h-2 rounded-full",
          status === "completed" ? "bg-emerald-500" : "bg-amber-500"
        )} />
        <span className="text-xs text-gray-500 capitalize">{status}</span>
      </div>
    </div>
  );
}