'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, polygon, bsc, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { projectId, metadata } from '../lib/config'

const queryClient = new QueryClient()

const networks = [mainnet, arbitrum, polygon, bsc, base]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    socials: ['google', 'github', 'apple', 'facebook'],
    email: true,
    onramp: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#667eea',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#667eea',
    '--w3m-border-radius-master': '12px'
  }
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}