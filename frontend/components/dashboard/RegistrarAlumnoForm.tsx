// app/profeDashboard/RegistrarAlumnoForm.tsx
// o components/RegistrarAlumnoForm.tsx

"use client";

import { useState, useTransition } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { registrarAlumno, esperarReciboTransaccion } from '@/lib/services/onlyProfeServices'; // Ajusta la ruta
import type { Hex } from 'viem';
import { isAddress } from 'viem';

// Importaciones de shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Para notificaciones

interface RegistrarAlumnoFormProps {
    onAlumnoRegistrado?: (address: Hex, txHash: Hex) => void;
}

export default function RegistrarAlumnoForm({ onAlumnoRegistrado }: RegistrarAlumnoFormProps) {
    const { user } = usePrivy();

    const [alumnoAddress, setAlumnoAddress] = useState<string>('');
    // useTransition es útil para manejar estados de pendiente sin bloquear la UI
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            toast.error("Usuario no autenticado. Por favor, inicia sesión.");
            return;
        }

        if (!isAddress(alumnoAddress)) {
            toast.error("La dirección del alumno no es válida. Asegúrate que comience con 0x.");
            return;
        }

        startTransition(async () => {
            try {
                toast.loading("Enviando transacción para registrar al alumno...", { id: "register-alumno" });

                const txHash = await registrarAlumno(alumnoAddress) as Hex;

                toast.loading(`Transacción enviada (${txHash.substring(0,10)}...). Esperando confirmación...`, { id: "register-alumno" });

                const receipt = await esperarReciboTransaccion(txHash);

                if (receipt.status === 'success') {
                    toast.success(`¡Alumno ${alumnoAddress.substring(0,6)}...${alumnoAddress.substring(alumnoAddress.length - 4)} registrado exitosamente!`, {
                        id: "register-alumno",
                        description: `Transacción: ${txHash}`,
                        action: {
                            label: "Ver en Etherscan",
                            onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank') // Cambia a tu explorador de bloques
                        }
                    });
                    setAlumnoAddress(''); // Limpiar el input
                    if (onAlumnoRegistrado) {
                        onAlumnoRegistrado(alumnoAddress as Hex, txHash);
                    }
                } else {
                    toast.error(`La transacción para registrar al alumno falló. Estado: ${receipt.status}`, {
                        id: "register-alumno",
                        description: `Transacción: ${txHash}`
                    });
                }

            } catch (e) {
                console.error("Error al registrar alumno:", e);
                // Intentar mostrar un mensaje de error más específico si es posible
                const errorMessage = `Ocurrió un error desconocido al registrar al alumno. ${e}`;
                toast.error(errorMessage, {
                    id: "register-alumno",
                    description: "Por favor, revisa la consola para más detalles o inténtalo de nuevo."
                });
            }
        });
    };

    return (
        <>
             
            <Card className="w-full mt-4">
                <CardHeader>
                    <CardTitle>Registrar Nuevo Alumno</CardTitle>
                    <CardDescription>
                        Ingresa la dirección Ethereum del alumno que deseas permitir reclamar tokens de asistencia.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="alumnoAddress">Dirección del Alumno</Label>
                                <Input
                                    id="alumnoAddress"
                                    type="text"
                                    value={alumnoAddress}
                                    onChange={(e) => setAlumnoAddress(e.target.value)}
                                    placeholder="0x000000...."
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isPending || !alumnoAddress} className="w-full">
                            {isPending ? 'Registrando...' : 'Registrar Alumno'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}