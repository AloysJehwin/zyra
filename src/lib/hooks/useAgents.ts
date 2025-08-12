'use client'

import { useState, useEffect } from 'react'

export interface Agent {
  id: number
  name: string
  role: string
  status: 'Online' | 'Offline'
  performance: {
    [key: string]: string
    lastUpdate: string
  }
  metrics?: {
    [key: string]: string | number
  }
  currentTasks?: string[]
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      setAgents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const toggleAgent = async (agentId: number) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action: 'toggle' })
      })
      if (!response.ok) throw new Error('Failed to toggle agent')
      const result = await response.json()
      
      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId ? result.agent : agent
      ))
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  useEffect(() => {
    fetchAgents()
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAgents, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    toggleAgent
  }
}

export function useAgent(agentId: number) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/agents?id=${agentId}`)
      if (!response.ok) throw new Error('Failed to fetch agent')
      const data = await response.json()
      setAgent(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgent()
    
    // Refresh data every 10 seconds for individual agent
    const interval = setInterval(fetchAgent, 10000)
    return () => clearInterval(interval)
  }, [agentId])

  return {
    agent,
    loading,
    error,
    refetch: fetchAgent
  }
}



