"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AppLayout } from "@/components/shared/AppLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (userData && !userData.onboardingCompleted) {
        router.push("/onboarding");
      }
    }
  }, [user, loading, userData, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
