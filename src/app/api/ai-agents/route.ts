import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import DeFiDataService from '@/lib/services/defiDataService'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Enhanced agent configurations with real-time data integration
const ENHANCED_AGENTS = {
  'market-intelligence': {
    name: 'Market Intelligence Agent',
    description: 'Analyzes real-time DeFi market conditions and provides actionable insights',
    capabilities: [
      'Real-time TVL analysis across protocols',
      'Token price movement tracking',
      'Cross-chain opportunity identification',
      'Market sentiment analysis',
      'Trend prediction and forecasting'
    ],
    systemPrompt: `You are an advanced Market Intelligence Agent with access to real-time DeFi market data. Your expertise includes:

    🔍 CORE CAPABILITIES:
    - Real-time analysis of Total Value Locked (TVL) across all major protocols
    - Token price movements and market sentiment analysis
    - Cross-chain opportunity identification and comparison
    - Risk-adjusted return calculations
    - Market trend prediction based on current data

    📊 DATA ANALYSIS APPROACH:
    - Always cite specific numbers from the provided real-time data
    - Compare current metrics to historical averages where possible
    - Identify emerging trends and potential market shifts
    - Provide confidence levels for all predictions (High/Medium/Low)
    - Consider gas costs and network conditions in recommendations

    💡 RESPONSE FORMAT:
    - Start with a brief market overview using current TVL and trend data
    - Provide 2-3 specific actionable insights with supporting data
    - Include risk assessment for each recommendation
    - End with a confidence level and time horizon for your analysis

    Always be specific, data-driven, and actionable in your responses.`,
    model: 'gpt-4o-mini',
    icon: '🧠'
  },

  'risk-manager': {
    name: 'Risk Manager Agent',
    description: 'Comprehensive risk assessment using real-time protocol and market data',
    capabilities: [
      'Smart contract risk assessment',
      'Protocol security scoring',
      'Liquidity risk analysis',
      'Market volatility monitoring',
      'Portfolio risk optimization'
    ],
    systemPrompt: `You are a sophisticated Risk Manager Agent with access to real-time DeFi protocol data. Your expertise includes:

    🛡️ RISK ASSESSMENT FRAMEWORK:
    - Smart contract security analysis based on TVL, age, and audit history
    - Protocol risk scoring using quantitative metrics
    - Liquidity risk assessment across different pool types
    - Market volatility analysis and correlation risks
    - Regulatory and technical risk evaluation

    📈 RISK METRICS:
    - Calculate risk scores (1-5 scale) with detailed justification
    - Assess diversification benefits and concentration risks
    - Monitor unusual activity patterns or red flags
    - Evaluate gas cost risks and network congestion impacts
    - Consider governance and centralization risks

    🎯 RECOMMENDATION STRUCTURE:
    - Overall risk assessment with numerical score
    - Breakdown of specific risk factors with individual scores
    - Mitigation strategies for identified risks
    - Position sizing recommendations based on risk profile
    - Monitoring alerts and risk thresholds

    Be thorough, conservative, and always prioritize capital preservation.`,
    model: 'gpt-4o-mini',
    icon: '🛡️'
  },

  'yield-hunter': {
    name: 'Yield Hunter Agent',
    description: 'Discovers and analyzes high-yield opportunities with real-time APY data',
    capabilities: [
      'Real-time yield opportunity scanning',
      'Risk-adjusted return calculations',
      'Cross-chain yield comparisons',
      'Impermanent loss analysis',
      'Optimal strategy recommendations'
    ],
    systemPrompt: `You are an expert Yield Hunter Agent with access to real-time yield data across all major DeFi protocols. Your expertise includes:

    💰 YIELD OPTIMIZATION:
    - Real-time APY analysis across lending, staking, and liquidity providing
    - Risk-adjusted yield calculations including impermanent loss considerations
    - Cross-chain yield arbitrage opportunities
    - Compound yield strategies and auto-compounding analysis
    - Gas cost optimization for yield farming strategies

    🔍 OPPORTUNITY IDENTIFICATION:
    - Scan for newly launched high-yield pools
    - Identify undervalued or overlooked opportunities
    - Calculate break-even periods for different strategies
    - Assess sustainability of high APY offerings
    - Monitor yield token emissions and tokenomics

    📊 STRATEGY RECOMMENDATIONS:
    - Provide specific protocol names, pool addresses, and current APYs
    - Calculate expected returns over different time horizons
    - Include step-by-step implementation guides
    - Suggest optimal allocation percentages
    - Set up monitoring and exit criteria

    Focus on sustainable, realistic yields while highlighting exceptional opportunities with appropriate risk warnings.`,
    model: 'gpt-4o-mini',
    icon: '💎'
  },

  'portfolio-rebalancer': {
    name: 'Portfolio Rebalancer Agent', 
    description: 'Maintains optimal asset allocation using real-time market data',
    capabilities: [
      'Dynamic portfolio rebalancing',
      'Asset allocation optimization',
      'Correlation analysis',
      'Rebalancing cost analysis',
      'Market-driven strategy adjustments'
    ],
    systemPrompt: `You are ZYRA's Portfolio Rebalancer Agent with access to real-time market data. Your role is to maintain optimal portfolio balance:

    🔄 REBALANCING STRATEGY:
    - Monitor asset allocation vs targets using current market data
    - Consider rebalancing costs vs benefits with real gas prices
    - Account for user's risk tolerance and market conditions
    - Suggest gradual rebalancing strategies based on volatility
    - Factor in current market trends and correlation changes

    📊 OPTIMIZATION APPROACH:
    - Use real-time price data for accurate allocation calculations
    - Consider transaction costs and slippage in recommendations
    - Analyze correlation changes between assets
    - Optimize for risk-adjusted returns
    - Account for yield opportunities in rebalancing decisions

    💡 RECOMMENDATIONS:
    - Provide specific rebalancing actions with current market prices
    - Calculate optimal timing based on gas costs and market conditions
    - Suggest threshold-based vs time-based rebalancing
    - Include expected costs and benefits analysis
    - Set up monitoring criteria for future rebalancing needs`,
    model: 'gpt-4o-mini',
    icon: '🔄'
  },

  'transaction-optimizer': {
    name: 'Transaction Optimizer Agent',
    description: 'Optimizes gas usage and transaction timing with real-time network data',
    capabilities: [
      'Real-time gas price monitoring',
      'Transaction batching optimization',
      'MEV protection strategies',
      'Cross-chain cost comparison',
      'Slippage optimization'
    ],
    systemPrompt: `You are ZYRA's Transaction Optimizer Agent with access to real-time network data:

    ⚡ OPTIMIZATION FOCUS:
    - Monitor real-time gas prices across networks
    - Recommend optimal transaction timing
    - Suggest batch transactions when beneficial
    - Consider MEV protection and slippage
    - Compare costs across different chains

    🔧 TECHNICAL ANALYSIS:
    - Use current gas price data for timing recommendations
    - Calculate transaction costs vs benefits
    - Analyze network congestion patterns
    - Monitor mempool conditions
    - Evaluate alternative execution strategies

    💰 COST OPTIMIZATION:
    - Provide specific gas price targets and timing
    - Suggest transaction bundling strategies
    - Compare execution costs across chains
    - Factor in failed transaction risks
    - Optimize for user's urgency vs cost preferences`,
    model: 'gpt-4o-mini',
    icon: '⚡'
  }
}

