import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceGit - Voice to Commit",
  description: "Convert voice descriptions into conventional commit messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen dot-grid noise">
        {children}
      </body>
    </html>
  );
}