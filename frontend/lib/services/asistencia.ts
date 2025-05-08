///asistencia.ts
import { publicClient } from '@/lib/viem';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { getWalletClient } from '@/lib/viem';
import type { Session } from '@/types/session';

export async function getAllSessions(): Promise<Record<number, Session>> {
    try {
        const sessionsData: Record<number, Session> = {};
        let currentId = 1;
        let continueSearching = true;

        while (continueSearching) {
            try {
                const [hash, deadline, activa] = await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'obtenerSesion',
                    args: [BigInt(currentId)],
                }) as [string, bigint, boolean];

                sessionsData[currentId] = {
                    id: currentId,
                    hash,
                    deadline: Number(deadline),
                    activa,
                };

                currentId++;
            } catch (error) {
                continueSearching = false;
            }
        }

        return sessionsData;
    } catch (error) {
        console.error('Error fetching all sessions:', error);
        throw error;
    }
}

export async function isAllowedStudent(address: string): Promise<boolean> {
    try {
        const isAllowed = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'alumnosPermitidos',
            args: [address],
        }) as boolean;

        return isAllowed;
    } catch (error) {
        console.error('Error checking if student is allowed:', error);
        throw error;
    }
}

export async function getTokenBalance(address: string): Promise<bigint> {
    try {
        const balance = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'balanceOf',
            args: [address],
        }) as bigint;

        return balance;
    } catch (error) {
        console.error('Error getting token balance:', error);
        throw error;
    }
}


export async function claimTokens(
    sessionId: number,
    secretWord: string
): Promise<string> {
    try {
        const { walletClient, address } = await getWalletClient();

        const hash = await walletClient.writeContract({
            account: address,
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'reclamarTokens',
            args: [BigInt(sessionId), secretWord],
        });

        return hash;
    } catch (error) {
        console.error('Error claiming tokens:', error);
        throw error;
    }
}

export async function waitForTransaction(
    hash: string
): Promise<{ status: 'success' | 'error' }> {
    try {
        const receipt = await publicClient.waitForTransactionReceipt({
            hash: hash as `0x${string}`
        });

        return {
            status: receipt.status === 'success' ? 'success' : 'error'
        };
    } catch (error) {
        console.error('Error waiting for transaction:', error);
        throw error;
    }
}
