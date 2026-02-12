"use client";

import { useState, useEffect, useRef } from "react";
import { CommitCard } from "@/components/CommitCard";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Toast } from "@/components/Toast";
import { Skeleton } from "@/components/Skeleton";
import { askAI } from "@/lib/ai";

interface CommitItem {
  id: string;
  author: string;
  date: string;
  cost: string;
  transcript: string;
  commitMessage: string;
  status: string;
}

export default function Home() {
  const [items, setItems] = useState<CommitItem[]>([
    {
      id: "1",
      author: "Sarah Chen",
      date: "2024-03-15",
      cost: "$12.50",
      transcript: "Fixed the authentication bug in the login middleware that was causing 500 errors",
      commitMessage: "fix(auth): resolve token validation error in login middleware",
      status: "completed"
    },
    {
      id: "2",
      author: "Marcus Rodriguez",
      date: "2024-03-14",
      cost: "$8.75",
      transcript: "Added new feature for dark mode toggle in the settings panel",
      commitMessage: "feat(ui): implement dark mode toggle in settings",
      status: "completed"
    },
    {
      id: "3",
      author: "Emily Watson",
      date: "2024-03-13",
      cost: "$15.20",
      transcript: "Refactored the database connection pool to improve performance",
      commitMessage: "perf(db): optimize connection pool handling",
      status: "completed"
    },
    {
      id: "4",
      author: "David Kim",
      date: "2024-03-12",
      cost: "$6.50",
      transcript: "Updated the README with installation instructions",
      commitMessage: "docs(readme): add detailed installation guide",
      status: "completed"
    },
    {
      id: "5",
      author: "Lisa Thompson",
      date: "2024-03-11",
      cost: "$22.00",
      transcript: "Implemented the new payment gateway integration with Stripe",
      commitMessage: "feat(payment): integrate Stripe payment processing",
      status: "completed"
    },
    {
      id: "6",
      author: "James Wilson",
      date: "2024-03-10",
      cost: "$9.99",
      transcript: "Fixed CSS alignment issues in the mobile navigation menu",
      commitMessage: "style(nav): fix mobile menu alignment",
      status: "completed"
    },
    {
      id: "7",
      author: "Anna Martinez",
      date: "2024-03-09",
      cost: "$18.45",
      transcript: "Added comprehensive test suite for user authentication flows",
      commitMessage: "test(auth): add unit tests for authentication flows",
      status: "completed"
    },
    {
      id: "8",
      author: "Michael Brown",
      date: "2024-03-08",
      cost: "$11.30",
      transcript: "Removed deprecated API endpoints from version 1",
      commitMessage: "chore(api): remove deprecated v1 endpoints",
      status: "completed"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" as const });
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: "", type: "info" });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    showToast("Commit deleted successfully", "success");
  };

  const handleRegenerate = async (id: string, transcript: string) => {
    setLoading(true);
    try {
      const systemPrompt = "You are a commit message generator. Convert the following description into a conventional commit message (type(scope): description). Only respond with the commit message, nothing else.";
      const newMessage = await askAI(transcript, systemPrompt);
      
      setItems(items.map((item) => 
        item.id === id ? { ...item, commitMessage: newMessage } : item
      ));
      showToast("Commit message regenerated", "success");
    } catch (error) {
      showToast("Failed to regenerate message", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSubmit = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setLoading(true);
    setIsRecordingMode(false);
    
    try {
      const systemPrompt = "You are a commit message generator. Convert the following description into a conventional commit message (type(scope): description). Only respond with the commit message, nothing else.";
      const commitMessage = await askAI(transcript, systemPrompt);
      
      const newItem: CommitItem = {
        id: Date.now().toString(),
        author: "Current User",
        date: new Date().toISOString().split("T")[0],
        cost: "$4.99",
        transcript,
        commitMessage,
        status: "completed"
      };
      
      setItems([newItem, ...items]);
      showToast("Voice commit generated successfully", "success");
    } catch (error) {
      showToast("Failed to generate commit", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Searching for: ${searchQuery}`, "info");
  };

  const filteredItems = items.filter((item) =>
    item.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
    showToast("Search cleared", "info");
  };

  const exportCommits = () => {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-commits.json";
    a.click();
    showToast("Commits exported successfully", "success");
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center scroll-reveal">
        <h1 className="font-bold text-gray-900 mb-2 dark:text-white gradient-text inline-block">
          VoiceGit
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Transform voice descriptions into conventional commits
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between scroll-reveal">
        <form onSubmit={handleSearch} className="flex-1 w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by transcript, commit, or author..."
              className="w-full px-4 py-3 pr-20 rounded-xl border border-orange-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-stone-800/70 dark:border-stone-700 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 text-white p-1.5 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRecordingMode(!isRecordingMode)}
            className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all btn font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            {isRecordingMode ? "Cancel" : "New Voice Commit"}
          </button>
          
          <button
            onClick={exportCommits}
            className="bg-white/70 backdrop-blur-sm border border-orange-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-white transition-colors dark:bg-stone-800/70 dark:border-stone-700 dark:text-gray-300 font-medium"
          >
            Export
          </button>
        </div>
      </div>

      {isRecordingMode && (
        <div className="mb-8 fade-in-up">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-8 dark:bg-stone-800/70 dark:border-stone-700">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
              Record Your Changes
            </h2>
            <VoiceRecorder 
              onTranscript={handleVoiceSubmit} 
              isProcessing={loading} 
            />
            {loading && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {loading && !isRecordingMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 dark:bg-stone-800/70 dark:border-stone-700">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={scrollRef}>
        {filteredItems.map((item, index) => (
          <CommitCard
            key={item.id}
            {...item}
            delay={index * 100}
            onDelete={() => handleDelete(item.id)}
            onRegenerate={() => handleRegenerate(item.id, item.transcript)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No commits found matching your search.</p>
          <button
            onClick={clearSearch}
            className="mt-4 text-amber-600 hover:text-amber-700 font-medium underline"
          >
            Clear search
          </button>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </main>
  );
}