import { NextRequest, NextResponse } from 'next/server'

// Store user notification preferences and last sent data
const notificationStates = new Map<number, {
  lastPortfolioValue: number
  lastGasPrices: number
  lastAlertTime: Date
  preferences: string[]
  minimumChangeThreshold: number
}>()

// Thresholds for notifications
const NOTIFICATION_THRESHOLDS = {
  PORTFOLIO_CHANGE: 0.05, // 5% change
  GAS_PRICE_CHANGE: 0.3,  // 30% change
  TIME_COOLDOWN: 3600000, // 1 hour cooldown between similar notifications
  CRITICAL_CHANGE: 0.15,  // 15% change for critical alerts
}

interface NotificationRequest {
  chatId: number
  type: 'portfolio' | 'gas' | 'opportunity' | 'risk' | 'agent'
  data: any
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, type, data, priority }: NotificationRequest = await request.json()

    if (!chatId || !type || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user notification state
    let userState = notificationStates.get(chatId) || {
      lastPortfolioValue: 0,
      lastGasPrices: 0,
      lastAlertTime: new Date(0),
      preferences: ['🚨 Critical alerts only', '💎 New opportunities', '⚠️ Risk warnings'],
      minimumChangeThreshold: 0.05
    }

    // Determine if notification should be sent
    const shouldNotify = await shouldSendNotification(type, data, userState, priority)
    
    if (!shouldNotify) {
      return NextResponse.json({ 
        success: true, 
        sent: false, 
        reason: 'Below threshold or too frequent' 
      })
    }

    // Send the notification
    const message = formatNotificationMessage(type, data, userState)
    const telegramType = priority === 'critical' ? 'error' : priority === 'high' ? 'warning' : 'success'

    try {
      const response = await fetch(`http://localhost:3001/api/telegram?${new URLSearchParams({
        action: 'send_notification',
        message,
        type: telegramType
      })}`)

      if (response.ok) {
        // Update user state after successful notification
        updateUserState(chatId, type, data, userState)
        
        return NextResponse.json({ 
          success: true, 
          sent: true, 
          message: 'Notification sent successfully' 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          sent: false, 
          error: 'Failed to send telegram notification' 
        })
      }
    } catch (error) {
      console.error('Telegram notification error:', error)
      return NextResponse.json({ 
        success: false, 
        sent: false, 
        error: 'Telegram service unavailable' 
      })
    }

  } catch (error) {
    console.error('Smart notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to process smart notification' },
      { status: 500 }
    )
  }
}

async function shouldSendNotification(
  type: string, 
  data: any, 
  userState: any, 
  priority: string
): Promise<boolean> {
  const now = new Date()
  const timeSinceLastAlert = now.getTime() - userState.lastAlertTime.getTime()

  // Always send critical notifications
  if (priority === 'critical') {
    return true
  }

  // Respect cooldown period for non-critical notifications
  if (timeSinceLastAlert < NOTIFICATION_THRESHOLDS.TIME_COOLDOWN && priority !== 'high') {
    return false
  }

  switch (type) {
    case 'portfolio':
      const portfolioChange = Math.abs(data.newValue - userState.lastPortfolioValue) / userState.lastPortfolioValue
      return portfolioChange >= (priority === 'high' ? NOTIFICATION_THRESHOLDS.CRITICAL_CHANGE : NOTIFICATION_THRESHOLDS.PORTFOLIO_CHANGE)

    case 'gas':
      const gasChange = Math.abs(data.newPrice - userState.lastGasPrices) / userState.lastGasPrices
      return gasChange >= NOTIFICATION_THRESHOLDS.GAS_PRICE_CHANGE

    case 'opportunity':
      // Only send if APY is above 10% or if it's a trusted protocol
      return data.apy >= 10 || data.protocol === 'trusted'

    case 'risk':
      // Always send risk alerts
      return true

    case 'agent':
      // Only send agent notifications for significant events
      return data.event === 'deployed' || data.event === 'critical_finding'

    default:
      return false
  }
}

function formatNotificationMessage(type: string, data: any, userState: any): string {
  const now = new Date().toLocaleTimeString()

  switch (type) {
    case 'portfolio':
      const change = ((data.newValue - userState.lastPortfolioValue) / userState.lastPortfolioValue * 100).toFixed(2)
      const emoji = parseFloat(change) >= 0 ? '📈' : '📉'
      return `${emoji} *Portfolio Update*\n\n💰 Value: $${data.newValue.toLocaleString()}\n📊 Change: ${change}%\n⚡ Trigger: Significant movement detected\n\n🕒 ${now}`

    case 'gas':
      return `⛽ *Gas Price Alert*\n\n💸 Current: ${data.newPrice} gwei\n📊 Change: ${((data.newPrice - userState.lastGasPrices) / userState.lastGasPrices * 100).toFixed(1)}%\n💡 ${data.newPrice < 20 ? 'Good time for transactions!' : 'Consider waiting for lower fees'}\n\n🕒 ${now}`

    case 'opportunity':
      return `💎 *New DeFi Opportunity*\n\n🏦 Protocol: ${data.protocol}\n💹 APY: ${data.apy}%\n💰 TVL: $${data.tvl}\n📋 ${data.description}\n\n🕒 ${now}`

    case 'risk':
      return `⚠️ *Risk Alert*\n\n🚨 Level: ${data.level}\n📋 ${data.description}\n💡 Recommended Action: ${data.recommendation}\n\n🕒 ${now}`

    case 'agent':
      return `🤖 *Agent Update*\n\n${data.icon} ${data.agentName}\n📋 ${data.message}\n${data.analysis ? `\n🧠 Analysis: ${data.analysis}` : ''}\n\n🕒 ${now}`

    default:
      return `ℹ️ *ZYRA Update*\n\n${data.message}\n\n🕒 ${now}`
  }
}

function updateUserState(chatId: number, type: string, data: any, currentState: any) {
  switch (type) {
    case 'portfolio':
      currentState.lastPortfolioValue = data.newValue
      break
    case 'gas':
      currentState.lastGasPrices = data.newPrice
      break
  }
  
  currentState.lastAlertTime = new Date()
  notificationStates.set(chatId, currentState)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const chatId = parseInt(searchParams.get('chatId') || '0')

  try {
    switch (action) {
      case 'preferences':
        const state = notificationStates.get(chatId)
        return NextResponse.json({
          success: true,
          preferences: state?.preferences || [],
          threshold: state?.minimumChangeThreshold || 0.05
        })

      case 'stats':
        return NextResponse.json({
          success: true,
          totalUsers: notificationStates.size,
          thresholds: NOTIFICATION_THRESHOLDS
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Smart notifications GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get notification data' },
      { status: 500 }
    )
  }
}