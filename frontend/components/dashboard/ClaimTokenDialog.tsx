//dashboard/ClaimTokenDialog.tsx`
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { claimTokens, waitForTransaction } from '@/lib/services/onlyStudentServices';

interface ClaimTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: number;
}

export function ClaimTokenDialog({ isOpen, onClose, sessionId }: ClaimTokenDialogProps) {
    const [secretWord, setSecretWord] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         if (!secretWord.trim()) return;

         setIsSubmitting(true);
         try {
             const hash = await claimTokens(sessionId, secretWord);

             toast("Transacción enviada. Procesando tu reclamo de tokens...");

             const { status } = await waitForTransaction(hash);

             if (status === 'success') {
                 toast.success("¡Has reclamado tus tokens exitosamente!");
                 onClose();
             } else {
                 throw new Error("Error al reclamar los tokens");
             }
         } catch (error: any) {
             console.error('Error al reclamar tokens:', error);
             toast.error("Error al reclamar los tokens");
         } finally {
             setIsSubmitting(false);
         }
     };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    
                    <DialogTitle>Reclamar Tokens</DialogTitle>
                    <DialogDescription>
                        Ingresa la palabra secreta para la sesión #{sessionId}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="secretWord"
                            placeholder="Palabra secreta"
                            className="col-span-4"
                            value={secretWord}
                            onChange={(e) => setSecretWord(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !secretWord.trim()}
                        className="w-full"
                    >
                        {isSubmitting ? "Reclamando..." : "Reclamar Tokens"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
