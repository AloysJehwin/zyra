'use client'

import { motion } from 'framer-motion'
import { Brain, TrendingUp, Shield, Cpu, Activity, Eye, Zap, Target, Users, MessageSquare, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAgents } from '../../lib/hooks/useAgents'
import { useRealtime } from '../../lib/hooks/useRealtime'
import { useMarketIntelligence, useRiskManager, useYieldHunter } from '../../lib/hooks/useAIAgent'

export default function AgentsSection() {
  const [activeAgent, setActiveAgent] = useState(0)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [showAiChat, setShowAiChat] = useState(false)
  
  const { agents: backendAgents, loading, error, toggleAgent } = useAgents()
  const { connected: realtimeConnected } = useRealtime('agents')
  
  // AI Agent hooks
  const marketIntelligence = useMarketIntelligence()
  const riskManager = useRiskManager()
  const yieldHunter = useYieldHunter()

  // Fallback static data structure for icons
  const agentIcons = [Brain, TrendingUp, Shield, Cpu, Activity]
  const agentColors = [
    "from-purple-500 to-blue-500",
    "from-green-500 to-emerald-500", 
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-red-500",
    "from-pink-500 to-purple-500"
  ]

  // Use backend data if available, otherwise fallback to static
  const agents = backendAgents.length > 0 ? backendAgents.map((agent, index) => ({
    ...agent,
    icon: agentIcons[index] || Brain,
    color: agentColors[index] || "from-purple-500 to-blue-500",
    capabilities: [
      "Real-time market sentiment analysis",
      "Cross-chain opportunity scanning", 
      "Predictive trend modeling",
      "Social media sentiment tracking",
      "On-chain activity monitoring"
    ]
  })) : [
    {
      id: 0,
      name: "Market Intelligence Agent",
      role: "Trend Forecaster & Scanner",
      icon: Brain,
      color: "from-purple-500 to-blue-500",
      description: "Advanced AI system that analyzes market trends, social sentiment, and on-chain data to predict DeFi opportunities before they emerge.",
      capabilities: [
        "Real-time market sentiment analysis",
        "Cross-chain opportunity scanning",
        "Predictive trend modeling",
        "Social media sentiment tracking",
        "On-chain activity monitoring"
      ],
      status: "Online",
      performance: {
        accuracy: "94%",
        opportunities: "1,247",
        uptime: "99.9%"
      }
    },
    {
      id: 1,
      name: "Yield Hunter Agent",
      role: "Opportunity Discovery",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      description: "Specialized agent that discovers and evaluates yield farming opportunities across multiple DeFi protocols and chains.",
      capabilities: [
        "Multi-protocol yield scanning",
        "Liquidity pool analysis",
        "Farming reward optimization",
        "Impermanent loss calculation",
        "APY trend prediction"
      ],
      status: "Online",
      performance: {
        avgAPY: "15.2%",
        protocols: "47",
        positions: "156"
      }
    },
    {
      id: 2,
      name: "Risk Manager Agent",
      role: "Security & Risk Assessment",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      description: "ML-powered security agent that evaluates risks, detects scams, and implements protective measures for your portfolio.",
      capabilities: [
        "Smart contract vulnerability scanning",
        "Scam protocol detection",
        "Risk scoring algorithms",
        "Position sizing optimization",
        "Emergency exit strategies"
      ],
      status: "Online",
      performance: {
        threats: "2,847",
        accuracy: "98.5%",
        saved: "$2.4M"
      }
    },
    {
      id: 3,
      name: "Transaction Orchestrator",
      role: "Execution & MEV Protection",
      icon: Cpu,
      color: "from-orange-500 to-red-500",
      description: "Handles all transaction execution with advanced MEV protection, gas optimization, and multi-chain coordination.",
      capabilities: [
        "MEV-protected transaction routing",
        "Gas price optimization",
        "Multi-chain coordination",
        "Slippage minimization",
        "Failed transaction recovery"
      ],
      status: "Online",
      performance: {
        gasAvg: "30%",
        mevBlocked: "847",
        success: "99.2%"
      }
    },
    {
      id: 4,
      name: "Portfolio Rebalancer",
      role: "Continuous Optimization",
      icon: Activity,
      color: "from-pink-500 to-purple-500",
      description: "Maintains optimal portfolio allocation through continuous monitoring and automatic rebalancing based on market conditions.",
      capabilities: [
        "Dynamic allocation adjustment",
        "Risk-weighted rebalancing",
        "Correlation analysis",
        "Performance optimization",
        "Tax-efficient strategies"
      ],
      status: "Online",
      performance: {
        rebalances: "342",
        efficiency: "96.8%",
        returns: "18.4%"
      }
    }
  ]

  const handleToggleAgent = async (agentId: number) => {
    try {
      await toggleAgent(agentId)
    } catch (error) {
      console.error('Failed to toggle agent:', error)
    }
  }

  const handleAskAI = async () => {
    setShowAiChat(!showAiChat)
    if (showAiChat) return

    setAiResponse("Connecting to AI agent...")
    
    try {
      let result = null
      
      // Route to appropriate AI agent based on active agent
      switch (activeAgent) {
        case 0: // Market Intelligence Agent
          result = await marketIntelligence.analyzeTrends()
          break
        case 1: // Yield Hunter Agent
          result = await yieldHunter.findHighYieldOpportunities()
          break
        case 2: // Risk Manager Agent
          result = await riskManager.getPortfolioRiskAnalysis([])
          break
        default:
          result = await marketIntelligence.analyzeTrends()
      }
      
      if (result) {
        setAiResponse(result.response)
      } else {
        setAiResponse("Sorry, I couldn't generate a response at this time. Please check if OpenAI API key is configured.")
      }
    } catch (error) {
      console.error('AI Agent error:', error)
      setAiResponse("Error: Unable to connect to AI agent. Please ensure OpenAI API key is configured in environment variables.")
    }
  }

  if (loading) {
    return (
      <section id="agents" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-8"></div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="agents" className="py-12 sm:py-20 responsive-padding">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="responsive-text-4xl font-space font-bold mb-4 sm:mb-6">
            <span className="gradient-text">Meet Your AI Agents</span>
          </h2>
          <p className="responsive-text-base text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            5 specialized AI agents working in perfect coordination to maximize your DeFi returns
          </p>
          
          {/* Agent Status Overview */}
          <div className="flex justify-center items-center space-x-6 flex-wrap gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${agents.every(a => a.status === 'Online') ? 'bg-green-400' : 'bg-orange-400'} rounded-full mr-2 animate-pulse`} />
              <span className={`${agents.every(a => a.status === 'Online') ? 'text-green-400' : 'text-orange-400'} font-medium`}>
                {agents.filter(a => a.status === 'Online').length}/{agents.length} Agents Online
              </span>
            </div>
            <div className="flex items-center">
              <Users className="text-purple-400 mr-2" size={20} />
              <span className="text-purple-400 font-medium">{agents.length} AI Agents</span>
            </div>
            {realtimeConnected && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
                <span className="text-blue-400 font-medium text-sm">Live Updates</span>
              </div>
            )}
            {error && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                <span className="text-red-400 font-medium text-sm">Connection Error</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Agent Selection Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {agents.map((agent, index) => (
            <motion.button
              key={agent.id}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                activeAgent === index
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'glass-effect text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveAgent(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <agent.icon className="inline mr-1 sm:mr-2" size={16} />
              <span className="hidden sm:inline">{agent.name.split(' ')[0]} {agent.name.split(' ')[1]}</span>
              <span className="sm:hidden">{agent.name.split(' ')[0]}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Active Agent Display */}
        <motion.div
          key={activeAgent}
          className="glass-effect rounded-2xl p-6 sm:p-8 md:p-12"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start lg:items-center">
            {/* Agent Info */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="flex items-center mb-4 sm:mb-0 sm:mr-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${agents[activeAgent].color} rounded-xl flex items-center justify-center mr-3 sm:mr-4`}>
                    {(() => {
                      const IconComponent = agents[activeAgent].icon;
                      return <IconComponent size={24} className="text-white sm:w-8 sm:h-8" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="responsive-text-xl font-bold text-white mb-1">
                      {agents[activeAgent].name}
                    </h3>
                    <p className="text-purple-400 font-medium responsive-text-sm">{agents[activeAgent].role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:ml-auto">
                  <div className={`flex items-center px-2 sm:px-3 py-1 ${agents[activeAgent].status === 'Online' ? 'bg-green-500/20' : 'bg-orange-500/20'} rounded-full mr-2`}>
                    <div className={`w-2 h-2 ${agents[activeAgent].status === 'Online' ? 'bg-green-400' : 'bg-orange-400'} rounded-full mr-2 animate-pulse`} />
                    <span className={`${agents[activeAgent].status === 'Online' ? 'text-green-400' : 'text-orange-400'} text-xs sm:text-sm font-medium`}>
                      {agents[activeAgent].status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      className="px-2 sm:px-3 py-1 text-xs border border-purple-400 rounded-full hover:bg-purple-400 hover:text-black transition-colors focus-ring"
                      onClick={() => handleToggleAgent(agents[activeAgent].id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Toggle
                    </motion.button>
                    {(activeAgent === 0 || activeAgent === 1 || activeAgent === 2) && (
                      <motion.button
                        className="px-2 sm:px-3 py-1 text-xs border border-blue-400 rounded-full hover:bg-blue-400 hover:text-black transition-colors focus-ring flex items-center"
                        onClick={handleAskAI}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={marketIntelligence.loading || riskManager.loading || yieldHunter.loading}
                      >
                        <Sparkles size={12} className="mr-1" />
                        AI
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 responsive-text-base mb-6 sm:mb-8 leading-relaxed">
                {agents[activeAgent].description}
              </p>

              {/* Capabilities */}
              <div className="mb-8">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center">
                  <Target className="mr-2 text-purple-400" size={20} />
                  Core Capabilities
                </h4>
                <div className="space-y-2">
                  {agents[activeAgent].capabilities.map((capability, index) => (
                    <motion.div
                      key={capability}
                      className="flex items-center text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Zap className="text-purple-400 mr-3 flex-shrink-0" size={16} />
                      <span>{capability}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center">
                <Eye className="mr-2 text-purple-400" size={20} />
                Live Performance
              </h4>
              
              <div className="space-y-4">
                {Object.entries(agents[activeAgent].performance).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    className="glass-effect p-4 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-white font-bold text-xl">{value}</span>
                    </div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${agents[activeAgent].color}`}
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Response Section */}
              {showAiChat && (
                <motion.div
                  className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-3">
                    <Sparkles className="text-blue-400 mr-2" size={16} />
                    <span className="text-blue-400 font-medium text-sm">AI Agent Response</span>
                    <motion.button
                      className="ml-auto text-gray-400 hover:text-white"
                      onClick={() => setShowAiChat(false)}
                      whileHover={{ scale: 1.1 }}
                    >
                      ×
                    </motion.button>
                  </div>
                  <div className="text-gray-300 text-sm max-h-64 overflow-y-auto">
                    {(marketIntelligence.loading || riskManager.loading || yieldHunter.loading) ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                        Generating AI response...
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{aiResponse}</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Agent Communication */}
              <motion.div
                className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" />
                  <span className="text-purple-400 font-medium text-sm">Inter-Agent Communication</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Currently coordinating with 4 other agents to optimize portfolio strategy
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Agent Network Visualization */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-bold text-xl mb-6">Agent Coordination Network</h4>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                className={`relative ${index === activeAgent ? 'scale-110' : ''}`}
                animate={{ 
                  scale: index === activeAgent ? 1.1 : 1,
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 0.3 },
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${agent.color} rounded-full flex items-center justify-center`}>
                  <agent.icon size={20} className="text-white" />
                </div>
                {index !== agents.length - 1 && (
                  <motion.div
                    className="absolute top-1/2 left-full w-8 h-0.5 bg-purple-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
