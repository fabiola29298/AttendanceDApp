//frontend/my-app/components/ui/Navbar.tsx
'use client';

import React from "react"; 
import AuthButtons from "@/components/auth/AuthButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full p-4   shadow-md  bg-transparent " >
      <div className="flex items-center"> 
        <Link href="/" className="text-4xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600 ">Asistencia DApp</Link>
      </div>
      <div className="flex-1 flex justify-center items-center">
       </div>
      <div className="flex items-center">
        <AuthButtons />
      </div>
    </nav>
  );
}
