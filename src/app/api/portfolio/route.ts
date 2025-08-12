import { NextRequest, NextResponse } from 'next/server'

// Mock portfolio data
const portfolioData = {
  totalValue: 8742350.50,
  totalGrowth: 18.4,
  dailyChange: 2.3,
  assets: [
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 125.75,
      value: 3456720.25,
      allocation: 39.5,
      apy: 12.4,
      protocol: "Aave v3",
      riskScore: 2.1,
      change24h: 3.2
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      amount: 2456890.75,
      value: 2456890.75,
      allocation: 28.1,
      apy: 8.7,
      protocol: "Compound",
      riskScore: 1.2,
      change24h: 0.1
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      amount: 24.33,
      value: 1567234.45,
      allocation: 17.9,
      apy: 6.8,
      protocol: "MakerDAO",
      riskScore: 1.8,
      change24h: 1.7
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      amount: 125430.50,
      value: 876245.30,
      allocation: 10.0,
      apy: 22.1,
      protocol: "Uniswap v4",
      riskScore: 3.4,
      change24h: 5.8
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      amount: 18765.25,
      value: 385259.75,
      allocation: 4.4,
      apy: 15.6,
      protocol: "Staking",
      riskScore: 2.3,
      change24h: -0.5
    }
  ],
  strategies: [
    {
      id: 1,
      name: "High Yield Farming",
      allocation: 35,
      apy: 18.5,
      riskLevel: "Medium",
      protocols: ["Uniswap", "SushiSwap", "Curve"]
    },
    {
      id: 2,
      name: "Stable Lending",
      allocation: 30,
      apy: 8.2,
      riskLevel: "Low",
      protocols: ["Aave", "Compound"]
    },
    {
      id: 3,
      name: "Liquid Staking",
      allocation: 25,
      apy: 12.4,
      riskLevel: "Low",
      protocols: ["Lido", "RocketPool"]
    },
    {
      id: 4,
      name: "Arbitrage Trading",
      allocation: 10,
      apy: 25.7,
      riskLevel: "High",
      protocols: ["1inch", "Paraswap"]
    }
  ],
  recentTransactions: [
    {
      id: 1,
      type: "rebalance",
      description: "Automated rebalancing of ETH position",
      amount: "$123,456",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: "completed"
    },
    {
      id: 2,
      type: "yield_claim",
      description: "Claimed rewards from Uniswap LP",
      amount: "$5,432",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "completed"
    },
    {
      id: 3,
      type: "risk_adjustment",
      description: "Reduced exposure to high-risk assets",
      amount: "$87,654",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: "completed"
    }
  ],
  performance: {
    day: 2.3,
    week: 7.8,
    month: 15.4,
    year: 18.4,
    total: 23.7
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }
    
    // Add some randomness to simulate real portfolio changes
    const dynamicData = {
      ...portfolioData,
      totalValue: portfolioData.totalValue + (Math.random() - 0.5) * 10000,
      dailyChange: portfolioData.dailyChange + (Math.random() - 0.5) * 2,
      assets: portfolioData.assets.map(asset => ({
        ...asset,
        change24h: asset.change24h + (Math.random() - 0.5) * 3
      })),
      lastUpdate: new Date().toISOString()
    }
    
    return NextResponse.json(dynamicData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, action, data } = body
    
    if (!address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }
    
    switch (action) {
      case 'rebalance':
        // Simulate rebalancing
        const rebalanceResult = {
          success: true,
          transactionId: `0x${Math.random().toString(16).substr(2, 64)}`,
          message: 'Portfolio rebalancing initiated',
          estimatedCompletion: new Date(Date.now() + 1000 * 60 * 5).toISOString()
        }
        return NextResponse.json(rebalanceResult)
        
      case 'deploy_agents':
        // Simulate agent deployment
        const deployResult = {
          success: true,
          agentsDeployed: 5,
          message: 'All AI agents successfully deployed',
          estimatedActivation: new Date(Date.now() + 1000 * 30).toISOString()
        }
        return NextResponse.json(deployResult)
        
      case 'update_strategy':
        // Simulate strategy update
        const strategyResult = {
          success: true,
          strategy: data.strategy,
          message: 'Investment strategy updated',
          newAllocation: data.allocation
        }
        return NextResponse.json(strategyResult)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}



