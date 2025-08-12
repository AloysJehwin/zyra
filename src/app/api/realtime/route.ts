import { NextRequest } from 'next/server'
import { sendNotificationToSubscribers } from '../telegram/route'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'
  
  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      
      const sendEvent = (data: Record<string, unknown>, event?: string) => {
        const message = `${event ? `event: ${event}\n` : ''}data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }
      
      // Send initial connection confirmation
      sendEvent({ type: 'connection', status: 'connected', timestamp: new Date().toISOString() })
      
      // Simulate real-time updates
      const interval = setInterval(async () => {
        const updates = generateRealtimeUpdates(type)
        updates.forEach(update => {
          sendEvent(update, update.type)
        })
        
        // DISABLED: No more spam notifications
        // await sendTelegramNotifications(updates)
      }, 3000) // Send updates every 3 seconds
      
      // Cleanup function
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

function generateRealtimeUpdates(type: string) {
  const updates = []
  const timestamp = new Date().toISOString()
  
  if (type === 'all' || type === 'agents') {
    // Agent performance updates
    updates.push({
      type: 'agent_update',
      agentId: Math.floor(Math.random() * 5),
      performance: {
        accuracy: (90 + Math.random() * 10).toFixed(1) + '%',
        lastActivity: timestamp,
        tasksCompleted: Math.floor(Math.random() * 10) + 1
      },
      timestamp
    })
  }
  
  if (type === 'all' || type === 'portfolio') {
    // Portfolio value updates
    updates.push({
      type: 'portfolio_update',
      totalValue: 8742350 + (Math.random() - 0.5) * 50000,
      dailyChange: (Math.random() - 0.5) * 5,
      activePositions: Math.floor(Math.random() * 20) + 150,
      timestamp
    })
  }
  
  if (type === 'all' || type === 'market') {
    // Market opportunity updates
    updates.push({
      type: 'market_opportunity',
      protocol: ['Aave v3', 'Uniswap v4', 'Curve', 'Yearn'][Math.floor(Math.random() * 4)],
      apy: (5 + Math.random() * 20).toFixed(1) + '%',
      tvl: (Math.random() * 1000000000).toFixed(0),
      action: Math.random() > 0.5 ? 'new_opportunity' : 'rate_change',
      timestamp
    })
  }
  
  if (type === 'all' || type === 'transactions') {
    // Transaction updates
    if (Math.random() > 0.7) { // 30% chance of transaction
      updates.push({
        type: 'transaction_update',
        txId: `0x${Math.random().toString(16).substr(2, 64)}`,
        action: ['rebalance', 'claim_rewards', 'compound', 'hedge'][Math.floor(Math.random() * 4)],
        amount: '$' + (Math.random() * 10000).toFixed(2),
        status: Math.random() > 0.1 ? 'completed' : 'pending',
        gasOptimization: (Math.random() * 40).toFixed(1) + '%',
        timestamp
      })
    }
  }
  
  if (type === 'all' || type === 'alerts') {
    // Risk alerts and notifications
    if (Math.random() > 0.8) { // 20% chance of alert
      const alertTypes = [
        { level: 'info', message: 'New yield opportunity detected' },
        { level: 'warning', message: 'Market volatility increasing' },
        { level: 'success', message: 'Portfolio rebalancing completed' },
        { level: 'low', message: 'Risk assessment updated' }
      ]
      const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      
      updates.push({
        type: 'alert',
        level: alert.level,
        message: alert.message,
        timestamp
      })
    }
  }
  
  return updates
}

interface Update {
  type: string
  agentId?: number
  performance?: {
    accuracy: string
    lastActivity: string
    tasksCompleted: number
  }
  totalValue?: number
  dailyChange?: number
  activePositions?: number
  protocol?: string
  apy?: string
  tvl?: string
  action?: string
  txId?: string
  amount?: string
  status?: string
  gasOptimization?: string
  level?: string
  message?: string
  timestamp: string
}

async function sendTelegramNotifications(updates: Update[]) {
  for (const update of updates) {
    try {
      let message = ''
      let type: 'info' | 'success' | 'warning' | 'error' = 'info'

      switch (update.type) {
        case 'portfolio_update':
          if (Math.abs(update.dailyChange) > 5) { // Only send if significant change
            const changeEmoji = update.dailyChange >= 0 ? '📈' : '📉'
            const change = update.dailyChange >= 0 ? '+' : ''
            message = `💼 Portfolio Alert!\n\n${changeEmoji} ${change}${update.dailyChange.toFixed(2)}% today\n💰 Total: $${update.totalValue.toLocaleString()}`
            type = update.dailyChange >= 0 ? 'success' : 'warning'
          }
          break

        case 'agent_update':
          if (Math.random() > 0.8) { // Send occasional agent updates
            message = `🤖 Agent Update\n\nAgent #${update.agentId} completed ${update.performance.tasksCompleted} tasks\nAccuracy: ${update.performance.accuracy}`
          }
          break

        case 'market_opportunity':
          if (parseFloat(update.apy) > 15) { // High yield opportunities
            message = `💎 High Yield Alert!\n\n🏦 ${update.protocol}\n💹 APY: ${update.apy}\n💰 TVL: $${parseFloat(update.tvl).toLocaleString()}`
            type = 'success'
          }
          break

        case 'transaction_update':
          if (update.status === 'completed') {
            message = `✅ Transaction Complete\n\n🔄 ${update.action}\n💰 ${update.amount}\n⛽ Gas saved: ${update.gasOptimization}`
            type = 'success'
          }
          break

        case 'alert':
          if (update.level === 'warning' || update.level === 'error') {
            message = `⚠️ ${update.message}`
            type = update.level === 'error' ? 'error' : 'warning'
          }
          break
      }

      if (message) {
        await sendNotificationToSubscribers(message, type)
      }
    } catch (error) {
      console.error('Failed to send Telegram notification for update:', update, error)
    }
  }
}



