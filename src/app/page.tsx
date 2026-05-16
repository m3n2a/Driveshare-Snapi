"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { user, loading, userData } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (userData?.onboardingCompleted) {
        router.push("/feed");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, loading, userData, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Let the useEffect handle the redirection once auth state updates
    } catch (err: any) {
      console.error(err);
      setError("Failed to log in with Google. Please try again.");
      setIsLoggingIn(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  // If we have a user but are still rendering (waiting for redirect), show spinner
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--background)]">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--primary-container)] blur-[100px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--secondary-container)] blur-[100px] opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md w-full">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 drop-shadow-xl animate-in zoom-in duration-700">
          <rect x="0" y="0" width="80" height="80" rx="18" fill="#D85A30" />

          <rect
            x="14"
            y="26"
            width="52"
            height="39"
            rx="6"
            fill="white"
            opacity="0.95"
          />

          <rect
            x="26"
            y="18"
            width="18"
            height="11"
            rx="5.5"
            fill="#D85A30"
          />
          <circle
            cx="40"
            cy="45"
            r="12"
            fill="white"
            stroke="#D85A30"
            strokeWidth="2.5"
          />
          <circle
            cx="40"
            cy="45"
            r="7"
            fill="white"
            stroke="#D85A30"
            strokeWidth="2"
          />
          <circle cx="40" cy="45" r="2.5" fill="#D85A30" />
          <circle cx="58" cy="33" r="3" fill="#D85A30" />
        </svg>
        <h1 className="text-4xl font-heading font-bold mb-4 text-[var(--text-primary)]">
          Snapi
        </h1>
        <p className="text-[var(--text-secondary)] mb-12">
          Compartir fotos nunca fue tan fácil.
        </p>
        <div className="w-full bg-[var(--surface)]/80 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-[var(--surface-dim)]/50">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full h-12 flex items-center justify-center gap-3 text-lg"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Iniciar sesión con google
              </>
            )}
          </Button>

          {error && (
            <p className="mt-4 text-[var(--error)] text-sm">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
