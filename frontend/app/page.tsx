"use client"
  
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout()   {
  return (
    <div>
      <Navbar />
      <div className="content w-full">
      <div className="flex flex-col gap-[32px] row-start-2 items-center text-center"> 
      <div className="max-w-2/3  my-9 p-9 shadow-[0px_2px_0px_0px_rgba(24,25,31,1.00)]  outline-zinc-900 overflow-hidden rounded-xl bg-white/5  ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500 ">
             
            <div className="mb-8 ">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                    Bienvenido
                </h1>
                <p className="text-amber-100">Conéctate para gestionar o reclamar tus tokens de asistencia. Click en Login with Privy.</p>
            </div>   
                
        </div>
      </div> 
       
      </div> 
    </div>
  )
}
