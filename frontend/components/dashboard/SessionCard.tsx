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

    if (session.activa) {
        return (
            <div
                className='p-4 border rounded-lg cursor-pointer transition-colors text-white
                      border-green-400'
                
            >
                <p className='font-semibold text-green-400'>Sesión #{session.id}</p>
                <p >Estado: ✅ Activa</p>
                <p>Fecha límite: {formatDeadline(session.deadline)}</p>
                <p className='underline hover:border-blue-500 '
                onClick={() => onSelect(session.id)} 
                >Ingresar palabra secreta &gt; </p>
            </div>
        );
    }

    return (
        <div
        className='p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-white
              border-red-400' 
    >
        <p className='font-semibold text-red-400'>Sesión #{session.id}</p>
        <p >Estado: ❌ Inactiva</p>
        <p>Fecha límite: {formatDeadline(session.deadline)}</p>
    </div>
    );
}
