import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Agent state management
const agentStates = new Map<string, {
  isActive: boolean
  lastAnalysis: string
  recommendations: string[]
  performanceScore: number
  lastUpdate: Date
}>()

// Initialize agents
const agents = {
  'market-intelligence': {
    name: 'Market Intelligence Agent',
    description: 'Analyzes market trends, sentiment, and opportunities',
    systemPrompt: `You are ZYRA's Market Intelligence Agent. Analyze DeFi market conditions and provide insights.
    
    Rules:
    - Be concise but informative
    - Focus on actionable insights
    - Mention specific protocols and opportunities
    - Consider risk factors
    - Use emojis sparingly but effectively`,
    icon: '🧠'
  },
  'yield-hunter': {
    name: 'Yield Hunter Agent', 
    description: 'Finds optimal yield farming and staking opportunities',
    systemPrompt: `You are ZYRA's Yield Hunter Agent. Find and analyze the best yield opportunities in DeFi.
    
    Rules:
    - Compare APYs across different protocols
    - Consider impermanent loss risks
    - Factor in gas costs and entry barriers
    - Suggest diversification strategies
    - Be realistic about risks`,
    icon: '💎'
  },
  'risk-manager': {
    name: 'Risk Manager Agent',
    description: 'Monitors portfolio risks and suggests mitigation strategies', 
    systemPrompt: `You are ZYRA's Risk Manager Agent. Assess and manage portfolio risks in DeFi.
    
    Rules:
    - Identify potential risks (smart contract, liquidity, market)
    - Suggest risk mitigation strategies
    - Monitor correlation between assets
    - Recommend position sizing
    - Alert on unusual market conditions`,
    icon: '🛡️'
  },
  'transaction-optimizer': {
    name: 'Transaction Optimizer Agent',
    description: 'Optimizes gas usage and transaction timing',
    systemPrompt: `You are ZYRA's Transaction Optimizer Agent. Optimize transaction costs and timing.
    
    Rules:
    - Monitor gas prices and suggest optimal timing
    - Recommend batch transactions when possible
    - Consider MEV protection
    - Suggest alternative chains for lower costs
    - Factor in slippage and liquidity`,
    icon: '⚡'
  },
  'portfolio-rebalancer': {
    name: 'Portfolio Rebalancer Agent', 
    description: 'Maintains optimal asset allocation',
    systemPrompt: `You are ZYRA's Portfolio Rebalancer Agent. Maintain optimal portfolio balance.
    
    Rules:
    - Monitor asset allocation vs targets
    - Consider rebalancing costs vs benefits
    - Account for user's risk tolerance
    - Suggest gradual rebalancing strategies
    - Factor in market conditions and trends`,
    icon: '🔄'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agentType, userProfile, marketData, action } = await request.json()

    if (!agentType || !agents[agentType as keyof typeof agents]) {
      return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 })
    }

    const agent = agents[agentType as keyof typeof agents]
    
    switch (action) {
      case 'analyze':
        return await analyzeWithAgent(agent, userProfile, marketData)
      
      case 'activate':
        return await activateAgent(agentType, userProfile)
        
      case 'status':
        return await getAgentStatus(agentType)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('AI Agents API error:', error)
    return NextResponse.json(
      { error: 'Failed to process agent request' },
      { status: 500 }
    )
  }
}

interface Agent {
  name: string
  description: string
  systemPrompt: string
  icon: string
}

interface UserProfile {
  name?: string
  experience?: string
  riskTolerance?: string
  goals?: string[]
  preferredAssets?: string[]
}

interface MarketData {
  ethTrend?: string
  gasPrice?: string
  tvlTrend?: string
}

async function analyzeWithAgent(agent: Agent, userProfile: UserProfile, marketData: MarketData) {
  try {
    const contextPrompt = `
    User Profile:
    - Name: ${userProfile?.name || 'User'}
    - Experience: ${userProfile?.experience || 'Unknown'}
    - Risk Tolerance: ${userProfile?.riskTolerance || 'Moderate'}
    - Goals: ${userProfile?.goals?.join(', ') || 'General DeFi'}
    - Preferred Assets: ${userProfile?.preferredAssets?.join(', ') || 'ETH, BTC'}
    
    Market Context:
    - Current ETH price trend: ${marketData?.ethTrend || 'Stable'}
    - Gas prices: ${marketData?.gasPrice || 'Moderate'}
    - DeFi TVL trend: ${marketData?.tvlTrend || 'Growing'}
    
    Provide a brief analysis and 1-2 specific recommendations based on the user's profile.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: agent.systemPrompt },
        { role: "user", content: contextPrompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const analysis = response.choices[0]?.message?.content || 'Analysis unavailable'
    
    // Update agent state
    const agentKey = agent.name.toLowerCase().replace(/\s+/g, '-')
    agentStates.set(agentKey, {
      isActive: true,
      lastAnalysis: analysis,
      recommendations: analysis.split('.').slice(0, 2), // Extract first 2 sentences as recommendations
      performanceScore: 85 + Math.random() * 10, // Simulated performance score
      lastUpdate: new Date()
    })

    return NextResponse.json({
      success: true,
      agent: agent.name,
      analysis,
      icon: agent.icon,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Agent analysis error:', error)
    return NextResponse.json({
      success: false,
      error: 'AI analysis failed',
      agent: agent.name,
      fallback: `${agent.icon} ${agent.name}: Currently analyzing market conditions. Please try again in a moment.`
    })
  }
}

async function activateAgent(agentType: string, userProfile: UserProfile) {
  const agent = agents[agentType as keyof typeof agents]
  
  agentStates.set(agentType, {
    isActive: true,
    lastAnalysis: `${agent.icon} ${agent.name} is now active and monitoring for ${userProfile?.name || 'user'}`,
    recommendations: [],
    performanceScore: 95,
    lastUpdate: new Date()
  })

  return NextResponse.json({
    success: true,
    message: `${agent.icon} ${agent.name} activated successfully`,
    agent: agent.name,
    status: 'active'
  })
}

async function getAgentStatus(agentType: string) {
  const state = agentStates.get(agentType)
  const agent = agents[agentType as keyof typeof agents]
  
  if (!state) {
    return NextResponse.json({
      success: true,
      agent: agent.name,
      status: 'inactive',
      icon: agent.icon
    })
  }

  return NextResponse.json({
    success: true,
    agent: agent.name,
    status: state.isActive ? 'active' : 'inactive',
    lastAnalysis: state.lastAnalysis,
    performanceScore: state.performanceScore,
    lastUpdate: state.lastUpdate,
    icon: agent.icon
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'list':
        return NextResponse.json({
          success: true,
          agents: Object.entries(agents).map(([key, agent]) => ({
            id: key,
            name: agent.name,
            description: agent.description,
            icon: agent.icon,
            status: agentStates.get(key)?.isActive ? 'active' : 'inactive'
          }))
        })

      case 'status-all':
        const allStatuses = Object.entries(agents).map(([key, agent]) => {
          const state = agentStates.get(key)
          return {
            id: key,
            name: agent.name,
            icon: agent.icon,
            status: state?.isActive ? 'active' : 'inactive',
            performanceScore: state?.performanceScore || 0,
            lastUpdate: state?.lastUpdate || null
          }
        })
        
        return NextResponse.json({
          success: true,
          agents: allStatuses,
          activeCount: allStatuses.filter(a => a.status === 'active').length
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Agents GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get agent information' },
      { status: 500 }
    )
  }
}