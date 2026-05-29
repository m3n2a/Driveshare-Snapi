"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Download, Copy, Lock, Unlock, Rocket } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CreateGalleryPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreating(false);
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans pb-24 transition-colors duration-300">
      {/* Top Navigation Anchor */}
      <header className="bg-[var(--surface-dim)] sticky top-0 z-40 shadow-sm flex justify-between items-center w-full px-4 h-16 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="active:scale-95 transition-transform duration-150 p-2 hover:bg-[var(--primary)]/20 rounded-full">
            <ArrowLeft className="w-6 h-6 text-[var(--primary)]" />
          </button>
          <h1 className="text-[28px] leading-[36px] font-semibold text-[var(--primary)] tracking-tight">Crear Nueva Galería</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--outline)]/30 flex items-center justify-center overflow-hidden">
          {userData?.photoURL ? (
            <img alt="User" className="w-full h-full object-cover" src={userData.photoURL} />
          ) : (
            <div className="w-full h-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold">
              {userData?.displayName?.charAt(0) || "U"}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Form Section */}
        <section className="space-y-6">
          <div className="space-y-3">
            <label className="text-[14px] font-medium text-[var(--text-primary)]" htmlFor="event-name">Nombre del Evento</label>
            <input 
              className="w-full h-12 px-4 bg-[var(--background)] border border-[var(--outline)]/50 rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--text-secondary)]/50 text-[var(--text-primary)]" 
              id="event-name" 
              placeholder="Ej: Boda de Ana y Luis" 
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[14px] font-medium text-[var(--text-primary)]" htmlFor="event-date">Fecha del Evento</label>
            <div className="relative">
              <input 
                className="w-full h-12 px-4 bg-[var(--background)] border border-[var(--outline)]/50 rounded-lg focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--text-secondary)]/50 text-[var(--text-primary)]" 
                id="event-date" 
                placeholder="DD / MM / AAAA" 
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Access & QR Section */}
        <section className="bg-[var(--surface-dim)] rounded-xl p-6 border border-[var(--outline)]/30 shadow-sm space-y-6 transition-colors duration-300">
          <div className="text-center space-y-2">
            <p className="text-[14px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">Código de Acceso</p>
            <h2 className="text-[48px] font-bold text-[var(--primary)] select-all tracking-tight">SNAPI-2024-X</h2>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="p-2 bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--outline)]/20">
              <img alt="QR Code Link" className="w-48 h-48 rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjjwz8o6Kh_TdaiWYFnVp2FfPMWCKMfeFFkLtwXdRyQPmNp6IK8tf5LIZSgzHygzwDXjGrL-z5Mmfl9qtTaXubpPOTUev9I96OTueN7A4pxHc3BAAS-BdXd7avv7FhZXwzBsuipZt7a28UIFwX0h84MvDDeGQ_-l08uuWEodLY9itpgvLxpHFfQqOsZ61l1QlPHjY5x60cBgcKx_fZNE1-xufNszSQ3feer3a4c1_uFsiR_zBDXdHyF5IQlDkvvCxEcbKlNT6l5J6w"/>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button className="flex items-center justify-center gap-2 h-12 bg-[var(--background)] border border-[var(--primary)] text-[var(--primary)] text-[14px] font-medium rounded-lg hover:bg-[var(--primary)]/10 active:scale-95 transition-all">
                <Download className="w-5 h-5" />
                Descargar QR
              </button>
              <button className="flex items-center justify-center gap-2 h-12 bg-[var(--background)] border border-[var(--primary)] text-[var(--primary)] text-[14px] font-medium rounded-lg hover:bg-[var(--primary)]/10 active:scale-95 transition-all">
                <Copy className="w-5 h-5" />
                Copiar Enlace
              </button>
            </div>
          </div>
        </section>

        {/* Advanced Options Bento */}
        <section className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 cursor-pointer" onClick={() => setIsPublic(!isPublic)}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                {isPublic ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[20px] leading-[28px] font-bold text-[var(--text-primary)]">Privacidad {isPublic ? 'Pública' : 'Privada'}</p>
                <p className="text-[11px] font-medium text-[var(--text-secondary)]">{isPublic ? 'Cualquiera con el código puede subir fotos' : 'Solo invitados pueden subir fotos'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${isPublic ? 'bg-[var(--primary)]' : 'bg-[var(--surface-dim)] border border-[var(--outline)]/50'}`}>
              <div className={`w-4 h-4 bg-[var(--on-primary)] rounded-full absolute transition-all ${isPublic ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[var(--background)]/80 backdrop-blur-md border-t border-[var(--outline)]/20 flex flex-col items-center z-50">
        <button 
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full max-w-xl h-14 bg-[var(--primary)] text-[var(--on-primary)] text-[16px] font-semibold rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-70"
        >
          {isCreating ? 'Creando...' : 'Crear Galería'}
          {!isCreating && <Rocket className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}


