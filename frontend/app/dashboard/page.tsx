//dashboard/page.tsx
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { SessionList } from '@/components/dashboard/SessionList';
import { ClaimTokenDialog } from '@/components/dashboard/ClaimTokenDialog';
import { getAllSessions, isAllowedStudent, getTokenBalance } from '@/lib/services/asistencia';
import type { Session } from '@/types/session';
import { toast } from "sonner";

export default function Dashboard() {
    const { authenticated, user } = usePrivy();
    const router = useRouter();
    const [sessions, setSessions] = useState<Record<number, Session>>({});
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

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

    const handleCloseDialog = () => {
        setSelectedSessionId(null);
    };

    if (!authenticated) return null;

    return (
        <div className="p-8">
            <Navbar />
            <div className="mb-8">
                <h1 className="text-3xl font-semibold">
                    Bienvenido, {user?.wallet?.address}
                </h1>
                <p className="mt-2">
                    Balance: {balance.toString()} tokens
                </p>
                {!isAllowed && (
                    <p className="text-red-500 mt-2">
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
    );
}
