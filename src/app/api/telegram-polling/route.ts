import { NextRequest, NextResponse } from 'next/server'
import TelegramBot from 'node-telegram-bot-api'

// Initialize Telegram Bot with polling
let bot: TelegramBot | null = null
let isPolling = false

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 503 })
  }

  try {
    switch (action) {
      case 'start':
        if (!bot || !isPolling) {
          bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
          isPolling = true
          
          // Set up message handlers
          bot.on('message', async (msg) => {
            const chatId = msg.chat.id
            const text = msg.text
            const firstName = msg.from?.first_name || 'User'

            console.log(`Received message: ${text} from ${firstName}`)

            switch (text) {
              case '/start':
                await bot!.sendMessage(chatId, 
                  `🤖 Welcome to ZYRA, ${firstName}!\\n\\n` +
                  `I'm your AI-powered DeFi assistant. I'll send you real-time updates about:\\n\\n` +
                  `📈 Portfolio changes\\n` +
                  `🔍 Agent activities\\n` +
                  `💎 Market opportunities\\n` +
                  `⚠️ Risk alerts\\n\\n` +
                  `Commands:\\n` +
                  `/subscribe - Get real-time updates\\n` +
                  `/unsubscribe - Stop updates\\n` +
                  `/status - Check your portfolio\\n` +
                  `/agents - View agent status\\n` +
                  `/help - Show this message`
                )
                break

              case '/subscribe':
                await bot!.sendMessage(chatId, 
                  `✅ You're now subscribed to ZYRA updates!\\n\\n` +
                  `You'll receive notifications about portfolio changes, agent activities, and market opportunities.`
                )
                break

              case '/status':
                await bot!.sendMessage(chatId, 
                  `📊 *Portfolio Status*\\n\\n` +
                  `💰 Total Value: $87,423.50\\n` +
                  `📈 24h Change: +2.4%\\n` +
                  `🏦 Active Positions: 12\\n` +
                  `🤖 AI Agents: 5/5 Online\\n\\n` +
                  `🔥 Top Performer: AAVE (+8.2%)\\n` +
                  `⚡ Latest Action: Rebalanced 2 hours ago`,
                  { parse_mode: 'Markdown' }
                )
                break

              case '/agents':
                await bot!.sendMessage(chatId, 
                  `🤖 *AI Agents Status*\\n\\n` +
                  `🧠 Market Intelligence: 🟢 Online (94.2% accuracy)\\n` +
                  `💎 Yield Hunter: 🟢 Online (15.2% avg APY)\\n` +
                  `🛡️ Risk Manager: 🟢 Online (98.5% accuracy)\\n` +
                  `⚡ Transaction Orchestrator: 🟢 Online (99.2% success)\\n` +
                  `🔄 Portfolio Rebalancer: 🟢 Online (96.8% efficiency)\\n\\n` +
                  `🔥 All systems operational!`,
                  { parse_mode: 'Markdown' }
                )
                break

              case '/help':
                await bot!.sendMessage(chatId, 
                  `🤖 *ZYRA Bot Commands*\\n\\n` +
                  `/start - Welcome message\\n` +
                  `/subscribe - Get real-time updates\\n` +
                  `/unsubscribe - Stop updates\\n` +
                  `/status - Check portfolio status\\n` +
                  `/agents - View AI agents status\\n` +
                  `/market - Latest market insights\\n` +
                  `/help - Show this message\\n\\n` +
                  `💡 *Tips:*\\n` +
                  `• Subscribe to get instant notifications\\n` +
                  `• Check status regularly for portfolio updates\\n` +
                  `• Use /agents to monitor AI performance`,
                  { parse_mode: 'Markdown' }
                )
                break

              default:
                await bot!.sendMessage(chatId, 
                  `🤔 I don't understand that command.\\n\\n` +
                  `Use /help to see available commands.`
                )
            }
          })

          return NextResponse.json({ 
            success: true, 
            message: 'Polling started successfully',
            status: 'Bot is now listening for messages'
          })
        } else {
          return NextResponse.json({ 
            success: true, 
            message: 'Polling already active',
            status: 'Bot is listening'
          })
        }

      case 'stop':
        if (bot && isPolling) {
          await bot.stopPolling()
          isPolling = false
          bot = null
          return NextResponse.json({ 
            success: true, 
            message: 'Polling stopped'
          })
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'Polling was not active'
          })
        }

      case 'status':
        return NextResponse.json({
          isPolling,
          botActive: !!bot,
          status: isPolling ? 'Bot is listening for messages' : 'Bot is not active'
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['start', 'stop', 'status']
        })
    }
  } catch (error) {
    console.error('Polling error:', error)
    return NextResponse.json(
      { 
        error: 'Polling operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}