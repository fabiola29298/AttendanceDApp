///onlyProfe.ts
import { publicClient } from '@/lib/viem';
import { CONTRACT_ABI, CONTRACT_ADDRESS, CONTRACT_PROFE_ROLE_HASH } from '@/lib/contract';
import { getWalletClient } from '@/lib/viem';  
import {
    type Hex,
    keccak256,
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
            args: [BigInt(alumnoAddress)],
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
): Promise<string> {
    
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