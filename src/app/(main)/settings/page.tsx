"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Moon, Sun, Bell, Lock, User as UserIcon, Shield, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto pt-6 px-4 sm:px-6 mb-20 md:mb-0">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your account preferences and app settings.</p>
      </header>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl p-6">
          <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5" /> Appearance
          </h2>
          
          <div className="flex items-center justify-between py-3 border-t border-[var(--outline)]/10">
            <div>
              <p className="font-medium text-[var(--text-primary)]">Dark Mode</p>
              <p className="text-sm text-[var(--text-secondary)]">Adjust the appearance of Snapi to reduce glare.</p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </section>

        {/* Account */}
        <section className="bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl p-6">
          <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5" /> Account
          </h2>
          
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-[var(--surface-dim)] rounded-lg px-2 -mx-2 transition-colors">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Edit Profile</p>
                <p className="text-sm text-[var(--text-secondary)]">Change your display name, bio, and avatar.</p>
              </div>
            </button>
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-[var(--surface-dim)] rounded-lg px-2 -mx-2 transition-colors border-t border-[var(--outline)]/10">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Privacy</p>
                <p className="text-sm text-[var(--text-secondary)]">Manage who can see your posts and profile.</p>
              </div>
            </button>
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-[var(--surface-dim)] rounded-lg px-2 -mx-2 transition-colors border-t border-[var(--outline)]/10">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Security</p>
                <p className="text-sm text-[var(--text-secondary)]">Password, 2FA, and connected accounts.</p>
              </div>
            </button>
          </div>
        </section>

        {/* Support */}
        <section className="bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl p-6">
          <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Support & About
          </h2>
          
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-[var(--surface-dim)] rounded-lg px-2 -mx-2 transition-colors">
              <p className="font-medium text-[var(--text-primary)]">Help Center</p>
            </button>
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-[var(--surface-dim)] rounded-lg px-2 -mx-2 transition-colors border-t border-[var(--outline)]/10">
              <p className="font-medium text-[var(--text-primary)]">Terms of Service</p>
            </button>
            <button className="w-full flex items-center justify-between py-3 text-left hover:bg-[var(--surface-dim)] rounded-lg px-2 -mx-2 transition-colors border-t border-[var(--outline)]/10">
              <p className="font-medium text-[var(--text-primary)]">Privacy Policy</p>
            </button>
          </div>
        </section>

        <div className="pt-4 pb-8 flex justify-center">
          <Button variant="outline" className="text-[var(--error)] border-[var(--error)]/50 hover:bg-[var(--error)]/10">
            Deactivate Account
          </Button>
        </div>
      </div>
    </div>
  );
}
