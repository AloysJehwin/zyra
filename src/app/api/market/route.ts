import { NextRequest, NextResponse } from 'next/server'
import DeFiDataService from '@/lib/services/defiDataService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const dataService = DeFiDataService.getInstance()
    
    switch (type) {
      case 'opportunities': {
        const opportunities = await dataService.getYieldOpportunities()
        return NextResponse.json(opportunities)
      }
      
      case 'protocols': {
        const protocols = await dataService.getDeFiProtocols()
        return NextResponse.json(protocols)
      }
      
      case 'tokens': {
        const tokens = await dataService.getTokenPrices()
        return NextResponse.json(tokens)
      }
      
      case 'gas': {
        const gasPrices = await dataService.getGasPrices()
        return NextResponse.json(gasPrices)
      }
      
      case 'summary': {
        const summary = await dataService.getMarketSummary()
        return NextResponse.json(summary)
      }
      
      case 'chain': {
        const chain = searchParams.get('name') || 'ethereum'
        const chainData = await dataService.getChainData(chain)
        return NextResponse.json(chainData)
      }
      
      default: {
        // Return comprehensive market data
        const [summary, opportunities, protocols, tokens, gasPrices] = await Promise.all([
          dataService.getMarketSummary(),
          dataService.getYieldOpportunities(),
          dataService.getDeFiProtocols(),
          dataService.getTokenPrices(),
          dataService.getGasPrices()
        ])
        
        return NextResponse.json({
          summary,
          topOpportunities: opportunities.slice(0, 10),
          topProtocols: protocols.slice(0, 10),
          topTokens: tokens.slice(0, 10),
          gasPrices,
          lastUpdate: new Date().toISOString()
        })
      }
    }
  } catch (error) {
    console.error('Market data fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch real-time market data',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    const dataService = DeFiDataService.getInstance()
    
    switch (action) {
      case 'scan_opportunities': {
        const opportunities = await dataService.getYieldOpportunities()
        const highYieldOpps = opportunities.filter(opp => opp.apy > 20)
        
        return NextResponse.json({
          success: true,
          newOpportunities: opportunities.length,
          highYieldCount: highYieldOpps.length,
          averageAPY: opportunities.reduce((sum, opp) => sum + opp.apy, 0) / opportunities.length,
          topOpportunity: opportunities[0],
          scanTime: new Date().toISOString(),
          message: `Found ${opportunities.length} opportunities, ${highYieldOpps.length} with >20% APY`
        })
      }
        
      case 'risk_assessment': {
        const protocols = await dataService.getDeFiProtocols()
        const avgRisk = protocols.reduce((sum, p) => sum + (p.riskScore || 2.5), 0) / protocols.length
        
        return NextResponse.json({
          success: true,
          averageRiskScore: avgRisk,
          lowRiskProtocols: protocols.filter(p => (p.riskScore || 2.5) < 2).length,
          highRiskProtocols: protocols.filter(p => (p.riskScore || 2.5) > 4).length,
          factors: [
            `${protocols.length} protocols analyzed`,
            `Average risk score: ${avgRisk.toFixed(2)}/5`,
            "Risk assessment based on TVL, age, and category"
          ],
          recommendation: avgRisk < 2.5 ? "Market conditions favorable" : "Exercise increased caution",
          timestamp: new Date().toISOString()
        })
      }
      
      case 'refresh_data': {
        dataService.clearCache()
        const summary = await dataService.getMarketSummary()
        
        return NextResponse.json({
          success: true,
          message: 'Data cache refreshed',
          marketSummary: summary,
          timestamp: new Date().toISOString()
        })
      }
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Market action error:', error)
    return NextResponse.json({ 
      error: 'Failed to process market request',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}



