'use client'

import { useState, useEffect, useRef } from 'react'

export interface RealtimeUpdate {
  type: string
  [key: string]: any
  timestamp: string
}

export function useRealtime(type: 'all' | 'agents' | 'portfolio' | 'market' | 'transactions' | 'alerts' = 'all') {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const connect = () => {
    if (eventSourceRef.current) return

    try {
      const eventSource = new EventSource(`/api/realtime?type=${type}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setConnected(true)
        setError(null)
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setUpdates(prev => [data, ...prev.slice(0, 99)]) // Keep last 100 updates
        } catch (err) {
          console.error('Failed to parse SSE data:', err)
        }
      }

      // Handle specific event types
      eventSource.addEventListener('agent_update', (event) => {
        const data = JSON.parse(event.data)
        setUpdates(prev => [data, ...prev.slice(0, 99)])
      })

      eventSource.addEventListener('portfolio_update', (event) => {
        const data = JSON.parse(event.data)
        setUpdates(prev => [data, ...prev.slice(0, 99)])
      })

      eventSource.addEventListener('market_opportunity', (event) => {
        const data = JSON.parse(event.data)
        setUpdates(prev => [data, ...prev.slice(0, 99)])
      })

      eventSource.addEventListener('transaction_update', (event) => {
        const data = JSON.parse(event.data)
        setUpdates(prev => [data, ...prev.slice(0, 99)])
      })

      eventSource.addEventListener('alert', (event) => {
        const data = JSON.parse(event.data)
        setUpdates(prev => [data, ...prev.slice(0, 99)])
      })

      eventSource.onerror = (event) => {
        setConnected(false)
        setError('Connection lost. Attempting to reconnect...')
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            eventSourceRef.current = null
            connect()
          }
        }, 3000)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
    }
  }

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setConnected(false)
    }
  }

  const clearUpdates = () => {
    setUpdates([])
  }

  const getLatestUpdate = (updateType: string) => {
    return updates.find(update => update.type === updateType)
  }

  const getUpdatesByType = (updateType: string) => {
    return updates.filter(update => update.type === updateType)
  }

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [type])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    updates,
    connected,
    error,
    connect,
    disconnect,
    clearUpdates,
    getLatestUpdate,
    getUpdatesByType
  }
}

// Hook for getting specific types of updates
export function useAgentUpdates() {
  const { updates, connected, error } = useRealtime('agents')
  return {
    agentUpdates: updates.filter(u => u.type === 'agent_update'),
    connected,
    error
  }
}

export function usePortfolioUpdates() {
  const { updates, connected, error } = useRealtime('portfolio')
  return {
    portfolioUpdates: updates.filter(u => u.type === 'portfolio_update'),
    connected,
    error
  }
}

export function useMarketUpdates() {
  const { updates, connected, error } = useRealtime('market')
  return {
    marketUpdates: updates.filter(u => u.type === 'market_opportunity'),
    connected,
    error
  }
}

export function useTransactionUpdates() {
  const { updates, connected, error } = useRealtime('transactions')
  return {
    transactionUpdates: updates.filter(u => u.type === 'transaction_update'),
    connected,
    error
  }
}

export function useAlerts() {
  const { updates, connected, error } = useRealtime('alerts')
  return {
    alerts: updates.filter(u => u.type === 'alert'),
    connected,
    error
  }
}



