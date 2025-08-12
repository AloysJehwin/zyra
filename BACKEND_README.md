# DeFAI Oracle - Backend Integration

## 🚀 Backend Features

The DeFAI Oracle backend is now fully functional with the following capabilities:

### 📡 **API Endpoints**

#### 1. **Agents API** (`/api/agents`)
- **GET**: Fetch all AI agents with real-time performance data
- **GET** `?id=X`: Fetch specific agent details
- **POST**: Toggle agent status (Online/Offline)

#### 2. **Portfolio API** (`/api/portfolio`)
- **GET** `?address=WALLET_ADDRESS`: Fetch portfolio data for connected wallet
- **POST**: Perform portfolio actions:
  - `deploy_agents`: Deploy AI agents for portfolio management
  - `rebalance`: Trigger portfolio rebalancing
  - `update_strategy`: Update investment strategy

#### 3. **Market API** (`/api/market`)
- **GET**: Fetch DeFi market data and opportunities
- **GET** `?type=opportunities|trending|risks|chains`: Fetch specific data types
- **POST**: Trigger market scans and risk assessments

#### 4. **Real-time Updates** (`/api/realtime`)
- **Server-Sent Events** for live updates
- **GET** `?type=agents|portfolio|market|transactions|alerts`: Subscribe to specific update types

### 🎯 **Frontend Integration**

#### **Custom Hooks Created:**
- `useAgents()`: Manage AI agent data and interactions
- `usePortfolio()`: Handle portfolio data and wallet integration
- `useRealtime()`: Real-time updates via Server-Sent Events
- Specialized hooks: `useAgentUpdates()`, `usePortfolioUpdates()`, etc.

#### **Components Enhanced:**
- **HeroSection**: Functional "Deploy Agents" button with wallet integration
- **AgentsSection**: Live agent data, status toggles, real-time updates
- **PortfolioDashboard**: Complete portfolio management interface
- **Header**: Updated navigation with portfolio section

### 🔧 **Technical Features**

#### **Real-time Data:**
- Live agent performance updates
- Portfolio value changes
- Market opportunity alerts
- Transaction status updates
- Risk notifications

#### **Mock Data Simulation:**
- 5 AI agents with realistic performance metrics
- Dynamic portfolio data with price fluctuations
- Market opportunities across multiple DeFi protocols
- Transaction history and status tracking

#### **Wallet Integration:**
- Full wagmi/Reown AppKit integration
- Multi-chain support (Ethereum, Arbitrum, Polygon, BSC, Base)
- Social login options (Google, GitHub, Apple, Facebook)
- Automatic portfolio loading when wallet connected

## 🎮 **How to Use**

### **1. Connect Wallet**
- Click the wallet button in the header
- Choose from multiple connection options
- Support for social logins and traditional wallets

### **2. Deploy AI Agents**
- Click "Deploy Agents" in the hero section
- Agents will be activated for your wallet
- Real-time status updates in the agents section

### **3. Monitor Portfolio**
- Automatic portfolio loading after wallet connection
- Live updates every 15 seconds
- Rebalance functionality with one click

### **4. Agent Management**
- View all 5 AI agents in the agents section
- Toggle individual agents on/off
- Monitor real-time performance metrics

### **5. Real-time Updates**
- Live data streams throughout the application
- Portfolio value updates
- Agent performance changes
- Market opportunity alerts

## 🛠 **Backend Architecture**

```
/api/
├── agents/          # AI agent management
├── portfolio/       # Wallet & portfolio data
├── market/          # DeFi market data
└── realtime/        # Server-Sent Events
```

### **Data Flow:**
1. **User connects wallet** → Portfolio API fetches data
2. **Deploy agents** → Agents API activates agents
3. **Real-time updates** → SSE streams live data
4. **Portfolio rebalancing** → Agents execute strategies
5. **Market scanning** → Opportunities detected and displayed

## 📊 **Mock Data Features**

- **5 AI Agents**: Each with unique roles and performance metrics
- **Portfolio Assets**: Multi-chain DeFi positions with realistic APYs
- **Market Data**: $87B+ DeFi TVL with trending opportunities
- **Real-time Simulation**: Dynamic data changes every 3-15 seconds
- **Transaction History**: Recent activity and status tracking

## 🎯 **Ready for Hackathon**

The backend is fully functional and provides:
- ✅ Complete AI agent simulation
- ✅ Portfolio management system
- ✅ Real-time data updates
- ✅ Wallet integration
- ✅ Multi-chain support
- ✅ Beautiful UI/UX
- ✅ Live demo capabilities

All backend functionality is working and integrated with the frontend for a complete DeFAI Oracle experience!



