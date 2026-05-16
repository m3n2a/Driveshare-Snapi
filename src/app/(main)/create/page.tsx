"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UploadCloud, X, MapPin, Hash, Lock, Globe } from "lucide-react";
export default function CreatePostPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // For UI demonstration, we create local object URLs
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;
    setIsUploading(true);

    // Simulate API call to Google Drive + Firestore
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsUploading(false);
    router.push("/feed");
  };

  return (
    <div className="max-w-3xl mx-auto pt-6 px-4 sm:px-6 mb-20 md:mb-0">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">Create a Snapi</h1>
        <p className="text-[var(--text-secondary)] mt-1">Create a gallery.</p>
      </header>

      <div className="bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl p-6 shadow-sm">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-colors cursor-pointer
            ${isDragging ? "border-[var(--primary)] bg-[var(--primary-container)]/50" : "border-[var(--outline)]/40 hover:border-[var(--primary)]/50"}
            ${images.length > 0 ? "hidden" : "block"}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          />
          <UploadCloud className="w-12 h-12 text-[var(--primary)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Drag and drop photos</h3>
          <p className="text-sm text-[var(--text-secondary)]">or click to browse from your device</p>
          <p className="text-xs text-[var(--text-secondary)]/70 mt-4">High quality JPEGs, PNGs up to 20MB</p>
        </div>

        {/* Previews */}
        {images.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Selected Photos ({images.length}/10)</h3>
              <button onClick={() => fileInputRef.current?.click()} className="text-sm text-[var(--primary)] hover:underline">
                Add more
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((url, i) => (
                <div key={i} className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden group">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full h-24 rounded-md border border-[var(--outline)]/40 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] resize-none"
              placeholder="Tell the story behind this shot..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <Hash className="w-4 h-4" /> Hashtags
              </label>
              <Input
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="e.g. #nature #portrait"
                className="border-[var(--outline)]/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Location (Optional)
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="border-[var(--outline)]/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--outline)]/10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--text-primary)]">Privacy</span>
              <div className="flex bg-[var(--surface-dim)] p-1 rounded-lg">
                <button
                  onClick={() => setIsPrivate(false)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${!isPrivate ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)]"}`}
                >
                  <Globe className="w-4 h-4" /> Public
                </button>
                <button
                  onClick={() => setIsPrivate(true)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${isPrivate ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)]"}`}
                >
                  <Lock className="w-4 h-4" /> Private
                </button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={images.length === 0 || isUploading}
              className="px-8"
            >
              {isUploading ? "Publishing..." : "Share Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


