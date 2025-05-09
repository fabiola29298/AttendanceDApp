///onlyProfe.ts
import { publicClient } from '@/lib/viem';
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_PROFE_ROLE_HASH } from '@/lib/contract';
import { getWalletClient } from '@/lib/viem';  
import {
    type Hex,
    keccak256,
    parseAbiItem,
    decodeEventLog,
    stringToBytes
} from 'viem';
/*
export async function getProfeRoleBytes(): Promise<Hex> {
    try {
        const role = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'PROFE_ROLE',
        });
        return role as Hex;
    } catch (error) {
        console.error("Error obteniendo PROFE_ROLE:", error);
        throw error;
    }
}
*/ 
/**
 * Verifica si una dirección tiene el rol de profe.
 * @param role El hash del rol  PROFE_ROLE 
 * @param accountAddress La dirección de la cuenta a verificar.
 * @returns true si la cuenta tiene el rol, false en caso contrario.
 */
export async function checkHasProfeRole(  accountAddress: string): Promise<boolean> {
    try {
        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [CONTRACT_PROFE_ROLE_HASH, accountAddress],
        });
        return hasRole as boolean;
    } catch (error) {
        console.error(`Error verificando el rol PROFE_ROLE para la cuenta ${accountAddress}:`, error);
        throw error;
    }
}
 

/**
 * Registra un nuevo alumno. Solo puede ser llamado por una cuenta con PROFE_ROLE.
 * @param alumnoAddress Dirección del alumno a registrar.
 * @param userWalletSession Sesión del usuario (profesor) para obtener el WalletClient.
 * @returns El hash de la transacción.
 */
export async function registrarAlumno(
    alumnoAddress: Hex
): Promise<string> {
    
    try {
        const {walletClient, address} = await getWalletClient(); 
        const hash = await walletClient.writeContract({
            account: address,
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'registrarAlumno',
            args: [alumnoAddress],
        }); 
        return hash;
    } catch (error) {
        console.error(`Error al registrar alumno ${alumnoAddress}:`, error);
        throw error;
    }
}


/**
 * Crea una nueva sesión de asistencia. Solo puede ser llamado por una cuenta con PROFE_ROLE.
 * @param palabraSecreta La palabra secreta para la sesión (se hasheará antes de enviar).
 * @param duracionEnDias Duración en días para la ventana de reclamación.
 * @param userWalletSession Sesión del usuario (profesor) para obtener el WalletClient.
 * @returns El hash de la transacción.
 */
export async function crearNuevaSesion(
    palabraSecreta: string,
    duracionEnDias: bigint, // Usar bigint para uint256 
): Promise<Hex> {
    
    try {
        const { walletClient, address }  = await getWalletClient();
        // El contrato espera un bytes32 hasheado.
        const hashPalabraSecreta = keccak256(stringToBytes(palabraSecreta));

        const hash = await walletClient.writeContract({
            account: address,
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'crearSesion',
            args: [hashPalabraSecreta, duracionEnDias],
        }); 
        return hash;
    } catch (error) {
        console.error(`Error al crear sesión:`, error);
        throw error;
    }
}
// --- FUNCIONES AUXILIARES ---

/**
 * Calcula el hash Keccak256 de una palabra, tal como lo haría Solidity.
 * @param palabra La palabra a hashear.
 * @returns El hash en formato Hex (0x...).
 */
export function calcularHashPalabra(palabra: string): Hex {
    return keccak256(stringToBytes(palabra));
}

export async function esperarReciboTransaccion(txHash: Hex)
: Promise<{ status: 'success' | 'error' }>  {
    try {
        const transactionReceipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
        });
        return {
             status: transactionReceipt.status === 'success' ? 'success' : 'error'
        };
    } catch (error) {
        console.error(`Error esperando el recibo de la transacción ${txHash}:`, error);
        throw error;
    }
}

const sessionCreadaEventAbi = parseAbiItem('event SessionCreada(uint256 indexed sessionId, bytes32 hash, uint256 deadline)');

export function parsearEventoSessionCreada(logs: any[]) { // `any[]` porque el tipo exacto de log depende de la fuente
    const eventoDecodificado = logs.map(log => {
        try {
            // Asegúrate que el log.topics y log.data existan y sean del formato esperado
            if (log.topics && log.data && log.topics[0] === keccak256(stringToBytes("SessionCreada(uint256,bytes32,uint256)"))) {
                 return decodeEventLog({
                    abi: [sessionCreadaEventAbi], // ABI debe ser un array
                    data: log.data as Hex,
                    topics: log.topics as [Hex, ...Hex[]],
                });
            }
        } catch (e) {
            // No es el evento que buscamos o hay un error al decodificar
        }
        return null;
    }).find(decoded => decoded && decoded.eventName === 'SessionCreada');

    if (eventoDecodificado && eventoDecodificado.args) {
        return {
            eventName: eventoDecodificado.eventName,
            sessionId: (eventoDecodificado.args as any).sessionId as bigint,
            hash: (eventoDecodificado.args as any).hash as Hex,
            deadline: (eventoDecodificado.args as any).deadline as bigint,
        };
    }
    return null;
}