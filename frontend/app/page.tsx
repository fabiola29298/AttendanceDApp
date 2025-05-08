///app/page.tsx
'use client';
 
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center">
        <h1 className="text-3xl font-semibold">Bienvenido a Asistencia DApp</h1>
        <p className="text-muted-foreground">Conéctate para gestionar o reclamar tus tokens de asistencia.</p>

      </main>
    </div>
  );
}
