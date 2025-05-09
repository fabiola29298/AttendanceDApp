'use client';

import { SessionCard } from '@/components/dashboard/SessionCard';
import { type Session } from '@/types/session'; // Crearemos este tipo después

interface SessionListProps {
    sessions: Record<number, Session>;
    onSelectSession: (id: number) => void;
}

export function SessionList({ sessions, onSelectSession }: SessionListProps) {
    if (Object.keys(sessions).length === 0) {
        return <p>No hay sesiones disponibles.</p>;
    }

    return (
        <div className="space-y-4">
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
            <h2 className="text-xl font-semibold mb-4 text-amber-50">Sesiones Disponibles</h2>
            <div className="grid gap-4">
                {Object.entries(sessions).map(([id, session]) => (
                    <SessionCard
                        key={id}
                        session={{ ...session, id: Number(id) }}
                        onSelect={onSelectSession}
                    />
                ))}
            </div>
        </div>
    );
}
