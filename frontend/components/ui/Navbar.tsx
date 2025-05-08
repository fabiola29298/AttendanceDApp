//frontend/my-app/components/ui/Navbar.tsx
'use client';

import React from "react";
import { ModeToggle } from "./ModeToggle";
import AuthButtons from "@/components/ui/AuthButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full p-4 bg-background shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold mr-4">Asistencia DApp</Link>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <ModeToggle />
      </div>
      <div className="flex items-center">
        <AuthButtons />
      </div>
    </nav>
  );
}
