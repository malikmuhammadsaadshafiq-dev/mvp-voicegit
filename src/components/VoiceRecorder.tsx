"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  isProcessing: boolean;
}

export function VoiceRecorder({ onTranscript, isProcessing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    
    setTimeout(() => {
      const mockTranscripts = [
        "Refactored the authentication middleware to handle JWT tokens properly",
        "Added unit tests for the payment gateway integration",
        "Fixed CSS alignment issues in the mobile navigation menu",
        "Updated documentation for the API endpoints"
      ];
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      onTranscript(randomTranscript);
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={cn(
          "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 btn",
          isRecording 
            ? "bg-rose-500 shadow-lg shadow-rose-500/30 animate-pulse"
            : "bg-gradient-to-r from-amber-500 to-rose-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isRecording ? (
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
      </button>
      
      {isRecording && (
        <div className="text-rose-500 font-mono font-semibold animate-pulse">
          {formatTime(duration)}
        </div>
      )}
      
      {!isRecording && !isProcessing && (
        <p className="text-gray-600 text-sm dark:text-gray-400">Tap to record voice description</p>
      )}
    </div>
  );
}