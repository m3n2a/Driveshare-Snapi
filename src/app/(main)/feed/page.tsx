"use client";

import { useState } from "react";
import { PostCard, type Post } from "@/components/feed/PostCard";

const DUMMY_POSTS: Post[] = [

];

export default function FeedPage() {
  const [posts] = useState<Post[]>(DUMMY_POSTS);

  return (
    <div className="max-w-2xl mx-auto pt-6 px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">Your Feed</h1>
        <p className="text-[var(--text-secondary)] mt-1">Discover what your network is sharing.</p>
      </header>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">🌵</div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">¡No hay nada acá!</h3>
            <p className="text-[var(--text-secondary)]">Solo se escucha el eco... Sube algunas fotos o únete a una galería para darle vida a esto.</p>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <div className="py-8 text-center text-[var(--text-secondary)]">
          <div className="inline-block w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm">Cargando más momentos...</p>
        </div>
      )}
    </div>
  );
}
