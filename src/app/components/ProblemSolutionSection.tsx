'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, Clock, Shield, Cpu, CheckCircle, ArrowRight } from 'lucide-react'

export default function ProblemSolutionSection() {
  const problems = [
    {
      icon: TrendingDown,
      title: "Inefficient Yield Hunting",
      description: "Manual DeFi farming leads to missed opportunities and suboptimal returns",
      loss: "$200M+ annually"
    },
    {
      icon: AlertTriangle,
      title: "Poor Risk Assessment",
      description: "Lack of real-time risk analysis results in significant portfolio losses",
      loss: "$150M+ annually"
    },
    {
      icon: Clock,
      title: "Manual Rebalancing Delays",
      description: "Slow human response times miss critical market movements",
      loss: "$200M+ annually"
    },
    {
      icon: Shield,
      title: "MEV Exploitation",
      description: "Frontrunning and sandwich attacks drain value from transactions",
      loss: "$100M+ annually"
    }
  ]

  const solutions = [
    {
      icon: Cpu,
      title: "Market Intelligence Agent",
      description: "Real-time trend forecasting and opportunity scanning across all major DeFi protocols"
    },
    {
      icon: TrendingDown,
      title: "Yield Hunter Agent",
      description: "Automated discovery of optimal yield farming and lending opportunities"
    },
    {
      icon: Shield,
      title: "Risk Manager Agent",
      description: "ML-powered risk evaluation and scam detection with instant threat response"
    },
    {
      icon: Cpu,
      title: "Transaction Orchestrator",
      description: "MEV-protected multi-chain transaction execution with gas optimization"
    },
    {
      icon: CheckCircle,
      title: "Portfolio Rebalancer",
      description: "Continuous allocation adjustment for maximum efficiency and risk management"
    }
  ]

  return (
    <section id="problem-solution" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Problem Statement */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold mb-6">
            <span className="text-red-400">The Problem</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            DeFi investors lose <span className="text-red-400 font-bold text-2xl">$650M+ annually</span> due to fundamental inefficiencies
          </p>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              className="glass-effect p-6 rounded-xl hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="text-red-400 mb-4">
                <problem.icon size={40} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{problem.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{problem.description}</p>
              <div className="text-red-400 font-bold text-lg">{problem.loss}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Arrow Transition */}
        <motion.div
          className="flex justify-center mb-20"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <ArrowRight className="text-white" size={24} />
            </motion.div>
            <span className="text-purple-400 font-semibold">AI Solution</span>
          </div>
        </motion.div>

        {/* Solution Statement */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold mb-6">
            <span className="gradient-text">AI Solution</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            <span className="text-purple-400 font-bold">5 Smart AI Agents</span> work together 24/7 to maximize your crypto returns
          </p>
        </motion.div>

        {/* Simple Solutions Grid */}
        <motion.div
          className="grid md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              className="glass-effect p-6 rounded-2xl text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)"
              }}
            >
              <motion.div 
                className="text-purple-400 mb-4 mx-auto"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <solution.icon size={40} />
              </motion.div>
              <h3 className="text-sm font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                {solution.title.replace(' Agent', '')}
              </h3>
              
              {/* Simple Status */}
              <div className="flex items-center justify-center">
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                  whileHover={{ scale: 1.5 }}
                />
                <span className="text-xs text-green-400 font-medium ml-2">Active</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-8 py-4 glass-effect rounded-full">
            <CheckCircle className="text-green-400 mr-3" size={24} />
            <span className="text-white font-semibold">
              Result: <span className="text-green-400">$650M+ in losses prevented</span> through AI automation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
