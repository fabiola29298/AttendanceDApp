"use client"

import Navbar from "@/components/navbar/Navbar";
 
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)   {
  return (
    <div>
      <Navbar />
      <div className="content w-full"> 
      
      <div className="flex flex-col gap-[32px] row-start-2 items-center text-center"> 
      {children}
      </div>
      
      </div> 
    </div>
  )
}