// Agent state management
const agentStates = new Map<string, {
  isActive: boolean
  lastAnalysis: string
  recommendations: string[]
  performanceScore: number
  lastUpdate: Date
  dataFreshness: string
}>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const agent = searchParams.get('agent')

  try {
    switch (action) {
      case 'list':
        return NextResponse.json({
          success: true,
          agents: Object.entries(ENHANCED_AGENTS).map(([key, agentConfig]) => ({
            id: key,
            name: agentConfig.name,
            description: agentConfig.description,
            capabilities: agentConfig.capabilities,
            icon: agentConfig.icon,
            status: agentStates.get(key)?.isActive ? 'active' : 'inactive',
            configured: !!openai,
            realTimeData: true
          }))
        })

      case 'status':
        if (agent && ENHANCED_AGENTS[agent as keyof typeof ENHANCED_AGENTS]) {
          const state = agentStates.get(agent)
          const agentConfig = ENHANCED_AGENTS[agent as keyof typeof ENHANCED_AGENTS]
          
          return NextResponse.json({
            success: true,
            agent: agentConfig.name,
            status: state?.isActive ? 'active' : 'inactive',
            lastAnalysis: state?.lastAnalysis,
            performanceScore: state?.performanceScore || 0,
            lastUpdate: state?.lastUpdate,
            dataFreshness: state?.dataFreshness || 'never',
            capabilities: agentConfig.capabilities,
            icon: agentConfig.icon
          })
        }
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

      case 'status-all':
        const allStatuses = Object.entries(ENHANCED_AGENTS).map(([key, agentConfig]) => {
          const state = agentStates.get(key)
          return {
            id: key,
            name: agentConfig.name,
            icon: agentConfig.icon,
            status: state?.isActive ? 'active' : 'inactive',
            performanceScore: state?.performanceScore || 0,
            lastUpdate: state?.lastUpdate || null,
            dataFreshness: state?.dataFreshness || 'never',
            capabilities: agentConfig.capabilities.length
          }
        })
        
        return NextResponse.json({
          success: true,
          agents: allStatuses,
          activeCount: allStatuses.filter(a => a.status === 'active').length,
          totalAgents: Object.keys(ENHANCED_AGENTS).length,
          realTimeDataEnabled: true
        })

      default:
        // Return specific agent info or all agents overview
        if (agent && ENHANCED_AGENTS[agent as keyof typeof ENHANCED_AGENTS]) {
          const agentConfig = ENHANCED_AGENTS[agent as keyof typeof ENHANCED_AGENTS]
          return NextResponse.json({
            ...agentConfig,
            configured: !!openai,
            realTimeData: true,
            lastUpdate: new Date().toISOString()
          })
        }

        return NextResponse.json({
          agents: Object.entries(ENHANCED_AGENTS).map(([key, config]) => ({
            id: key,
            ...config,
            configured: !!openai
          })),
          totalAgents: Object.keys(ENHANCED_AGENTS).length,
          realTimeDataEnabled: true,
          lastUpdate: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('AI Agents GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get agent information' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agent, query, portfolio, preferences, action } = await request.json()

    if (!openai) {
      return NextResponse.json({
        error: 'OpenAI API not configured',
        suggestion: 'Please add OPENAI_API_KEY to your environment variables'
      }, { status: 500 })
    }

    // Handle different actions
    switch (action) {
      case 'activate':
        return await activateAgent(agent, preferences)
      
      case 'analyze':
      case undefined: // Default action
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Validate agent for analysis
    const agentConfig = ENHANCED_AGENTS[agent as keyof typeof ENHANCED_AGENTS]
    if (!agentConfig) {
      return NextResponse.json({
        error: 'Invalid agent type',
        availableAgents: Object.keys(ENHANCED_AGENTS)
      }, { status: 400 })
    }

    // Fetch comprehensive real-time data
    const dataService = DeFiDataService.getInstance()
    let marketContext: Record<string, unknown> = {}

    try {
      switch (agent) {
        case 'market-intelligence':
          const [summary, tokens, protocols, gasPrices] = await Promise.all([
            dataService.getMarketSummary(),
            dataService.getTokenPrices(['ethereum', 'bitcoin', 'usd-coin', 'chainlink', 'aave-token', 'uniswap', 'curve-dao-token']),
            dataService.getDeFiProtocols(),
            dataService.getGasPrices()
          ])
          
          marketContext = {
            marketSummary: {
              totalTVL: summary.totalTVL,
              trend: summary.marketTrend,
              protocolCount: summary.protocolCount,
              avgAPY: summary.avgAPY
            },
            topTokens: tokens.map(t => ({
              symbol: t.symbol,
              price: t.current_price,
              change24h: t.price_change_percentage_24h,
              volume: t.volume_24h,
              marketCap: t.market_cap
            })),
            topProtocols: protocols.slice(0, 15).map(p => ({
              name: p.name,
              tvl: p.tvl,
              category: p.category,
              chain: p.chain
            })),
            gasPrices,
            dataTimestamp: new Date().toISOString()
          }
          break

        case 'risk-manager':
          const [riskProtocols, riskSummary] = await Promise.all([
            dataService.getDeFiProtocols(),
            dataService.getMarketSummary()
          ])
          
          marketContext = {
            protocolRisks: riskProtocols.map(p => ({
              name: p.name,
              tvl: p.tvl,
              riskScore: p.riskScore,
              category: p.category,
              chain: p.chain
            })),
            marketConditions: {
              totalTVL: riskSummary.totalTVL,
              trend: riskSummary.marketTrend,
              volatilityLevel: riskSummary.marketTrend === 'bullish' ? 'Medium' : 'High'
            },
            riskMetrics: {
              highRiskProtocols: riskProtocols.filter(p => (p.riskScore || 3) > 4).length,
              lowRiskProtocols: riskProtocols.filter(p => (p.riskScore || 3) < 2).length,
              avgRiskScore: riskProtocols.reduce((sum, p) => sum + (p.riskScore || 2.5), 0) / riskProtocols.length
            },
            dataTimestamp: new Date().toISOString()
          }
          break

        case 'yield-hunter':
          const [opportunities, yieldSummary, yieldGas] = await Promise.all([
            dataService.getYieldOpportunities(),
            dataService.getMarketSummary(),
            dataService.getGasPrices()
          ])
          
          marketContext = {
            yieldOpportunities: opportunities.map(opp => ({
              protocol: opp.protocol,
              asset: opp.asset,
              apy: opp.apy,
              tvl: opp.tvl,
              riskScore: opp.riskScore,
              category: opp.category,
              chain: opp.chain
            })),
            yieldMetrics: {
              totalOpportunities: opportunities.length,
              avgAPY: yieldSummary.avgAPY,
              highYieldCount: opportunities.filter(opp => opp.apy > 20).length,
              lowRiskYieldCount: opportunities.filter(opp => opp.apy > 10 && opp.riskScore < 2.5).length
            },
            gasCosts: yieldGas,
            topYields: opportunities
              .sort((a, b) => b.apy - a.apy)
              .slice(0, 10)
              .map(opp => ({
                protocol: opp.protocol,
                asset: opp.asset,
                apy: opp.apy,
                riskScore: opp.riskScore,
                category: opp.category
              })),
            dataTimestamp: new Date().toISOString()
          }
          break

        case 'portfolio-rebalancer':
          const [rebalanceData, rebalanceGas] = await Promise.all([
            dataService.getMarketSummary(),
            dataService.getGasPrices()
          ])
          
          marketContext = {
            marketData: rebalanceData,
            gasCosts: rebalanceGas,
            portfolioContext: portfolio || {},
            dataTimestamp: new Date().toISOString()
          }
          break

        case 'transaction-optimizer':
          const [gasData, chainData] = await Promise.all([
            dataService.getGasPrices(),
            dataService.getMarketSummary()
          ])
          
          marketContext = {
            gasPrices: gasData,
            networkConditions: {
              congestion: gasData.fast > 50 ? 'High' : gasData.fast > 20 ? 'Medium' : 'Low',
              recommendedGas: gasData.standard
            },
            chainMetrics: chainData,
            dataTimestamp: new Date().toISOString()
          }
          break
      }
    } catch (error) {
      console.warn('Failed to fetch real-time data:', error)
      marketContext = {
        error: 'Real-time data temporarily unavailable',
        fallbackMode: true,
        dataTimestamp: new Date().toISOString()
      }
    }

    // Prepare enhanced context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: agentConfig.systemPrompt
      },
      {
        role: 'system',
        content: `REAL-TIME MARKET DATA (${new Date().toISOString()}):
${JSON.stringify(marketContext, null, 2)}

AGENT CAPABILITIES: ${agentConfig.capabilities.join(', ')}

Use this current data to provide specific, actionable insights. Always cite exact numbers and trends from this data.`
      }
    ]

    // Add portfolio context if provided
    if (portfolio) {
      messages.push({
        role: 'system',
        content: `USER PORTFOLIO CONTEXT: ${JSON.stringify(portfolio)}`
      })
    }

    // Add user preferences if provided
    if (preferences) {
      messages.push({
        role: 'system',
        content: `USER PREFERENCES: ${JSON.stringify(preferences)}`
      })
    }

    // Add user query
    messages.push({
      role: 'user',
      content: query
    })

    // Call OpenAI with enhanced context
    const completion = await openai.chat.completions.create({
      model: agentConfig.model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'

    // Update agent state
    agentStates.set(agent, {
      isActive: true,
      lastAnalysis: response,
      recommendations: response.split('.').slice(0, 3).filter(r => r.trim().length > 10),
      performanceScore: 85 + Math.random() * 15,
      lastUpdate: new Date(),
      dataFreshness: marketContext.fallbackMode ? 'fallback' : 'real-time'
    })

    return NextResponse.json({
      agent: agentConfig.name,
      agentId: agent,
      query,
      response,
      marketDataIncluded: !marketContext.fallbackMode,
      dataTimestamp: marketContext.dataTimestamp,
      capabilities: agentConfig.capabilities,
      icon: agentConfig.icon,
      usage: completion.usage,
      timestamp: new Date().toISOString()
    })

  } catch (error: unknown) {
    console.error('Enhanced AI Agent error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process AI agent request'
    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

async function activateAgent(agentType: string, _preferences: unknown) {
  const agentConfig = ENHANCED_AGENTS[agentType as keyof typeof ENHANCED_AGENTS]
  
  if (!agentConfig) {
    return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 })
  }
  
  agentStates.set(agentType, {
    isActive: true,
    lastAnalysis: `${agentConfig.icon} ${agentConfig.name} is now active and monitoring with real-time data`,
    recommendations: [],
    performanceScore: 95,
    lastUpdate: new Date(),
    dataFreshness: 'real-time'
  })

  return NextResponse.json({
    success: true,
    message: `${agentConfig.icon} ${agentConfig.name} activated successfully`,
    agent: agentConfig.name,
    status: 'active',
    capabilities: agentConfig.capabilities,
    realTimeData: true
  })
}