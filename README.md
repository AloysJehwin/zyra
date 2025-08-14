# 🔮 Zyra - DeFAI Oracle Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

**Zyra** is a next-generation decentralized finance (DeFi) oracle platform that combines artificial intelligence with blockchain technology to provide intelligent portfolio management, market analysis, and automated risk assessment. Built with cutting-edge web technologies, Zyra empowers users to make informed DeFi decisions through AI-powered agents and real-time market intelligence.

## ✨ Key Features

### 🤖 AI-Powered Oracle Agents
- **Market Intelligence Agent**: Advanced market trend analysis and investment insights
- **Risk Manager Agent**: Comprehensive protocol risk assessment and safety scoring
- **Yield Hunter Agent**: Optimized yield farming and liquidity pool discovery

### 🔗 Blockchain Integration
- **Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and social logins
- **Real-Time Portfolio Tracking**: Live DeFi position monitoring and valuation
- **Cross-Chain Compatibility**: Support for multiple blockchain networks

### 📱 Real-Time Communication
- **Live Data Streaming**: Server-sent events for instant portfolio updates
- **Telegram Bot Integration**: Smart notifications and mobile alerts
- **Interactive Dashboard**: Responsive, real-time user interface

### 🛡️ Security & Risk Management
- **Automated Risk Assessment**: AI-driven protocol safety analysis
- **Smart Contract Auditing**: Intelligent vulnerability detection
- **Portfolio Risk Scoring**: Comprehensive risk metrics and recommendations

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Type-safe development environment
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Advanced animations and interactions
- **Tanstack Query**: Efficient data fetching and caching

### Backend & APIs
- **Next.js API Routes**: Serverless backend functions
- **OpenAI Integration**: GPT-4 powered AI agents
- **Telegram Bot API**: Real-time notifications
- **Reown AppKit**: Wallet connection infrastructure

### Blockchain Technology
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **Multi-Chain Support**: Ethereum, Polygon, BSC, and more

## 🛠️ Installation

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** version control

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/zyra.git
cd zyra
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-your-openai-key-here

# Telegram Bot Token (optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Reown Project ID (required for wallet connections)
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id
```

4. **Start the development server**
```bash
npm run dev
```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 API Documentation

### AI Agents Endpoints
- `POST /api/ai-agents` - Interact with AI oracle agents
- `GET /api/agents` - Retrieve agent status and capabilities
- `POST /api/ai` - Direct AI chat interface

### Portfolio Management
- `GET /api/portfolio` - Fetch user portfolio data
- `GET /api/market` - Market data and analytics
- `GET /api/realtime` - Real-time data streaming

### Telegram Integration
- `POST /api/telegram` - Telegram webhook handler
- `POST /api/telegram-polling` - Bot polling interface
- `POST /api/smart-notifications` - Intelligent notification system

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI agents | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for notifications | ❌ |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown project ID for wallet connections | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |

### Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Add token to `.env.local`
4. Configure webhook for production deployments

### Wallet Integration

1. Create a project at [Reown Cloud](https://cloud.reown.com)
2. Copy your project ID
3. Add to environment variables
4. Configure supported networks

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Configure environment variables**
3. **Deploy with one click**

```bash
npm run build
npm run start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Configuration

- Set `NODE_ENV=production`
- Configure secure API endpoints
- Enable HTTPS and security headers
- Set up monitoring and analytics
- Configure production database (if needed)

## 🧪 Testing

### Development Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Component testing
npm run test
```

### AI Agent Testing
- Navigate to `/intelligent-test` for AI agent testing
- Use `/telegram-test` for Telegram integration testing

## 📊 Performance & Monitoring

### Optimization Features
- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Automatic image compression and lazy loading
- **Code Splitting**: Dynamic imports for optimal bundle sizes
- **Caching Strategy**: Intelligent data caching and revalidation

### Monitoring Integration
- Real-time error tracking
- Performance metrics collection
- User analytics and insights
- API usage monitoring

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests
- Document new features and APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [Backend Documentation](BACKEND_README.md) - Backend API reference
- [API Documentation](#api-documentation) - Complete API reference

### Community & Support
- **Issues**: [GitHub Issues](https://github.com/your-username/zyra/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/zyra/discussions)
- **Discord**: [Join our community](https://discord.gg/zyra)

### Getting Help
1. Check the documentation and setup guide
2. Search existing issues and discussions
3. Create a new issue with detailed information
4. Join our community discord for real-time help

## 🔮 Roadmap

### Current Version (v0.1.0)
- ✅ AI-powered oracle agents
- ✅ Wallet connection infrastructure
- ✅ Real-time portfolio tracking
- ✅ Telegram bot integration
- ✅ Responsive web interface

### Upcoming Features
- 🔄 Advanced portfolio analytics
- 🔄 Multi-chain protocol support
- 🔄 Mobile application (React Native)
- 🔄 Advanced risk modeling
- 🔄 Institutional features
- 🔄 Governance token integration

---

**Built with ❤️ by the Zyra Team**

*Empowering the future of decentralized finance through artificial intelligence*