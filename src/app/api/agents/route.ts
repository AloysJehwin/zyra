import { NextRequest, NextResponse } from 'next/server'

// Mock AI agent data
const agentsData = [
  {
    id: 0,
    name: "Market Intelligence Agent",
    role: "Trend Forecaster & Scanner",
    status: "Online",
    performance: {
      accuracy: "94.2%",
      opportunities: "1,247",
      uptime: "99.9%",
      lastUpdate: new Date().toISOString()
    },
    metrics: {
      trendsAnalyzed: 5420,
      successfulPredictions: 5108,
      avgResponseTime: "0.23s"
    },
    currentTasks: [
      "Analyzing ETH price movements",
      "Scanning new DeFi protocols",
      "Processing social sentiment"
    ]
  },
  {
    id: 1,
    name: "Yield Hunter Agent",
    role: "Opportunity Discovery",
    status: "Online",
    performance: {
      avgAPY: "15.2%",
      protocols: "47",
      positions: "156",
      lastUpdate: new Date().toISOString()
    },
    metrics: {
      opportunitiesFound: 342,
      totalValue: "$2.4M",
      avgYield: "15.2%"
    },
    currentTasks: [
      "Monitoring Aave v3 rates",
      "Evaluating new farming pools",
      "Calculating impermanent loss"
    ]
  },
  {
    id: 2,
    name: "Risk Manager Agent",
    role: "Security & Risk Assessment",
    status: "Online",
    performance: {
      threats: "2,847",
      accuracy: "98.5%",
      saved: "$2.4M",
      lastUpdate: new Date().toISOString()
    },
    metrics: {
      scamsDetected: 89,
      riskAssessments: 1205,
      falsePositives: "1.5%"
    },
    currentTasks: [
      "Auditing new protocols",
      "Risk scoring active positions",
      "Monitoring smart contracts"
    ]
  },
  {
    id: 3,
    name: "Transaction Orchestrator",
    role: "Execution & MEV Protection",
    status: "Online",
    performance: {
      gasAvg: "30%",
      mevBlocked: "847",
      success: "99.2%",
      lastUpdate: new Date().toISOString()
    },
    metrics: {
      transactionsExecuted: 3241,
      gasSaved: "$45,230",
      mevProtected: "$123,400"
    },
    currentTasks: [
      "Optimizing gas prices",
      "Executing rebalances",
      "Monitoring mempool"
    ]
  },
  {
    id: 4,
    name: "Portfolio Rebalancer",
    role: "Continuous Optimization",
    status: "Online",
    performance: {
      rebalances: "342",
      efficiency: "96.8%",
      returns: "18.4%",
      lastUpdate: new Date().toISOString()
    },
    metrics: {
      portfoliosManaged: 156,
      totalValue: "$8.7M",
      avgPerformance: "+18.4%"
    },
    currentTasks: [
      "Rebalancing portfolios",
      "Optimizing allocations",
      "Monitoring correlations"
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('id')
    
    if (agentId) {
      const agent = agentsData.find(a => a.id === parseInt(agentId))
      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }
      return NextResponse.json(agent)
    }
    
    // Return all agents with fresh timestamps
    const freshAgents = agentsData.map(agent => ({
      ...agent,
      performance: {
        ...agent.performance,
        lastUpdate: new Date().toISOString()
      }
    }))
    
    return NextResponse.json(freshAgents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, action } = body
    
    if (action === 'toggle') {
      const agent = agentsData.find(a => a.id === agentId)
      if (agent) {
        agent.status = agent.status === 'Online' ? 'Offline' : 'Online'
        return NextResponse.json({ success: true, agent })
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}



