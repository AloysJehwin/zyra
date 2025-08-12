import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Agent configurations for different AI agents
const AGENT_CONFIGS = {
  'market-intelligence': {
    systemPrompt: `You are a DeFi Market Intelligence Agent. Analyze market trends, provide insights on DeFi protocols, and predict market movements. Focus on:
    - Current DeFi market conditions
    - Yield farming opportunities
    - Risk assessments
    - Token analysis
    - Protocol updates and news
    
    Always provide actionable insights with confidence levels.`,
    model: 'gpt-4o-mini'
  },
  'risk-manager': {
    systemPrompt: `You are a DeFi Risk Management Agent. Your role is to:
    - Assess smart contract risks
    - Detect potential scams and rugpulls
    - Analyze protocol security
    - Provide risk scores
    - Suggest risk mitigation strategies
    
    Be cautious and thorough in your analysis.`,
    model: 'gpt-4o-mini'
  },
  'yield-hunter': {
    systemPrompt: `You are a Yield Hunting Agent specialized in finding the best DeFi opportunities. Focus on:
    - High-yield farming opportunities
    - Liquidity mining programs
    - Staking rewards
    - Cross-chain yield opportunities
    - APY calculations and comparisons
    
    Provide specific protocols, APYs, and implementation strategies.`,
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

    // Prepare messages with context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: agentConfig.systemPrompt
      }
    ]

    // Add context if provided
    if (context) {
      messages.push({
        role: 'system',
        content: `Context: ${JSON.stringify(context)}`
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
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({
      agent,
      query,
      response,
      timestamp: new Date().toISOString(),
      usage: completion.usage
    })

  } catch (error: any) {
    console.error('OpenAI API error:', error)
    
    return NextResponse.json({ 
      error: error.message || 'Failed to process AI request',
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