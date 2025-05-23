// my-app/providers/RootProvider.tsx
'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from "@/components/ui/sonner"

export default function RootProvider({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!privyAppId) {
    throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID env var");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ['email', 'wallet'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          appearance: {
            theme: 'dark',
            accentColor: '#676FFF',
          },
        }}
      >
        {children}
        <Toaster />
      </PrivyProvider>
    </ThemeProvider>
  );
}
