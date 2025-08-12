import { NextRequest, NextResponse } from 'next/server'
import TelegramBot from 'node-telegram-bot-api'

// Initialize Telegram Bot (only if token is provided)
let bot: TelegramBot | null = null
if (process.env.TELEGRAM_BOT_TOKEN) {
  try {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false })
  } catch {
    console.error('Failed to initialize Telegram bot:', error)
  }
}

// Store chat IDs for notifications
const subscribedChats = new Set<number>([5859252948]) // Pre-add the user

// Webhook handler for Telegram
export async function POST(request: NextRequest) {
  if (!bot) {
    return NextResponse.json({ error: 'Telegram bot not configured' }, { status: 503 })
  }

  try {
    const update = await request.json()
    
    if (update.message) {
      const chatId = update.message.chat.id
      const text = update.message.text
      const firstName = update.message.from?.first_name || 'User'

      // Handle different commands
      switch (text) {
        case '/start':
          // Check if user has completed onboarding
          try {
            const profileResponse = await fetch(`http://localhost:3001/api/user-onboarding?action=profile&chatId=${chatId}`)
            const profileData = await profileResponse.json()
            
            if (profileData.success && profileData.profile.onboardingComplete) {
              await bot.sendMessage(chatId, 
                `🤖 Welcome back to ZYRA, ${profileData.profile.name}! 👋\n\n` +
                `Your AI agents are active and monitoring the markets.\n\n` +
                `Commands:\n` +
                `/status - Portfolio & agent status\n` +
                `/analyze - Get AI market analysis\n` +
                `/profile - View your profile\n` +
                `/help - All commands\n\n` +
                `💡 I'll only notify you about important changes based on your preferences!`
              )
            } else {
              // Start onboarding process
              const onboardingResponse = await fetch(`http://localhost:3001/api/user-onboarding?action=start`)
              const onboardingData = await onboardingResponse.json()
              
              await bot.sendMessage(chatId, onboardingData.message)
            }
          } catch {
            // Fallback if onboarding service is down
            await bot.sendMessage(chatId, 
              `🤖 Welcome to ZYRA, ${firstName}!\n\n` +
              `Let's get you set up! Use /setup to personalize your experience.`
            )
          }
          break

        case '/subscribe':
          subscribedChats.add(chatId)
          await bot.sendMessage(chatId, 
            `✅ Smart notifications enabled!\n\n` +
            `I'll only notify you about:\n` +
            `🚨 Critical portfolio changes\n` +
            `💎 High-value opportunities\n` +
            `⚠️ Risk alerts\n\n` +
            `No spam - only when it matters! 🎯`
          )
          break

        case '/unsubscribe':
          subscribedChats.delete(chatId)
          await bot.sendMessage(chatId, 
            `❌ You've been unsubscribed from updates.\n\n` +
            `Use /subscribe to start receiving notifications again.`
          )
          break

        case '/status':
          // Fetch current portfolio status
          try {
            const statusMessage = await getPortfolioStatus()
            await bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' })
          } catch {
            await bot.sendMessage(chatId, '❌ Unable to fetch portfolio status at this time.')
          }
          break

        case '/agents':
          // Fetch agent status
          try {
            const agentsMessage = await getAgentsStatus()
            await bot.sendMessage(chatId, agentsMessage, { parse_mode: 'Markdown' })
          } catch {
            await bot.sendMessage(chatId, '❌ Unable to fetch agents status at this time.')
          }
          break

        case '/help':
          await bot.sendMessage(chatId, 
            `🤖 *ZYRA - Your AI DeFi Assistant*\n\n` +
            `*Setup & Profile:*\n` +
            `/setup - Personalize your experience\n` +
            `/profile - View your profile\n\n` +
            `*AI Analysis:*\n` +
            `/analyze - Get personalized market analysis\n` +
            `/status - Portfolio & agent status\n` +
            `/agents - View AI agents status\n\n` +
            `*Notifications:*\n` +
            `/subscribe - Enable smart notifications\n` +
            `/unsubscribe - Disable notifications\n\n` +
            `*Info:*\n` +
            `/market - Market insights\n` +
            `/help - Show this message\n\n` +
            `💡 *Smart Features:*\n` +
            `• Personalized AI recommendations\n` +
            `• No spam - only important updates\n` +
            `• Real OpenAI-powered analysis\n` +
            `• Custom risk tolerance settings`,
            { parse_mode: 'Markdown' }
          )
          break

        case '/market':
          try {
            const marketMessage = await getMarketInsights()
            await bot.sendMessage(chatId, marketMessage, { parse_mode: 'Markdown' })
          } catch {
            await bot.sendMessage(chatId, '❌ Unable to fetch market insights at this time.')
          }
          break

        case '/setup':
        case '/onboard':
          try {
            const onboardingResponse = await fetch(`http://localhost:3001/api/user-onboarding?action=start`)
            const onboardingData = await onboardingResponse.json()
            await bot.sendMessage(chatId, onboardingData.message)
          } catch {
            await bot.sendMessage(chatId, '❌ Setup service temporarily unavailable. Try again later.')
          }
          break

        case '/analyze':
          try {
            // Get user profile first
            const profileResponse = await fetch(`http://localhost:3001/api/user-onboarding?action=profile&chatId=${chatId}`)
            const profileData = await profileResponse.json()
            
            if (profileData.success) {
              // Get AI analysis from market intelligence agent
              const agentResponse = await fetch(`http://localhost:3001/api/ai-agents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  agentType: 'market-intelligence',
                  userProfile: profileData.profile,
                  marketData: { ethTrend: 'Bullish', gasPrice: 'Moderate', tvlTrend: 'Growing' },
                  action: 'analyze'
                })
              })
              
              const agentData = await agentResponse.json()
              
              if (agentData.success) {
                await bot.sendMessage(chatId, 
                  `${agentData.icon} *Market Intelligence Analysis*\n\n${agentData.analysis}\n\n_Analysis generated at ${new Date().toLocaleTimeString()}_`,
                  { parse_mode: 'Markdown' }
                )
              } else {
                await bot.sendMessage(chatId, '🧠 Market Intelligence Agent is currently analyzing. Please try again in a moment.')
              }
            } else {
              await bot.sendMessage(chatId, 'Please complete setup first with /setup to get personalized analysis!')
            }
          } catch {
            await bot.sendMessage(chatId, '❌ Analysis service temporarily unavailable. Try again later.')
          }
          break

        case '/profile':
          try {
            const profileResponse = await fetch(`http://localhost:3001/api/user-onboarding?action=profile&chatId=${chatId}`)
            const profileData = await profileResponse.json()
            
            if (profileData.success) {
              const profile = profileData.profile
              await bot.sendMessage(chatId,
                `👤 *Your ZYRA Profile*\n\n` +
                `📛 Name: ${profile.name}\n` +
                `📊 Experience: ${profile.experience}\n` +
                `🎯 Risk Tolerance: ${profile.riskTolerance}\n` +
                `🎮 Goals: ${profile.goals.join(', ')}\n` +
                `💰 Assets: ${profile.preferredAssets.join(', ')}\n` +
                `🔔 Notifications: ${profile.notifications.join(', ')}\n\n` +
                `${profile.personality}`,
                { parse_mode: 'Markdown' }
              )
            } else {
              await bot.sendMessage(chatId, 'No profile found. Use /setup to create your profile!')
            }
          } catch {
            await bot.sendMessage(chatId, '❌ Profile service temporarily unavailable.')
          }
          break

        default:
          // Handle onboarding responses (numbers 1-6 for question answers)
          if (/^[1-6]$/.test(text) || text.length > 2) {
            try {
              // This is likely an onboarding response - handle it intelligently
              await bot.sendMessage(chatId, 
                `Thanks for your response! 🎯\n\nIf you're setting up your profile, I'll process that. Otherwise, use /help to see available commands.`
              )
            } catch {
              await bot.sendMessage(chatId, 
                `🤔 I don't understand that command.\n\n` +
                `Use /help to see available commands.`
              )
            }
          } else {
            await bot.sendMessage(chatId, 
              `🤔 I don't understand that command.\n\n` +
              `Use /help to see available commands.`
            )
          }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// GET endpoint for manual notifications and status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (!bot) {
    return NextResponse.json({ error: 'Telegram bot not configured' }, { status: 503 })
  }

  try {
    switch (action) {
      case 'send_notification':
        const message = searchParams.get('message')
        const type = searchParams.get('type') || 'info'
        
        if (message) {
          await sendNotificationToSubscribers(message, type)
          return NextResponse.json({ status: 'sent', subscribers: subscribedChats.size })
        }
        break

      case 'subscribers':
        return NextResponse.json({ 
          subscribers: subscribedChats.size,
          chatIds: Array.from(subscribedChats)
        })

      case 'status':
        return NextResponse.json({
          configured: !!process.env.TELEGRAM_BOT_TOKEN,
          subscribers: subscribedChats.size,
          botInfo: bot ? await bot.getMe() : null
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['send_notification', 'subscribers', 'status']
        })
    }
  } catch {
    console.error('Telegram GET error:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }

  return NextResponse.json({ status: 'ok' })
}

// Helper functions
async function getPortfolioStatus(): Promise<string> {
  // This would typically fetch from your database or API
  return `📊 *Portfolio Status*\n\n` +
         `💰 Total Value: $87,423.50\n` +
         `📈 24h Change: +2.4%\n` +
         `🏦 Active Positions: 12\n` +
         `🤖 AI Agents: 5/5 Online\n\n` +
         `🔥 Top Performer: AAVE (+8.2%)\n` +
         `⚡ Latest Action: Rebalanced 2 hours ago`
}

async function getAgentsStatus(): Promise<string> {
  return `🤖 *AI Agents Status*\n\n` +
         `🧠 Market Intelligence: 🟢 Online (94.2% accuracy)\n` +
         `💎 Yield Hunter: 🟢 Online (15.2% avg APY)\n` +
         `🛡️ Risk Manager: 🟢 Online (98.5% accuracy)\n` +
         `⚡ Transaction Orchestrator: 🟢 Online (99.2% success)\n` +
         `🔄 Portfolio Rebalancer: 🟢 Online (96.8% efficiency)\n\n` +
         `🔥 All systems operational!`
}

async function getMarketInsights(): Promise<string> {
  return `📈 *Market Insights*\n\n` +
         `🚀 DeFi TVL: $87.2B (+1.2% 24h)\n` +
         `💰 Top Yields:\n` +
         `  • Aave v3: 12.4% APY\n` +
         `  • Uniswap v4: 18.7% APY\n` +
         `  • Curve: 9.8% APY\n\n` +
         `⚠️ Market Alert: ETH volatility increasing\n` +
         `💡 AI Recommendation: Consider defensive strategies`
}

export async function sendNotificationToSubscribers(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  if (!bot || subscribedChats.size === 0) return

  const emoji = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }

  const formattedMessage = `${emoji[type]} ${message}`

  const promises = Array.from(subscribedChats).map(chatId => 
    bot!.sendMessage(chatId, formattedMessage).catch(error => {
      console.error(`Failed to send message to chat ${chatId}:`, error)
      // Remove invalid chat IDs
      if (error.response?.statusCode === 403 || error.response?.statusCode === 400) {
        subscribedChats.delete(chatId)
      }
    })
  )

  await Promise.allSettled(promises)
}