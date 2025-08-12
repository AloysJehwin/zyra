import { NextRequest, NextResponse } from 'next/server'

// Mock market data
const marketData = {
  defiTotalValue: 87234567890,
  topOpportunities: [
    {
      protocol: "Aave v3",
      asset: "USDC",
      apy: 12.4,
      tvl: 2345678901,
      riskScore: 1.8,
      category: "Lending"
    },
    {
      protocol: "Uniswap v4",
      asset: "ETH/USDC",
      apy: 24.7,
      tvl: 1567890123,
      riskScore: 3.2,
      category: "Liquidity Providing"
    },
    {
      protocol: "Curve Finance",
      asset: "3CRV",
      apy: 8.9,
      tvl: 987654321,
      riskScore: 1.5,
      category: "Stable Swapping"
    },
    {
      protocol: "Yearn Finance",
      asset: "yvUSDC",
      apy: 15.6,
      tvl: 654321098,
      riskScore: 2.1,
      category: "Yield Farming"
    },
    {
      protocol: "Lido",
      asset: "stETH",
      apy: 5.2,
      tvl: 12345678901,
      riskScore: 1.3,
      category: "Liquid Staking"
    }
  ],
  trending: [
    {
      name: "LayerZero Farming",
      change: "+45.2%",
      volume: "$234M",
      trend: "up"
    },
    {
      name: "Real World Assets",
      change: "+23.1%",
      volume: "$156M",
      trend: "up"
    },
    {
      name: "Restaking Protocols",
      change: "+67.8%",
      volume: "$89M",
      trend: "up"
    }
  ],
  riskFactors: [
    {
      factor: "Smart Contract Risk",
      level: "Medium",
      description: "Recent audit findings in new protocols"
    },
    {
      factor: "Liquidity Risk",
      level: "Low",
      description: "High liquidity across major pools"
    },
    {
      factor: "Market Volatility",
      level: "High",
      description: "Increased volatility in crypto markets"
    }
  ],
  chainMetrics: [
    {
      chain: "Ethereum",
      tvl: 45678901234,
      gasPrice: 15.7,
      protocols: 847,
      status: "optimal"
    },
    {
      chain: "Arbitrum",
      tvl: 8901234567,
      gasPrice: 0.12,
      protocols: 234,
      status: "optimal"
    },
    {
      chain: "Polygon",
      tvl: 5678901234,
      gasPrice: 0.05,
      protocols: 156,
      status: "optimal"
    },
    {
      chain: "Base",
      tvl: 3456789012,
      gasPrice: 0.08,
      protocols: 89,
      status: "optimal"
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    // Add some randomness to simulate real market changes
    const dynamicData = {
      ...marketData,
      defiTotalValue: marketData.defiTotalValue + (Math.random() - 0.5) * 1000000000,
      topOpportunities: marketData.topOpportunities.map(opp => ({
        ...opp,
        apy: Math.max(0.1, opp.apy + (Math.random() - 0.5) * 2),
        tvl: opp.tvl + (Math.random() - 0.5) * 100000000
      })),
      chainMetrics: marketData.chainMetrics.map(chain => ({
        ...chain,
        gasPrice: Math.max(0.01, chain.gasPrice + (Math.random() - 0.5) * 2)
      })),
      lastUpdate: new Date().toISOString()
    }
    
    switch (type) {
      case 'opportunities':
        return NextResponse.json(dynamicData.topOpportunities)
      case 'trending':
        return NextResponse.json(dynamicData.trending)
      case 'risks':
        return NextResponse.json(dynamicData.riskFactors)
      case 'chains':
        return NextResponse.json(dynamicData.chainMetrics)
      default:
        return NextResponse.json(dynamicData)
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    switch (action) {
      case 'scan_opportunities':
        // Simulate opportunity scanning
        const scanResult = {
          success: true,
          newOpportunities: Math.floor(Math.random() * 5) + 1,
          averageAPY: 15.4 + (Math.random() - 0.5) * 5,
          scanTime: new Date().toISOString(),
          message: 'Market scan completed successfully'
        }
        return NextResponse.json(scanResult)
        
      case 'risk_assessment':
        // Simulate risk assessment
        const riskResult = {
          success: true,
          riskScore: Math.random() * 5,
          factors: [
            "Smart contract audits up to date",
            "High liquidity in target pools",
            "Market volatility within normal ranges"
          ],
          recommendation: "Proceed with standard risk parameters"
        }
        return NextResponse.json(riskResult)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to process market request' }, { status: 500 })
  }
}



