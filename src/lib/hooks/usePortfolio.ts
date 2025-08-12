'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export interface Asset {
  symbol: string
  name: string
  amount: number
  value: number
  allocation: number
  apy: number
  protocol: string
  riskScore: number
  change24h: number
}

export interface Strategy {
  id: number
  name: string
  allocation: number
  apy: number
  riskLevel: string
  protocols: string[]
}

export interface Transaction {
  id: number
  type: string
  description: string
  amount: string
  timestamp: string
  status: string
}

export interface Portfolio {
  totalValue: number
  totalGrowth: number
  dailyChange: number
  assets: Asset[]
  strategies: Strategy[]
  recentTransactions: Transaction[]
  performance: {
    day: number
    week: number
    month: number
    year: number
    total: number
  }
  lastUpdate?: string
}

export function usePortfolio() {
  const { address } = useAccount()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolio = async () => {
    if (!address) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/portfolio?address=${address}`)
      if (!response.ok) throw new Error('Failed to fetch portfolio')
      const data = await response.json()
      setPortfolio(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const rebalancePortfolio = async () => {
    if (!address) throw new Error('Wallet not connected')

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, action: 'rebalance' })
      })
      if (!response.ok) throw new Error('Failed to rebalance portfolio')
      const result = await response.json()
      
      // Refresh portfolio data
      await fetchPortfolio()
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deployAgents = async () => {
    if (!address) throw new Error('Wallet not connected')

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, action: 'deploy_agents' })
      })
      if (!response.ok) throw new Error('Failed to deploy agents')
      const result = await response.json()
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateStrategy = async (strategy: string, allocation: number) => {
    if (!address) throw new Error('Wallet not connected')

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address, 
          action: 'update_strategy',
          data: { strategy, allocation }
        })
      })
      if (!response.ok) throw new Error('Failed to update strategy')
      const result = await response.json()
      
      // Refresh portfolio data
      await fetchPortfolio()
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchPortfolio()
    
    // Refresh data every 15 seconds when wallet is connected
    if (address) {
      const interval = setInterval(fetchPortfolio, 15000)
      return () => clearInterval(interval)
    }
  }, [address])

  return {
    portfolio,
    loading,
    error,
    refetch: fetchPortfolio,
    rebalancePortfolio,
    deployAgents,
    updateStrategy,
    isConnected: !!address
  }
}



