"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Grid, Bookmark, Settings, Edit3 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // Dummy stats
  const stats = {
    posts: 42,
    followers: 1284,
    following: 345
  };

  // Dummy grid items
  const gridItems = Array.from({ length: 12 }).map((_, i) => `https://picsum.photos/seed/${i + 10}/400/400`);

  return (
    <div className="max-w-4xl mx-auto pt-6 px-4 sm:px-6 mb-20 md:mb-0">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[var(--surface-dim)] flex-shrink-0">
          <img 
            src={userData?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.displayName || 'User'}`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">{userData?.username || "username"}</h1>
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" className="h-9">Edit Profile</Button>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-8 mb-4">
            <div className="text-center md:text-left">
              <span className="block font-bold text-[var(--text-primary)] text-lg">{stats.posts}</span>
              <span className="text-sm text-[var(--text-secondary)]">posts</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-bold text-[var(--text-primary)] text-lg">{stats.followers}</span>
              <span className="text-sm text-[var(--text-secondary)]">followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-bold text-[var(--text-primary)] text-lg">{stats.following}</span>
              <span className="text-sm text-[var(--text-secondary)]">following</span>
            </div>
          </div>

          <div>
            <p className="font-semibold text-[var(--text-primary)]">{userData?.displayName}</p>
            <p className="text-[var(--text-secondary)] text-sm max-w-md mt-1">
              Photographer | Digital Artist <br/>
              Sharing moments and stories through a lens. 📷✨
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-t border-[var(--outline)]/20 mb-6">
        <div className="flex justify-center gap-12">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${activeTab === "posts" ? "border-[var(--text-primary)] text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider uppercase">Posts</span>
          </button>
          <button 
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${activeTab === "saved" ? "border-[var(--text-primary)] text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider uppercase">Saved</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
        {gridItems.map((url, i) => (
          <div key={i} className="aspect-square bg-[var(--surface-dim)] group relative overflow-hidden">
            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden md:flex">
              <div className="flex gap-4 text-white font-semibold">
                <span>❤️ {Math.floor(Math.random() * 500) + 10}</span>
                <span>💬 {Math.floor(Math.random() * 50) + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
