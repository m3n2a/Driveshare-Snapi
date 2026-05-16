import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";

export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl overflow-hidden mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.username} className="w-10 h-10 rounded-full object-cover border border-[var(--outline)]/10" />
          <div>
            <h3 className="font-heading font-semibold text-[var(--text-primary)] leading-tight">{post.author.name}</h3>
            <p className="text-xs text-[var(--text-secondary)]">@{post.author.username} • {post.createdAt}</p>
          </div>
        </div>
        <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-dim)] rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full bg-[var(--surface-dim)] aspect-[4/5] sm:aspect-square md:aspect-[4/5] relative group">
        <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" loading="lazy" />
        
        {/* Glassmorphic overlay on hover (desktop) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hidden md:flex">
          <button 
            onClick={handleLike}
            className="transform transition-transform active:scale-90"
          >
            <Heart className={`w-24 h-24 ${liked ? "fill-white text-white drop-shadow-md" : "text-white/80 drop-shadow-md"}`} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`transition-colors hover:opacity-80 active:scale-90 transform ${liked ? "text-red-500" : "text-[var(--text-primary)]"}`}>
              <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
            </button>
            <button className="text-[var(--text-primary)] hover:opacity-80 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-[var(--text-primary)] hover:opacity-80 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} className={`transition-colors hover:opacity-80 active:scale-90 transform ${saved ? "text-[var(--primary)]" : "text-[var(--text-primary)]"}`}>
            <Bookmark className={`w-6 h-6 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="font-semibold text-sm text-[var(--text-primary)]">{likesCount.toLocaleString()} likes</p>
          <p className="text-sm text-[var(--text-primary)]">
            <span className="font-semibold mr-2">{post.author.username}</span>
            {post.caption}
          </p>
          <button className="text-sm text-[var(--text-secondary)] mt-1 hover:underline">
            View all {post.comments} comments
          </button>
        </div>
      </div>
    </article>
  );
}
