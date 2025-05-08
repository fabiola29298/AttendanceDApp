//components/dashboard/SessionCard.tsx
import { type Session } from '@/types/session';

interface SessionCardProps {
    session: Session;
    onSelect: (id: number) => void;
}

export function SessionCard({ session, onSelect }: SessionCardProps) {

    const formatDeadline = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <div
            className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors
                ${session.activa ? 'border-green-500' : 'border-red-500'}`}
            onClick={() => onSelect(session.id)}
        >
            <p className="font-semibold">Sesión #{session.id}</p>
            <p>Estado: {session.activa ? '✅ Activa' : '❌ Inactiva'}</p>
            <p>Fecha límite: {formatDeadline(session.deadline)}</p>
        </div>
    );
}
