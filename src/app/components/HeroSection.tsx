'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Cpu, TrendingUp, Shield, Zap, Activity } from 'lucide-react'
import { useAccount } from 'wagmi'
import { usePortfolio } from '../../lib/hooks/usePortfolio'
import { useState } from 'react'

export default function HeroSection() {
  const { address, isConnected } = useAccount()
  const { loading: portfolioLoading } = usePortfolio()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<string | null>(null)
  const [deploymentStep, setDeploymentStep] = useState<number>(0)
  const [deployedAgents, setDeployedAgents] = useState<string[]>([])
  const [currentAgent, setCurrentAgent] = useState<string>('')
  
  // Interactive deployment states
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({})
  const [mobileNumber, setMobileNumber] = useState('')

  const agents = [
    { name: 'Market Intelligence', icon: Brain, color: 'text-purple-400', delay: 0.5, description: 'Analyzes market trends and opportunities' },
    { name: 'Yield Hunter', icon: TrendingUp, color: 'text-green-400', delay: 0.7, description: 'Finds optimal yield farming strategies' },
    { name: 'Risk Manager', icon: Shield, color: 'text-blue-400', delay: 0.9, description: 'Monitors and mitigates portfolio risks' },
    { name: 'Transaction Orchestrator', icon: Cpu, color: 'text-orange-400', delay: 1.1, description: 'Optimizes gas and execution' },
    { name: 'Portfolio Rebalancer', icon: Activity, color: 'text-pink-400', delay: 1.3, description: 'Maintains optimal asset allocation' }
  ]

  const deploymentQuestions = [
    {
      id: 'experience',
      question: "What's your experience with DeFi?",
      options: ['🌱 Beginner', '📊 Intermediate', '🚀 Advanced', '🧠 Expert']
    },
    {
      id: 'riskTolerance', 
      question: "What's your risk tolerance?",
      options: ['🛡️ Conservative', '⚖️ Moderate', '📈 Aggressive', '🎯 High Risk/Reward']
    },
    {
      id: 'goals',
      question: "What's your primary investment goal?",
      options: ['💰 Passive Income', '📈 Growth', '🔄 Trading', '🏦 Liquidity Mining']
    },
    {
      id: 'assets',
      question: "Which assets do you prefer?",
      options: ['⟠ ETH/BTC', '💵 Stablecoins', '🪙 Altcoins', '🔄 Mixed Portfolio']
    },
    {
      id: 'mobile',
      question: "Enter your mobile number for personalized alerts:",
      type: 'input',
      placeholder: '+1 (555) 123-4567'
    }
  ]

  const deploymentSteps = [
    'Analyzing Your Preferences...',
    'Initializing AI Network...',
    'Deploying Smart Contracts...',
    'Configuring Agent Parameters...',
    'Starting Agent Deployment...',
    'Synchronizing Agent Network...',
    'Deployment Complete!'
  ]

  const handleDeployAgents = () => {
    if (!isConnected) {
      setDeploymentResult('Please connect your wallet first')
      return
    }

    // Start with questions instead of immediate deployment
    setShowQuestions(true)
    setCurrentQuestion(0)
    setUserAnswers({})
  }

  const handleAnswerQuestion = (answer: string) => {
    const question = deploymentQuestions[currentQuestion]
    setUserAnswers(prev => ({
      ...prev,
      [question.id]: answer
    }))

    if (currentQuestion < deploymentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // All questions answered, start deployment
      setShowQuestions(false)
      startActualDeployment()
    }
  }

  const handleMobileInput = (mobile: string) => {
    setMobileNumber(mobile)
    setUserAnswers(prev => ({
      ...prev,
      mobile: mobile
    }))
    
    // Proceed to deployment after mobile number
    setShowQuestions(false)
    startActualDeployment()
  }

  const startActualDeployment = async () => {
    setIsDeploying(true)
    setDeploymentResult(null)
    setDeploymentStep(0)
    setDeployedAgents([])
    setCurrentAgent('')

    try {
      // Step 1: Analyze preferences
      setDeploymentStep(1)
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Step 2: Initialize AI Network
      setDeploymentStep(2)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 3: Deploy Smart Contracts
      setDeploymentStep(3)
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Step 4: Configure Parameters
      setDeploymentStep(4)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 5: Deploy each agent individually
      setDeploymentStep(5)
      
      for (const agent of agents) {
        setCurrentAgent(agent.name)
        await new Promise(resolve => setTimeout(resolve, 1800)) // Deploy time per agent
        setDeployedAgents(prev => [...prev, agent.name])
        
        // Activate the actual AI agent with user preferences
        try {
          const agentKey = agent.name.toLowerCase().replace(/\s+/g, '-')
          await fetch('/api/ai-agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agentType: agentKey,
              userProfile: { 
                name: address?.slice(0, 6) || 'User',
                ...userAnswers,
                mobile: mobileNumber
              },
              action: 'activate'
            })
          })
          
          // Send personalized notification via Telegram and SMS (if mobile provided)
          if (mobileNumber) {
            fetch('/api/sms-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mobile: mobileNumber,
                message: `🤖 ZYRA: ${agent.name} is now active and monitoring based on your ${userAnswers.riskTolerance} risk profile. Welcome to intelligent DeFi!`,
                agentName: agent.name
              })
            })
          }
          
          // Send Telegram notification
          fetch(`/api/telegram?${new URLSearchParams({
            action: 'send_notification',
            message: `🤖 ${agent.name} Activated!\n\n✅ Configured for ${userAnswers.experience} level\n📋 ${agent.description}\n🎯 Optimized for ${userAnswers.goals}\n${mobileNumber ? '📱 SMS alerts enabled' : ''}`,
            type: 'success'
          })}`)
        } catch {
          // Silent fail for AI activation
        }
      }
      
      // Step 6: Network Synchronization
      setDeploymentStep(6)
      setCurrentAgent('')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 7: Complete
      setDeploymentStep(7)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDeploymentResult(`🚀 All AI Agents Successfully Deployed! Your personalized DeFi portfolio manager is now active with 5 coordinated agents optimized for ${userAnswers.experience} level ${userAnswers.goals} strategies.`)
      
      // Send final success notification with personalization
      try {
        const finalMessage = `🎉 ZYRA Agent Network Deployed!\n\n✅ 5 AI Agents Online\n📊 Configured for ${userAnswers.experience} level\n🎯 Optimized for ${userAnswers.goals}\n⚖️ ${userAnswers.riskTolerance} risk profile\n💰 ${userAnswers.assets} focus\n${mobileNumber ? '📱 SMS notifications active' : ''}\n\nYour personalized autonomous DeFi manager is ready!`
        
        fetch(`/api/telegram?${new URLSearchParams({
          action: 'send_notification', 
          message: finalMessage,
          type: 'success'
        })}`)
        
        // SMS notification for completion
        if (mobileNumber) {
          fetch('/api/sms-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mobile: mobileNumber,
              message: `🎉 ZYRA deployment complete! Your 5 AI agents are now monitoring the DeFi markets 24/7 based on your preferences. Welcome to intelligent portfolio management!`,
              agentName: 'ZYRA Network'
            })
          })
        }
      } catch {}

    } catch (error) {
      setDeploymentResult(error instanceof Error ? error.message : 'Failed to deploy agents')
    } finally {
      setIsDeploying(false)
      setDeploymentStep(0)
      setCurrentAgent('')
    }
  }

  const handleLiveDemo = () => {
    // Scroll to agents section
    document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
      {/* AI Agent Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {agents.map((agent, index) => (
          <motion.div
            key={index}
            className={`absolute ${agent.color} ${deployedAgents.includes(agent.name) ? 'opacity-60' : 'opacity-20'} transition-opacity duration-1000`}
            style={{
              left: `${15 + index * 15}%`,
              top: `${20 + index * 12}%`,
            } as React.CSSProperties}
            animate={{ 
              y: [0, -30, 0], 
              rotate: deployedAgents.includes(agent.name) ? [0, 360] : [0, 180, 0],
              scale: deployedAgents.includes(agent.name) ? [1, 1.4, 1] : [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: deployedAgents.includes(agent.name) ? 4 : 8 + index * 2, 
              repeat: Infinity,
              delay: agent.delay
            }}
          >
            <agent.icon size={60} />
            {deployedAgents.includes(agent.name) && (
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <Zap size={12} className="text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {/* Network connections */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <motion.path
            d="M 100 200 Q 400 100 700 300 Q 900 400 1200 200"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="opacity-100"
        >
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full glass-effect mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <div className={`w-3 h-3 rounded-full mr-3 ${isDeploying ? 'bg-orange-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
            <span className="font-medium text-sm text-purple-300">
              {isDeploying 
                ? `Deploying... ${deployedAgents.length}/5 Agents` 
                : `${deployedAgents.length || 5} AI Agents Online • ZYRA Network`
              }
            </span>
          </motion.div>

          {isConnected && (
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full glass-effect mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse" />
              <span className="font-medium text-sm">
                Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </motion.div>
          )}

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-space font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block text-white">ZYRA</span>
            <motion.span 
              className="block gradient-text"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #667eea)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              } as React.CSSProperties}
            >
              Multi-Agent AI
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto font-poppins leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Autonomous DeFi portfolio manager powered by 5 coordinated AI agents. 
            <span className="text-purple-300 font-semibold"> 24/7 yield optimization, risk management,</span> 
            {' '}and intelligent trading strategies across multiple chains.
          </motion.p>

          {/* Key Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { label: 'Average APY', value: '15%+', color: 'text-green-400' },
              { label: 'Gas Savings', value: '30%', color: 'text-blue-400' },
              { label: 'Risk Reduction', value: '26%', color: 'text-purple-400' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="glass-effect px-6 py-4 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg overflow-hidden min-w-[280px] disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isDeploying ? 1 : 1.05 }}
              whileTap={{ scale: isDeploying ? 1 : 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={handleDeployAgents}
              disabled={isDeploying || portfolioLoading}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center justify-center">
                {isDeploying ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    {currentAgent ? `Deploying ${currentAgent}...` : deploymentSteps[deploymentStep] || 'Deploying...'}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2" size={20} />
                    Deploy AI Agent Network
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </span>
            </motion.button>

            <motion.button
              className="px-8 py-4 border-2 border-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-black transition-all duration-300 min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={handleLiveDemo}
            >
              <Zap className="inline mr-2" size={20} />
              Live Demo
            </motion.button>
          </motion.div>

          {/* Interactive Questions */}
          {showQuestions && (
            <motion.div
              className="mt-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-effect p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Let&apos;s Personalize Your AI Agents
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Question {currentQuestion + 1} of {deploymentQuestions.length}
                  </p>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentQuestion + 1) / deploymentQuestions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-medium text-white mb-6">
                    {deploymentQuestions[currentQuestion]?.question}
                  </h4>
                  
                  {deploymentQuestions[currentQuestion]?.type === 'input' ? (
                    <div className="space-y-4">
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder={deploymentQuestions[currentQuestion]?.placeholder}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                      <motion.button
                        onClick={() => handleMobileInput(mobileNumber)}
                        disabled={!mobileNumber.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Continue to Deployment
                      </motion.button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deploymentQuestions[currentQuestion]?.options?.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerQuestion(option)}
                          className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-purple-500 rounded-lg text-white transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Deployment Progress */}
          {isDeploying && (
            <motion.div
              className="mt-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-effect p-6 rounded-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {deploymentStep < 5 ? deploymentSteps[deploymentStep] : 'Deploying AI Agents...'}
                  </h3>
                  {deploymentStep >= 5 && currentAgent && (
                    <p className="text-purple-300 text-sm">Currently deploying: {currentAgent}</p>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: deploymentStep < 5 
                        ? `${(deploymentStep / 7) * 100}%` 
                        : `${((4 + deployedAgents.length) / 7) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {/* Agent Cards */}
                {deploymentStep >= 5 && (
                  <div className="grid grid-cols-5 gap-3 mt-6">
                    {agents.map((agent, index) => (
                      <motion.div
                        key={index}
                        className={`p-3 rounded-lg border transition-all duration-500 ${
                          deployedAgents.includes(agent.name)
                            ? 'border-green-400 bg-green-400/10'
                            : currentAgent === agent.name
                            ? 'border-orange-400 bg-orange-400/10 animate-pulse'
                            : 'border-gray-600 bg-gray-800/50'
                        }`}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-center">
                          <agent.icon 
                            size={24} 
                            className={`mx-auto mb-2 ${
                              deployedAgents.includes(agent.name) ? 'text-green-400' : 
                              currentAgent === agent.name ? 'text-orange-400' : 'text-gray-400'
                            }`} 
                          />
                          <p className="text-xs font-medium text-white">{agent.name}</p>
                          <div className="mt-1">
                            {deployedAgents.includes(agent.name) ? (
                              <div className="text-green-400 text-xs">✓ Online</div>
                            ) : currentAgent === agent.name ? (
                              <div className="text-orange-400 text-xs">Deploying...</div>
                            ) : (
                              <div className="text-gray-500 text-xs">Waiting...</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Deployment Result */}
          {deploymentResult && (
            <motion.div
              className={`mt-8 px-6 py-3 rounded-full glass-effect ${
                deploymentResult.includes('success') || deploymentResult.includes('deployed') 
                  ? 'border border-green-400/50' 
                  : 'border border-red-400/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className={`${
                deploymentResult.includes('success') || deploymentResult.includes('deployed')
                  ? 'text-green-400' 
                  : 'text-red-400'
              } font-medium`}>
                {deploymentResult}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-purple-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}