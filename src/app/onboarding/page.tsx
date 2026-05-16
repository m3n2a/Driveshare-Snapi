"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Check, ChevronRight, AlertCircle, Camera } from "lucide-react";

const INTERESTS = [
  "Fotografía", "Viajes", "Arte", "Gaming", "Tecnología", 
  "Música", "Moda", "Memes", "Lifestyle", "Deportes", 
  "Naturaleza", "Arquitectura", "Productividad", "Negocios", 
  "Animales", "Comida", "Autos y motos"
];

export default function OnboardingPage() {
  const { user, loading, userData } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1 State
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Step 2 State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (!loading && user && userData?.onboardingCompleted) {
      router.push("/feed");
    }
  }, [user, loading, userData, router]);

  // Validation for Step 1
  const validateUsername = async (val: string) => {
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      return "Only letters, numbers, and underscores allowed.";
    }
    if (val.length < 3) {
      return "Username must be at least 3 characters.";
    }
    // Check uniqueness in Firestore
    setIsCheckingUsername(true);
    try {
      const q = query(collection(db, "users"), where("username", "==", val.toLowerCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return "Username is already taken.";
      }
    } catch (err) {
      console.error(err);
      return "Error checking username.";
    } finally {
      setIsCheckingUsername(false);
    }
    return "";
  };

  const validateBirthDate = (val: string) => {
    if (!val) return "Birth date is required.";
    const birth = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < 13) {
      return "You must be at least 13 years old.";
    }
    return "";
  };

  const handleNextStep = async () => {
    const uErr = await validateUsername(username);
    const bErr = validateBirthDate(birthDate);

    setUsernameError(uErr);
    setBirthDateError(bErr);

    if (!uErr && !bErr) {
      setStep(2);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (selectedInterests.length < 3) return;
    if (!user) return;

    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        username: username.toLowerCase(),
        displayName: user.displayName || username,
        photoURL: user.photoURL || "",
        birthDate,
        interests: selectedInterests,
        onboardingCompleted: true,
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      // Force reload to get latest user data or push directly
      window.location.href = "/feed";
    } catch (error) {
      console.error("Error saving onboarding data", error);
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--background)] p-4 md:p-8">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8 flex items-center gap-2">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[var(--primary)]" : "bg-[var(--surface-dim)]"}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[var(--primary)]" : "bg-[var(--surface-dim)]"}`} />
      </div>

      <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--outline)]/20 rounded-2xl shadow-xl overflow-hidden relative">
        
        {step === 1 && (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-[var(--background)] shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[var(--surface-dim)] flex items-center justify-center border-4 border-[var(--background)] shadow-md">
                    <Camera className="w-8 h-8 text-[var(--text-secondary)]" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[var(--surface)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-heading font-bold mt-4 text-[var(--text-primary)]">Welcome, {user.displayName?.split(" ")[0] || "Photographer"}</h1>
              <p className="text-[var(--text-secondary)] mt-1">Let's set up your profile.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Username</label>
                <Input 
                  type="text" 
                  placeholder="e.g. photo_master99" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className={usernameError ? "border-[var(--error)] focus-visible:ring-[var(--error)]" : ""}
                />
                {usernameError && (
                  <p className="text-[var(--error)] text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" /> {usernameError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Date of Birth</label>
                <Input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={birthDateError ? "border-[var(--error)] focus-visible:ring-[var(--error)]" : ""}
                />
                {birthDateError && (
                  <p className="text-[var(--error)] text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" /> {birthDateError}
                  </p>
                )}
                <p className="text-xs text-[var(--text-secondary)] mt-1">You must be at least 13 years old to use Snapi.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleNextStep} 
                  disabled={isCheckingUsername || !username || !birthDate}
                  className="w-full sm:w-auto"
                >
                  {isCheckingUsername ? "Checking..." : "Continue"} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold text-[var(--text-primary)]">What will you use the app for?</h1>
              <p className="text-[var(--text-secondary)] mt-2">Select at least 3 interests to personalize your feed.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
              {INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`
                      relative overflow-hidden p-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:-translate-y-1
                      ${isSelected 
                        ? 'bg-[var(--primary-container)] text-[var(--on-primary)] ring-2 ring-[var(--primary)] shadow-md' 
                        : 'bg-[var(--surface-dim)] text-[var(--text-secondary)] hover:bg-[var(--outline)]/10 hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    {interest}
                  </button>
                )
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[var(--outline)]/20">
              <p className="text-sm text-[var(--text-secondary)]">
                {selectedInterests.length} / 3 selected
              </p>
              <Button 
                onClick={handleComplete} 
                disabled={selectedInterests.length < 3 || isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? "Saving..." : "Finish Setup"} <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
