import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';


export default function ProfesorDashboardContent(){
    const {  user } = usePrivy();
    const [balance] = useState<bigint>(BigInt(0));
    
     
    return (
        <div className="w-11/12 my-9 p-9 shadow-[0px_2px_0px_0px_rgba(24,25,31,1.00)]  outline-zinc-900 overflow-hidden rounded-xl bg-white/5  ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500 ">
                    
            <div className="mb-8 text-gray-300">
    
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                    Panel del Profesor
                </h1> 
                 <p className="text-sxl">
                {user?.wallet?.address}
                </p>
                <p className="text-sxl mb-8 ">
                    Balance: {balance.toString()} tokens
                </p> 
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
                <p className=" font-bold">Aquí puedes registrar alumnos, crear sesiones.</p>
               
            </div>
        </div>
)}