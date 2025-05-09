// app/profeDashboard/CrearSesionForm.tsx
// o components/CrearSesionForm.tsx

"use client";

import { useState, useTransition } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { crearNuevaSesion, esperarReciboTransaccion } from '@/lib/services/onlyProfe'; // Ajusta la ruta
import type { Hex } from 'viem';

// Importaciones de shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Asumimos que Toaster ya está en el layout global

interface CrearSesionFormProps {
    onSesionCreada?: (sessionId: bigint, hashPalabra: Hex, deadline: bigint, txHash: Hex) => void;
}

export default function CrearSesionForm({ onSesionCreada }: CrearSesionFormProps) {
    const { user } = usePrivy();

    const [palabraSecreta, setPalabraSecreta] = useState<string>('');
    const [duracionDias, setDuracionDias] = useState<string>(''); // Se parseará a número/bigint
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            toast.error("Usuario no autenticado. Por favor, inicia sesión.");
            return;
        }

        if (!palabraSecreta.trim()) {
            toast.error("La palabra secreta no puede estar vacía.");
            return;
        }

        const duracionNum = parseInt(duracionDias, 10);
        if (isNaN(duracionNum) || duracionNum <= 0) {
            toast.error("La duración en días debe ser un número positivo.");
            return;
        }

        startTransition(async () => {
            const toastId = "crear-sesion-toast";
            try {
                toast.loading("Creando nueva sesión...", { id: toastId });

                const txHash = await crearNuevaSesion(palabraSecreta, BigInt(duracionNum));

                toast.loading(`Transacción enviada (${txHash.substring(0,10)}...). Esperando confirmación...`, { id: toastId });

                const receipt = await esperarReciboTransaccion(txHash);

                if (receipt.status === 'success') {
                    // Intentar parsear el evento SessionCreada para obtener el sessionId
                    let sessionId: bigint | undefined;
                    let sessionHash: Hex | undefined;
                    let sessionDeadline: bigint | undefined;

                    


                    setPalabraSecreta('');
                    setDuracionDias('');
                    if (onSesionCreada && sessionId !== undefined && sessionHash && sessionDeadline) {
                        onSesionCreada(sessionId, sessionHash, sessionDeadline, txHash);
                    } else if (onSesionCreada) {
                        console.warn("Callback onSesionCreada no llamado porque faltan datos del evento.");
                    }
                } else {
                    toast.error(`La transacción para crear la sesión falló. Estado: ${receipt.status}`, {
                        id: toastId,
                        description: `Transacción: ${txHash}`
                    });
                }

            } catch (e: any) {
                console.error("Error al crear sesión:", e);
                const errorMessage = e.shortMessage || e.message || "Ocurrió un error desconocido al crear la sesión.";
                toast.error(errorMessage, {
                    id: toastId,
                    description: "Por favor, revisa la consola para más detalles o inténtalo de nuevo."
                });
            }
        });
    };

    return (
        <Card className="w-full mt-4">
            <CardHeader>
                <CardTitle>Crear Nueva Sesión de Asistencia</CardTitle>
                <CardDescription>
                    Define una palabra secreta y la duración en días durante la cual los alumnos podrán reclamar tokens.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="palabraSecreta">Palabra Secreta</Label>
                        <Input
                            id="palabraSecreta"
                            type="text" // o "password" si quieres ocultarla mientras se escribe
                            value={palabraSecreta}
                            onChange={(e) => setPalabraSecreta(e.target.value)}
                            placeholder="Ej: test"
                            disabled={isPending}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="duracionDias">Duración (en días)</Label>
                        <Input
                            id="duracionDias"
                            type="number"
                            value={duracionDias}
                            onChange={(e) => setDuracionDias(e.target.value)}
                            placeholder="Ej: 7"
                            min="1"
                            disabled={isPending}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending || !palabraSecreta || !duracionDias} className="w-full">
                        {isPending ? 'Creando Sesión...' : 'Crear Sesión'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}