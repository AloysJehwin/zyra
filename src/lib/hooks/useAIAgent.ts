'use client'

import { useState } from 'react'

export interface AIAgentResponse {
  agent: string
  query: string
  response: string
  timestamp: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface AIAgentError {
  error: string
  details?: unknown
}

export function useAIAgent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryAgent = async (
    agent: 'market-intelligence' | 'risk-manager' | 'yield-hunter',
    query: string,
    context?: Record<string, unknown>
  ): Promise<AIAgentResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent,
          query,
          context
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to query AI agent')
      }

      return data as AIAgentResponse
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('AI Agent error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getMarketInsights = async (query: string = "What are the current DeFi market trends and opportunities?") => {
    return queryAgent('market-intelligence', query)
  }

  const assessRisk = async (protocol: string, query?: string) => {
    const riskQuery = query || `Assess the risk level of ${protocol} protocol. Provide a risk score and analysis.`
    return queryAgent('risk-manager', riskQuery, { protocol })
  }

  const findYieldOpportunities = async (query: string = "Find the best high-yield DeFi opportunities right now") => {
    return queryAgent('yield-hunter', query)
  }

  const getAgentCapabilities = async (agent?: string) => {
    try {
      const url = agent ? `/api/ai?agent=${agent}` : '/api/ai'
      const response = await fetch(url)
      return await response.json()
    } catch (err) {
      console.error('Failed to fetch agent capabilities:', err)
      return null
    }
  }

  return {
    loading,
    error,
    queryAgent,
    getMarketInsights,
    assessRisk,
    findYieldOpportunities,
    getAgentCapabilities
  }
}

export function useMarketIntelligence() {
  const { loading, error, queryAgent } = useAIAgent()

  const analyzeMarket = async (query: string) => {
    return queryAgent('market-intelligence', query)
  }

  const analyzeTrends = async () => {
    return queryAgent('market-intelligence', 
      "Analyze current DeFi market trends, identify emerging opportunities, and provide trading recommendations with confidence levels."
    )
  }

  const analyzeProtocol = async (protocol: string) => {
    return queryAgent('market-intelligence', 
      `Provide detailed analysis of ${protocol} including market position, recent developments, and future outlook.`,
      { protocol }
    )
  }

  return {
    loading,
    error,
    analyzeMarket,
    analyzeTrends,
    analyzeProtocol
  }
}

export function useRiskManager() {
  const { loading, error, queryAgent } = useAIAgent()

  const assessProtocolRisk = async (protocol: string) => {
    return queryAgent('risk-manager',
      `Conduct a comprehensive risk assessment of ${protocol}. Include smart contract risks, market risks, and provide a risk score from 1-10.`,
      { protocol }
    )
  }

  const detectScams = async (protocolAddress: string) => {
    return queryAgent('risk-manager',
      `Analyze this protocol/contract for potential scam indicators: ${protocolAddress}. Check for common red flags and provide a safety assessment.`,
      { address: protocolAddress }
    )
  }

  const getPortfolioRiskAnalysis = async (positions: Record<string, unknown>[]) => {
    return queryAgent('risk-manager',
      "Analyze this portfolio for overall risk exposure and provide recommendations for risk mitigation.",
      { positions }
    )
  }

  return {
    loading,
    error,
    assessProtocolRisk,
    detectScams,
    getPortfolioRiskAnalysis
  }
}

export function useYieldHunter() {
  const { loading, error, queryAgent } = useAIAgent()

  const findHighYieldOpportunities = async (minAPY?: number) => {
    const query = minAPY 
      ? `Find high-yield DeFi opportunities with APY above ${minAPY}%. Include specific protocols, risks, and implementation steps.`
      : "Find the current best high-yield DeFi opportunities. Include APYs, protocols, and step-by-step instructions."
    
    return queryAgent('yield-hunter', query, { minAPY })
  }

  const optimizeStrategy = async (currentAPY: number, riskTolerance: 'low' | 'medium' | 'high') => {
    return queryAgent('yield-hunter',
      `I'm currently earning ${currentAPY}% APY with ${riskTolerance} risk tolerance. Suggest better yield farming strategies and optimizations.`,
      { currentAPY, riskTolerance }
    )
  }

  const comparePools = async (pools: string[]) => {
    return queryAgent('yield-hunter',
      `Compare these DeFi pools and recommend the best option: ${pools.join(', ')}. Include APYs, risks, and liquidity considerations.`,
      { pools }
    )
  }

  return {
    loading,
    error,
    findHighYieldOpportunities,
    optimizeStrategy,
    comparePools
  }
}