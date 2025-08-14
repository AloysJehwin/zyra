import { NextRequest, NextResponse } from 'next/server'
import DeFiDataService from '@/lib/services/defiDataService'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const test = searchParams.get('test') || 'market-data'

  try {
    const dataService = DeFiDataService.getInstance()

    switch (test) {
      case 'market-data': {
        // Test real-time market data fetching
        const summary = await dataService.getMarketSummary()
        return NextResponse.json({
          test: 'Real-time Market Data',
          success: true,
          data: {
            totalTVL: `$${(summary.totalTVL / 1e9).toFixed(2)}B`,
            protocolCount: summary.protocolCount,
            avgAPY: `${summary.avgAPY.toFixed(2)}%`,
            marketTrend: summary.marketTrend,
            topProtocols: summary.topProtocols.slice(0, 5),
            topTokens: summary.topTokens.slice(0, 5),
            dataTimestamp: summary.lastUpdate
          },
          message: 'Successfully fetched real-time DeFi market data from multiple APIs'
        })
      }

      case 'yield-opportunities': {
        // Test yield opportunities
        const opportunities = await dataService.getYieldOpportunities()
        const highYieldOpps = opportunities.filter(opp => opp.apy > 20)
        const lowRiskOpps = opportunities.filter(opp => opp.riskScore < 2.5)

        return NextResponse.json({
          test: 'Yield Opportunities Analysis',
          success: true,
          data: {
            totalOpportunities: opportunities.length,
            highYieldCount: highYieldOpps.length,
            lowRiskCount: lowRiskOpps.length,
            topOpportunities: opportunities.slice(0, 10).map(opp => ({
              protocol: opp.protocol,
              asset: opp.asset,
              apy: `${opp.apy.toFixed(2)}%`,
              tvl: `$${(opp.tvl / 1e6).toFixed(1)}M`,
              riskScore: `${opp.riskScore.toFixed(1)}/5`,
              category: opp.category,
              chain: opp.chain
            })),
            averageAPY: `${opportunities.reduce((sum, opp) => sum + opp.apy, 0) / opportunities.length}%`
          },
          message: 'Successfully analyzed real-time yield opportunities'
        })
      }

      case 'protocols': {
        // Test protocol data
        const protocols = await dataService.getDeFiProtocols()
        const riskDistribution = {
          low: protocols.filter(p => (p.riskScore || 2.5) < 2).length,
          medium: protocols.filter(p => (p.riskScore || 2.5) >= 2 && (p.riskScore || 2.5) <= 3.5).length,
          high: protocols.filter(p => (p.riskScore || 2.5) > 3.5).length
        }

        return NextResponse.json({
          test: 'DeFi Protocols Analysis',
          success: true,
          data: {
            totalProtocols: protocols.length,
            totalTVL: `$${protocols.reduce((sum, p) => sum + p.tvl, 0) / 1e9}B`,
            riskDistribution,
            topProtocols: protocols.slice(0, 10).map(p => ({
              name: p.name,
              tvl: `$${(p.tvl / 1e9).toFixed(2)}B`,
              category: p.category,
              chain: p.chain,
              riskScore: `${(p.riskScore || 2.5).toFixed(1)}/5`
            })),
            categories: [...new Set(protocols.map(p => p.category))].slice(0, 10)
          },
          message: 'Successfully analyzed DeFi protocols with risk scoring'
        })
      }

      case 'gas-prices': {
        // Test gas price data
        const gasPrices = await dataService.getGasPrices()
        
        return NextResponse.json({
          test: 'Real-time Gas Prices',
          success: true,
          data: {
            current: gasPrices,
            congestionLevel: gasPrices.fast > 50 ? 'High' : gasPrices.fast > 20 ? 'Medium' : 'Low',
            recommendation: gasPrices.standard < 15 ? 'Good time to transact' : 'Consider waiting for lower gas',
            costEstimates: {
              simpleTransfer: `$${(gasPrices.standard * 21000 * 2400 / 1e9).toFixed(2)}`,
              uniswapSwap: `$${(gasPrices.standard * 150000 * 2400 / 1e9).toFixed(2)}`,
              complexDeFi: `$${(gasPrices.standard * 300000 * 2400 / 1e9).toFixed(2)}`
            }
          },
          message: 'Successfully fetched real-time gas prices and cost estimates'
        })
      }

      case 'ai-integration': {
        // Test AI integration with real data
        const [summary, opportunities, gasPrices] = await Promise.all([
          dataService.getMarketSummary(),
          dataService.getYieldOpportunities(),
          dataService.getGasPrices()
        ])

        const aiContext = {
          marketSummary: {
            totalTVL: summary.totalTVL,
            trend: summary.marketTrend,
            protocolCount: summary.protocolCount,
            avgAPY: summary.avgAPY
          },
          topOpportunities: opportunities.slice(0, 5),
          gasPrices,
          dataTimestamp: new Date().toISOString()
        }

        return NextResponse.json({
          test: 'AI Integration with Real-time Data',
          success: true,
          data: {
            contextSize: JSON.stringify(aiContext).length,
            dataFreshness: 'real-time',
            marketInsights: {
              bullishSignals: summary.marketTrend === 'bullish' ? 3 : 1,
              highYieldCount: opportunities.filter(opp => opp.apy > 20).length,
              lowGasPeriod: gasPrices.standard < 15,
              optimalConditions: summary.marketTrend === 'bullish' && gasPrices.standard < 15
            },
            sampleAIPrompt: `Based on current market data: Total DeFi TVL is $${(summary.totalTVL / 1e9).toFixed(1)}B with ${summary.protocolCount} protocols. Market trend is ${summary.marketTrend}. Top yield opportunity: ${opportunities[0]?.protocol} offering ${opportunities[0]?.apy.toFixed(1)}% APY. Gas prices: ${gasPrices.standard} gwei. Provide investment recommendations.`,
            aiAgentsReady: ['Market Intelligence', 'Risk Manager', 'Yield Hunter', 'Portfolio Rebalancer', 'Transaction Optimizer']
          },
          message: 'AI agents are ready to provide real-time insights using current DeFi data'
        })
      }

      default:
        return NextResponse.json({
          availableTests: [
            'market-data - Test real-time market data fetching',
            'yield-opportunities - Test yield analysis',
            'protocols - Test protocol risk analysis',
            'gas-prices - Test gas price monitoring',
            'ai-integration - Test AI integration with real data'
          ],
          usage: 'Add ?test=<test-name> to the URL'
        })
    }
  } catch (error) {
    console.error('Real-time AI test error:', error)
    return NextResponse.json({
      test,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch real-time data - this might be due to API rate limits or network issues'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testType, mockQuery } = await request.json()
    
    if (testType === 'ai-agent-response') {
      // Simulate AI agent response with real data
      const dataService = DeFiDataService.getInstance()
      const [summary, opportunities] = await Promise.all([
        dataService.getMarketSummary(),
        dataService.getYieldOpportunities()
      ])

      const mockResponse = {
        agent: 'Market Intelligence Agent',
        query: mockQuery || 'What are the current market conditions?',
        response: `📊 **Current Market Analysis** (${new Date().toISOString()})

**Market Overview:**
- Total DeFi TVL: $${(summary.totalTVL / 1e9).toFixed(1)}B
- Market Trend: ${summary.marketTrend}
- Active Protocols: ${summary.protocolCount}
- Average APY: ${summary.avgAPY.toFixed(1)}%

**Key Insights:**
🔍 The DeFi ecosystem shows ${summary.marketTrend} sentiment with ${opportunities.filter(opp => opp.apy > 20).length} high-yield opportunities (>20% APY) currently available.

💎 **Top Opportunities:**
${opportunities.slice(0, 3).map((opp, i) => 
  `${i + 1}. ${opp.protocol} - ${opp.asset}: ${opp.apy.toFixed(1)}% APY (Risk: ${opp.riskScore.toFixed(1)}/5)`
).join('\n')}

**Confidence Level:** High (95%) - Based on real-time data from ${opportunities.length} protocols across multiple chains.`,
        realTimeData: true,
        dataTimestamp: new Date().toISOString(),
        marketContext: {
          totalTVL: summary.totalTVL,
          trend: summary.marketTrend,
          opportunitiesAnalyzed: opportunities.length
        }
      }

      return NextResponse.json({
        test: 'AI Agent Mock Response',
        success: true,
        data: mockResponse,
        message: 'AI agent response generated with real-time market data'
      })
    }

    return NextResponse.json({
      error: 'Invalid test type',
      availableTypes: ['ai-agent-response']
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process test request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}