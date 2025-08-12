import { NextRequest, NextResponse } from 'next/server'
import { telegramService } from '../../../lib/services/telegramNotifications'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'

  try {
    const results = []

    if (type === 'all' || type === 'portfolio') {
      // Test portfolio update
      await telegramService.sendPortfolioUpdate({
        totalValue: 87423.50,
        dailyChange: 2.4,
        action: 'Rebalanced portfolio',
        asset: 'AAVE'
      })
      results.push('Portfolio update sent')
    }

    if (type === 'all' || type === 'agent') {
      // Test agent update
      await telegramService.sendAgentUpdate(
        'Market Intelligence Agent', 
        'active', 
        'Detected new yield opportunity: 18.5% APY on Uniswap v4'
      )
      results.push('Agent update sent')
    }

    if (type === 'all' || type === 'market') {
      // Test market alert
      await telegramService.sendMarketAlert('opportunity', {
        protocol: 'Aave v3',
        apy: '15.2%',
        tvl: '2.1B',
        description: 'High yield opportunity detected with low risk score'
      })
      results.push('Market alert sent')
    }

    if (type === 'all' || type === 'transaction') {
      // Test transaction update
      await telegramService.sendTransactionUpdate({
        type: 'Yield Farming',
        amount: '$5,000 USDC',
        status: 'completed',
        gasOptimization: '35% (saved $12.50)'
      })
      results.push('Transaction update sent')
    }

    if (type === 'all' || type === 'insight') {
      // Test AI insight
      await telegramService.sendAIInsight(
        'Risk Manager Agent',
        'Portfolio risk reduced by 12% through automatic rebalancing. Recommended action: Increase USDC allocation to 25% due to market volatility.'
      )
      results.push('AI insight sent')
    }

    const subscriberCount = await telegramService.getSubscriberCount()

    return NextResponse.json({
      success: true,
      results,
      subscriberCount,
      message: subscriberCount === 0 
        ? 'Notifications sent but no subscribers. Subscribe to @zyra_info_bot first!'
        : `Notifications sent to ${subscriberCount} subscribers`
    })

  } catch (error) {
    console.error('Test notification error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send test notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, type = 'info' } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Send custom notification
    await fetch('http://localhost:3001/api/telegram?' + new URLSearchParams({
      action: 'send_notification',
      message,
      type
    }))

    const subscriberCount = await telegramService.getSubscriberCount()

    return NextResponse.json({
      success: true,
      message: 'Custom notification sent',
      subscriberCount
    })

  } catch (error) {
    console.error('Custom notification error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send custom notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}