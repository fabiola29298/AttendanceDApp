"use client"

//import { WaitlistSignup } from "./components/waitlist-signup" 
import Navbar from "@/components/navbar/Navbar";

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
  }
`

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)   {
  return (
    <main
      className="min-h-screen items-center justify-center"
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <Navbar />
      <div className="content w-full"> 
      
      <div className="flex flex-col gap-[32px] row-start-2 items-center text-center"> 
      {children}
      </div>
      
      </div> 
    </main>
  )
}
