'use client'

import { motion } from 'framer-motion'
import { Code, Cpu, Database, Globe, Layers, Zap, Brain, Shield } from 'lucide-react'

export default function TechStackSection() {
  const techCategories = [
    {
      category: "AI & Agents",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      technologies: [
        { name: "Fetch.ai uAgents", description: "Multi-agent framework", status: "Core" },
        { name: "TensorFlow", description: "ML model training", status: "Active" },
        { name: "scikit-learn", description: "Risk modeling", status: "Active" },
        { name: "Pandas & NumPy", description: "Data processing", status: "Active" }
      ]
    },
    {
      category: "Blockchain & ICP",
      icon: Cpu,
      color: "from-blue-500 to-cyan-500",
      technologies: [
        { name: "Internet Computer", description: "On-chain hosting", status: "Core" },
        { name: "ICP Internet Identity", description: "Decentralized auth", status: "Core" },
        { name: "Motoko", description: "Smart contracts", status: "Active" },
        { name: "ICP Canisters", description: "State storage", status: "Active" }
      ]
    },
    {
      category: "Frontend",
      icon: Code,
      color: "from-green-500 to-emerald-500",
      technologies: [
        { name: "Next.js 15", description: "React framework", status: "Core" },
        { name: "Tailwind CSS", description: "Styling", status: "Active" },
        { name: "Framer Motion", description: "Animations", status: "Active" },
        { name: "TypeScript", description: "Type safety", status: "Core" }
      ]
    },
    {
      category: "DeFi Integration",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      technologies: [
        { name: "Web3.py", description: "Blockchain interaction", status: "Core" },
        { name: "1inch API", description: "DEX aggregation", status: "Active" },
        { name: "Chainlink", description: "Price feeds", status: "Active" },
        { name: "The Graph", description: "Indexing", status: "Active" }
      ]
    },
    {
      category: "Multi-Chain",
      icon: Layers,
      color: "from-indigo-500 to-purple-500",
      technologies: [
        { name: "Ethereum", description: "Main DeFi hub", status: "Integrated" },
        { name: "Polygon", description: "L2 scaling", status: "Integrated" },
        { name: "Arbitrum", description: "Optimistic rollup", status: "Integrated" },
        { name: "BSC", description: "Alternative chain", status: "Integrated" }
      ]
    },
    {
      category: "Security",
      icon: Shield,
      color: "from-red-500 to-pink-500",
      technologies: [
        { name: "MEV Protection", description: "Sandwich attack prevention", status: "Core" },
        { name: "Gas Optimization", description: "Transaction efficiency", status: "Active" },
        { name: "Risk Scoring", description: "ML-based assessment", status: "Active" },
        { name: "Emergency Exits", description: "Auto liquidation", status: "Active" }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Core': return 'text-green-400 bg-green-400/20'
      case 'Active': return 'text-blue-400 bg-blue-400/20'
      case 'Integrated': return 'text-purple-400 bg-purple-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <section id="tech-stack" className="py-20 px-6">
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
            <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Cutting-edge technologies powering the future of autonomous DeFi management
          </p>
          
          {/* Tech Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">25+</div>
              <div className="text-sm text-gray-400">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">5</div>
              <div className="text-sm text-gray-400">Blockchains</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>
        </motion.div>

        {/* Simplified Tech Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              className="glass-effect rounded-2xl p-8 text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(102, 126, 234, 0.4)"
              }}
            >
              {/* Category Icon */}
              <motion.div 
                className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <category.icon size={36} className="text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {category.category}
              </h3>
              
              {/* Key Technologies */}
              <div className="space-y-2 mb-6">
                {category.technologies.slice(0, 3).map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    className="text-gray-300 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (techIndex * 0.1) }}
                    viewport={{ once: true }}
                  >
                    • {tech.name}
                  </motion.div>
                ))}
                {category.technologies.length > 3 && (
                  <div className="text-purple-400 text-sm font-medium">
                    +{category.technologies.length - 3} more
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-green-400 text-sm font-medium">All Systems Active</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simple Stats */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-8 py-4 glass-effect rounded-full"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="text-purple-400 mr-3" size={24} />
            </motion.div>
            <span className="text-white font-semibold">
              Powered by <span className="text-purple-400">25+ Technologies</span> • 
              <span className="text-green-400 ml-2">99.9% Uptime</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
