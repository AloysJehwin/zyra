import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import DeFiDataService from '@/lib/services/defiDataService'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Agent configurations for different AI agents
const AGENT_CONFIGS = {
  'market-intelligence': {
    systemPrompt: `You are a DeFi Market Intelligence Agent with access to real-time market data. Analyze current market conditions and provide actionable insights. Focus on:
    - Current DeFi market conditions and TVL trends
    - Token price movements and market sentiment
    - Protocol performance and adoption
    - Emerging opportunities and risks
    - Cross-chain analysis
    
    Use the provided real-time market data to give specific, current insights. Always include confidence levels and cite specific data points.`,
    model: 'gpt-4o-mini'
  },
  'risk-manager': {
    systemPrompt: `You are a DeFi Risk Management Agent with access to real-time protocol data. Your role is to:
    - Assess smart contract risks based on TVL, age, and audit status
    - Analyze protocol security and risk scores
    - Detect potential red flags in new protocols
    - Provide comprehensive risk assessments
    - Suggest risk mitigation strategies
    
    Use the provided real-time data to assess current risk levels. Be specific about risk scores and provide clear recommendations.`,
    model: 'gpt-4o-mini'
  },
  'yield-hunter': {
    systemPrompt: `You are a Yield Hunting Agent with access to real-time yield data from multiple DeFi protocols. Focus on:
    - Current high-yield opportunities with real APY data
    - Risk-adjusted yield analysis
    - Liquidity pool performance
    - Cross-chain yield opportunities
    - Gas cost considerations
    
    Use the provided real-time yield data to recommend specific opportunities. Include exact APYs, TVL, risk scores, and implementation details.`,
    model: 'gpt-4o-mini'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agent, query, context } = await request.json()
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured' 
      }, { status: 500 })
    }

    // Validate agent type
    const agentConfig = AGENT_CONFIGS[agent as keyof typeof AGENT_CONFIGS]
    if (!agentConfig) {
      return NextResponse.json({ 
        error: 'Invalid agent type' 
      }, { status: 400 })
    }

    // Fetch real-time market data
    const dataService = DeFiDataService.getInstance()
    let realTimeData: Record<string, unknown> = {}

    try {
      switch (agent) {
        case 'market-intelligence':
          const [summary, tokens, protocols] = await Promise.all([
            dataService.getMarketSummary(),
            dataService.getTokenPrices(),
            dataService.getDeFiProtocols()
          ])
          realTimeData = {
            marketSummary: summary,
            topTokens: tokens.slice(0, 10),
            topProtocols: protocols.slice(0, 10),
            dataTimestamp: new Date().toISOString()
          }
          break

        case 'risk-manager':
          const [riskProtocols, marketData] = await Promise.all([
            dataService.getDeFiProtocols(),
            dataService.getMarketSummary()
          ])
          realTimeData = {
            protocols: riskProtocols.map(p => ({
              name: p.name,
              tvl: p.tvl,
              riskScore: p.riskScore,
              category: p.category,
              chain: p.chain
            })),
            marketTrend: marketData.marketTrend,
            totalTVL: marketData.totalTVL,
            dataTimestamp: new Date().toISOString()
          }
          break

        case 'yield-hunter':
          const [opportunities, gasPrices, yieldSummary] = await Promise.all([
            dataService.getYieldOpportunities(),
            dataService.getGasPrices(),
            dataService.getMarketSummary()
          ])
          realTimeData = {
            yieldOpportunities: opportunities,
            gasPrices,
            avgAPY: yieldSummary.avgAPY,
            topYields: opportunities.slice(0, 15),
            dataTimestamp: new Date().toISOString()
          }
          break
      }
    } catch (dataError) {
      console.warn('Failed to fetch real-time data, using cached/fallback:', dataError)
      realTimeData = {
        error: 'Real-time data temporarily unavailable',
        fallbackMode: true,
        dataTimestamp: new Date().toISOString()
      }
    }

    // Prepare messages with real-time context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: agentConfig.systemPrompt
      },
      {
        role: 'system',
        content: `REAL-TIME MARKET DATA (${new Date().toISOString()}):\n${JSON.stringify(realTimeData, null, 2)}\n\nUse this current data in your analysis and responses. Cite specific numbers and trends from this data.`
      }
    ]

    // Add additional context if provided
    if (context) {
      messages.push({
        role: 'system',
        content: `Additional Context: ${JSON.stringify(context)}`
      })
    }

    // Add user query
    messages.push({
      role: 'user',
      content: query
    })

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: agentConfig.model,
      messages,
      temperature: 0.7,
      max_tokens: 1500, // Increased for more detailed responses
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({
      agent,
      query,
      response,
      realTimeData: {
        included: !realTimeData.fallbackMode,
        timestamp: realTimeData.dataTimestamp,
        summary: realTimeData.fallbackMode ? 'Fallback mode - limited data' : 'Real-time data included'
      },
      timestamp: new Date().toISOString(),
      usage: completion.usage
    })

  } catch (error: unknown) {
    console.error('OpenAI API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process AI request'
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// GET endpoint for agent capabilities
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agent = searchParams.get('agent')

  if (agent && AGENT_CONFIGS[agent as keyof typeof AGENT_CONFIGS]) {
    const config = AGENT_CONFIGS[agent as keyof typeof AGENT_CONFIGS]
    return NextResponse.json({
      agent,
      capabilities: config.systemPrompt,
      model: config.model,
      available: !!process.env.OPENAI_API_KEY
    })
  }

  return NextResponse.json({
    availableAgents: Object.keys(AGENT_CONFIGS),
    configured: !!process.env.OPENAI_API_KEY
  })
}