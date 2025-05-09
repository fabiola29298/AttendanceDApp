//dashboard/page.tsx
'use client'; 
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

import { checkHasProfeRole } from '@/lib/services/onlyProfe'; // Ajusta la ruta
import type { Hex } from 'viem';
import ProfesorDashboardContent from "./ProfesorDashboardContent";
import StudentDashboardContent from "./StudentDashboardContent";

 
function LoadingComponent() {
    return <p>Cargando datos del usuario y rol...</p>;
}

export default function Dashboard() {
    const { ready, authenticated, user, logout } = usePrivy();
    const router = useRouter();
 
    const [isProfe, setIsProfe] = useState<boolean | null>(null);
    const [isLoadingRole, setIsLoadingRole] = useState<boolean>(true);

    useEffect(() => {
        if (ready && !authenticated) {
            router.push('/');
        }
        if (ready && authenticated && user?.wallet?.address) {
            const userAddress = user.wallet.address as Hex;
            setIsLoadingRole(true);

            checkHasProfeRole(userAddress)
                .then((hasRole) => {
                    setIsProfe(hasRole);
                })
                .catch((error) => {
                    console.error("Error al verificar el rol de profesor:", error);
                    setIsProfe(false);
                })
                .finally(() => {
                    setIsLoadingRole(false);
                });
        } else if (ready && authenticated && !user?.wallet?.address) {
            console.warn("Usuario autenticado pero sin dirección de wallet.");
            setIsProfe(false);
            setIsLoadingRole(false);
        }
    }, [authenticated, router]);
    const handleLogout = async () => {
        await logout();
        router.push('/');
    };
    
     

    if (!ready || (authenticated && isLoadingRole && isProfe === null) ) {
        return <LoadingComponent />;
    }

    if (!authenticated && ready) { // Asegurarse que ready sea true antes de mostrar contenido de no autenticado
        return (
            <div>
                <p>Por favor, inicia sesión para acceder al dashboard.</p>
                 {/* Aquí podría ir tu botón de login de AuthButtons si no está en un layout */}
            </div>
        );
    }

    // Solo renderizar dashboards si estamos autenticados y el rol ha sido determinado
    if (authenticated && isProfe !== null) {
        return (
            <>
                <button onClick={handleLogout} style={{ position: 'absolute', top: 10, right: 10 }}>Logout</button>
                {isProfe ? <ProfesorDashboardContent /> : <StudentDashboardContent />}
            </>
        );
    }
    if (!authenticated) return null;

    return <LoadingComponent />;
}
