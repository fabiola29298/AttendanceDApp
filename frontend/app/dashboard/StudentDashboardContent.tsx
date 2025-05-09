import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from "sonner";
import { useRouter } from 'next/navigation'; 
import { SessionList } from '@/components/dashboard/SessionList';
import { ClaimTokenDialog } from '@/components/dashboard/ClaimTokenDialog';
import { getAllSessions, isAllowedStudent, getTokenBalance } from '@/lib/services/asistencia';
import type { Session } from '@/types/session';


export default function StudentDashboardContent(){
    const {authenticated,  user } = usePrivy();
    const router = useRouter();
    const [sessions, setSessions] = useState<Record<number, Session>>({});
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const handleCloseDialog = () => {
        setSelectedSessionId(null);
    };
    useEffect(() => {
        if (!authenticated) {
            router.push('/');
        }
    }, [authenticated, router]);
    useEffect(() => {
        async function loadData() {
            if (authenticated && user?.wallet?.address) {
                try {
                    setLoading(true);
                    const [sessionsData, allowed, tokenBalance] = await Promise.all([
                        getAllSessions(),
                        isAllowedStudent(user.wallet.address),
                        getTokenBalance(user.wallet.address)
                    ]);

                    setSessions(sessionsData);
                    setIsAllowed(allowed);
                    setBalance(tokenBalance);
                } catch (error) {
                    console.error('Error loading data:', error);
                } finally {
                    setLoading(false);
                }
            }
        }

        loadData();
    }, [authenticated, user]);
    const handleSelectSession = (id: number) => {
        if (!isAllowed) {
            toast.error("No estás registrado como alumno permitido");
            return;
        }

        if (!sessions[id].activa) {
            toast.error("Esta sesión no está activa");
            return;
        }
        toast.warning ("Esta sesión si está activa");
        setSelectedSessionId(id);
    };
    return (
        <div className="w-11/12 my-9 p-9 shadow-[0px_2px_0px_0px_rgba(24,25,31,1.00)]  outline-zinc-900 overflow-hidden rounded-xl bg-white/5  ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500 ">
                 
                    
            <div className="mb-8 ">
                    
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
                    Panel del Estudiante
                </h1>  
                <p className="text-sxl text-gray-300">
                {user?.wallet?.address}
                </p>
                <p className="text-sxl mb-8 text-gray-300">
                    Balance: {balance.toString()} tokens
                </p>
                {!isAllowed && (
                    <p className="text-sxl mb-8 text-rose-300 ">
                        No estás registrado como alumno permitido
                    </p>

                )}
            </div>

            {loading ? (
                        
                <p>Cargando sesiones...</p>
            ) : (
                <SessionList
                    sessions={sessions}
                    onSelectSession={handleSelectSession}
                />
            )}

            {selectedSessionId && (
                <ClaimTokenDialog
                    isOpen={true}
                    onClose={handleCloseDialog}
                    sessionId={selectedSessionId}
                />

            )}
                    
                    
        
        </div>
)}