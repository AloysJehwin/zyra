# 🚀 DeFAI Oracle Setup Guide

This guide will help you set up the complete DeFAI Oracle system with AI agents, Telegram bot, and all integrations.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A Telegram account
- Access to OpenAI API

## 🔧 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

#### Required API Keys:

1. **OpenAI API Key** (for AI agents)
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Add to `.env.local`: `OPENAI_API_KEY=sk-your-key-here`

2. **Telegram Bot Token** (for notifications)
   - Open Telegram and message @BotFather
   - Send `/newbot` and follow instructions
   - Copy the bot token
   - Add to `.env.local`: `TELEGRAM_BOT_TOKEN=your-token-here`

3. **Reown Project ID** (for wallet connections)
   - Go to https://cloud.reown.com
   - Create a new project
   - Copy the project ID
   - Add to `.env.local`: `NEXT_PUBLIC_REOWN_PROJECT_ID=your-id-here`

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 🤖 Setting Up the Telegram Bot

### 1. Create Your Bot

1. Open Telegram and search for @BotFather
2. Send `/newbot`
3. Choose a name for your bot (e.g., "DeFAI Oracle Assistant")
4. Choose a username ending with "bot" (e.g., "defai_oracle_bot")
5. Copy the token and add it to your `.env.local`

### 2. Configure Bot Commands (Optional)

Send this to @BotFather to set up command menu:

```
/setcommands

Then send:
start - Welcome message and setup
subscribe - Get real-time DeFi updates
unsubscribe - Stop receiving updates  
status - Check your portfolio status
agents - View AI agents status
market - Latest market insights
help - Show available commands
```

### 3. Test Your Bot

1. Search for your bot username on Telegram
2. Send `/start` to begin
3. The bot should respond with a welcome message

## 🧠 AI Agent Features

The system includes 3 OpenAI-powered agents:

### 1. Market Intelligence Agent
- Analyzes DeFi market trends
- Provides investment insights
- Predicts market movements
- **Usage**: Click the "AI" button when viewing this agent

### 2. Risk Manager Agent  
- Assesses protocol risks
- Detects potential scams
- Provides safety scores
- **Usage**: Click the "AI" button when viewing this agent

### 3. Yield Hunter Agent
- Finds high-yield opportunities
- Compares farming pools
- Optimizes strategies
- **Usage**: Click the "AI" button when viewing this agent

## 📱 Features Overview

### Frontend Enhancements
- ✅ Fully responsive design (mobile-first)
- ✅ Improved animations and interactions
- ✅ Better loading states
- ✅ Enhanced accessibility
- ✅ Real-time updates

### AI Integration  
- ✅ OpenAI GPT-4 powered agents
- ✅ Context-aware responses
- ✅ Specialized prompts for each agent type
- ✅ Interactive chat interface

### Telegram Bot
- ✅ Real-time portfolio updates
- ✅ Agent status notifications  
- ✅ Market alerts and opportunities
- ✅ Transaction confirmations
- ✅ AI insights delivery

### Real-time System
- ✅ Server-sent events for live updates
- ✅ Portfolio value tracking
- ✅ Agent performance monitoring
- ✅ Market opportunity scanning
- ✅ Automatic Telegram notifications

## 🔄 How It All Works Together

1. **User connects wallet** → Portfolio data loads
2. **AI agents activate** → Start monitoring and analyzing  
3. **Real-time updates** → Stream live data to frontend
4. **Telegram notifications** → Send alerts for important events
5. **AI interactions** → Users can chat with agents for insights

## 📊 Testing the System

### 1. Test Wallet Connection
- Click "Connect Wallet" in the header
- Use any supported wallet or social login
- Verify portfolio dashboard loads

### 2. Test AI Agents
- Navigate to the Agents section
- Select "Market Intelligence Agent"
- Click the "AI" button
- Wait for OpenAI response

### 3. Test Telegram Bot
- Message your bot with `/start`
- Send `/subscribe` to get notifications
- Check that you receive test updates

### 4. Test Real-time Updates
- Watch the portfolio values update automatically
- Check agent status changes
- Verify Telegram receives notifications

## 🚨 Troubleshooting

### OpenAI Issues
- **"API key not configured"**: Check your `.env.local` file
- **"Rate limit exceeded"**: Wait or upgrade your OpenAI plan
- **Empty responses**: Verify API key has sufficient credits

### Telegram Bot Issues  
- **Bot not responding**: Check bot token in `.env.local`
- **Commands not working**: Verify bot is enabled
- **No notifications**: Ensure users are subscribed with `/subscribe`

### General Issues
- **Environment variables**: Restart dev server after changes
- **Port conflicts**: Use `npm run dev -- -p 3001` for different port
- **Build errors**: Check that all dependencies are installed

## 🌟 Production Deployment

### Environment Setup
1. Create production `.env` file
2. Set `NODE_ENV=production`
3. Configure production database (optional)
4. Set up proper CORS and security headers

### Telegram Webhook (Production)
```bash
# Set webhook for production bot
curl -X POST \
  "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/telegram"}'
```

### Security Considerations
- Store API keys securely
- Use environment-specific configurations
- Enable rate limiting
- Set up proper error monitoring
- Use HTTPS in production

## 🎯 Next Steps

1. **Add Real DeFi Data**: Connect to actual protocols
2. **Implement User Persistence**: Store user preferences
3. **Advanced AI Features**: Add custom agent training
4. **Mobile App**: Create React Native version
5. **Multi-language Support**: Add i18n

## 🤝 Support

If you encounter issues:
1. Check this guide first
2. Verify all API keys are correct
3. Check browser console for errors
4. Restart the development server

The system is now fully functional with responsive design, AI-powered agents, and Telegram integration! 🎉