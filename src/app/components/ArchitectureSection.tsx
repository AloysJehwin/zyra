'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Database, Brain, Shield, Cpu, Activity, Globe, Layers } from 'lucide-react'

export default function ArchitectureSection() {
  const architectureFlow = [
    {
      step: 1,
      title: "Market Data Ingestion",
      icon: Database,
      description: "Real-time data collection from multiple sources",
      details: ["Price feeds from Chainlink", "On-chain transaction data", "Social sentiment analysis", "Cross-chain metrics"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      title: "AI Agent Processing",
      icon: Brain,
      description: "5 specialized agents analyze and coordinate",
      details: ["Market Intelligence analysis", "Yield opportunity scanning", "Risk assessment modeling", "Strategy coordination"],
      color: "from-purple-500 to-pink-500"
    },
    {
      step: 3,
      title: "Risk Evaluation",
      icon: Shield,
      description: "ML-powered risk scoring and validation",
      details: ["Smart contract audits", "Liquidity risk analysis", "Impermanent loss calculation", "Scam detection algorithms"],
      color: "from-red-500 to-orange-500"
    },
    {
      step: 4,
      title: "Transaction Execution",
      icon: Cpu,
      description: "Optimized cross-chain execution with MEV protection",
      details: ["Gas optimization", "MEV protection routing", "Multi-chain coordination", "Slippage minimization"],
      color: "from-green-500 to-emerald-500"
    },
    {
      step: 5,
      title: "Portfolio Rebalancing",
      icon: Activity,
      description: "Continuous optimization and state updates",
      details: ["Dynamic allocation adjustment", "Performance monitoring", "ICP canister updates", "User dashboard sync"],
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const deploymentLayers = [
    {
      layer: "Frontend Layer",
      icon: Globe,
      technologies: ["Next.js", "ICP Internet Identity", "Tailwind CSS"],
      description: "User interface hosted on ICP",
      color: "from-blue-500 to-purple-500"
    },
    {
      layer: "Agent Layer",
      icon: Brain,
      technologies: ["Fetch.ai uAgents", "Python ML Stack", "TensorFlow"],
      description: "AI agents on Fetch.ai Agentverse",
      color: "from-purple-500 to-pink-500"
    },
    {
      layer: "Blockchain Layer",
      icon: Layers,
      technologies: ["Ethereum", "Polygon", "Arbitrum", "BSC"],
      description: "Multi-chain DeFi protocols",
      color: "from-green-500 to-blue-500"
    },
    {
      layer: "Storage Layer",
      icon: Database,
      technologies: ["ICP Canisters", "Motoko", "On-chain State"],
      description: "Decentralized data storage",
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <section id="architecture" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold mb-6">
            <span className="gradient-text">System Architecture</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Fully decentralized, autonomous, and scalable architecture powered by cutting-edge Web3 + AI technologies
          </p>
        </motion.div>

        {/* Simple Architecture Flow */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-12">How It Works</h3>
          
          <div className="flex justify-center items-center flex-wrap gap-8">
            {architectureFlow.map((step, index) => (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center max-w-xs"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-4`}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)"
                  }}
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                  }}
                >
                  <step.icon size={32} className="text-white" />
                </motion.div>
                
                <div className="text-sm font-bold text-purple-400 mb-2">Step {step.step}</div>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.description}</p>
                
                {index < architectureFlow.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-10 left-full w-16 h-0.5 bg-purple-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Deployment Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-12">Deployment Architecture</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deploymentLayers.map((layer, index) => (
              <motion.div
                key={layer.layer}
                className="glass-effect p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${layer.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <layer.icon size={28} className="text-white" />
                </div>
                
                <h4 className="text-lg font-bold text-white text-center mb-3">{layer.layer}</h4>
                <p className="text-gray-400 text-sm text-center mb-4">{layer.description}</p>
                
                <div className="space-y-2">
                  {layer.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={tech}
                      className="text-center py-2 px-3 bg-gray-800/50 rounded-lg text-sm text-purple-300"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.15 + techIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>

                {/* Status Indicator */}
                <div className="flex justify-center mt-4">
                  <div className="flex items-center px-3 py-1 bg-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Simple Tech Overview */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-8">Powered By</h3>
          
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            {[
              { name: "Fetch.ai", icon: Brain, desc: "AI Agents" },
              { name: "ICP", icon: Database, desc: "Blockchain" },
              { name: "Next.js", icon: Globe, desc: "Frontend" },
              { name: "Multi-Chain", icon: Layers, desc: "DeFi" }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5
                }}
              >
                <motion.div
                  className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center mb-3"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(102, 126, 234, 0.3)",
                      "0 0 30px rgba(147, 51, 234, 0.5)",
                      "0 0 20px rgba(102, 126, 234, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <tech.icon className="text-purple-400" size={28} />
                </motion.div>
                <div className="text-white font-bold text-sm">{tech.name}</div>
                <div className="text-gray-400 text-xs">{tech.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
