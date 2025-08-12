'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Shield, Zap, Users, Target, Award, CheckCircle, Brain } from 'lucide-react'

export default function FeaturesMetricsSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Yield Prediction",
      description: "Machine learning models predict optimal yield opportunities before they trend",
      benefit: "15-25% higher returns",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Risk Scoring with ML Models",
      description: "Advanced algorithms assess protocol risks and detect potential scams in real-time",
      benefit: "98.5% accuracy rate",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Gas Optimization & MEV Protection",
      description: "Smart routing and MEV protection save on transaction costs and prevent exploitation",
      benefit: "30% gas savings",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "DAO Governance Participation",
      description: "Automated voting and governance participation to maximize protocol benefits",
      benefit: "Auto-compound rewards",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Target,
      title: "Cross-Chain Allocation Strategies",
      description: "Optimal asset distribution across multiple chains for maximum yield and diversification",
      benefit: "Multi-chain optimization",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Award,
      title: "24/7 Autonomous Operation",
      description: "Never miss an opportunity with continuous monitoring and instant execution",
      benefit: "Zero downtime trading",
      color: "from-pink-500 to-red-500"
    }
  ]

  const successMetrics = [
    {
      metric: "15%+",
      label: "Average APY",
      description: "vs market average 5%",
      icon: TrendingUp,
      color: "text-green-400",
      improvement: "+200% vs manual"
    },
    {
      metric: "30%",
      label: "Reduced Gas Fees",
      description: "through optimization",
      icon: Zap,
      color: "text-blue-400",
      improvement: "Saved $2.4M total"
    },
    {
      metric: "26%+",
      label: "Lower Impermanent Loss",
      description: "vs standard LPs",
      icon: Shield,
      color: "text-purple-400",
      improvement: "ML-powered hedging"
    },
    {
      metric: "100+",
      label: "Active Beta Users",
      description: "testing the platform",
      icon: Users,
      color: "text-orange-400",
      improvement: "Growing waitlist"
    },
    {
      metric: "99.9%",
      label: "System Uptime",
      description: "reliable operation",
      icon: CheckCircle,
      color: "text-cyan-400",
      improvement: "Enterprise grade"
    },
    {
      metric: "5",
      label: "AI Agents",
      description: "working in coordination",
      icon: Brain,
      color: "text-pink-400",
      improvement: "Multi-agent system"
    }
  ]

  const timeline = [
    {
      week: "Week 1",
      tasks: [
        "Agent setup & ICP canister development",
        "Initial DeFi protocol integrations",
        "Basic risk assessment models"
      ],
      status: "In Progress"
    },
    {
      week: "Week 2",
      tasks: [
        "Cross-chain orchestration implementation",
        "Advanced ML risk models training",
        "Frontend integration & demo preparation"
      ],
      status: "Planned"
    }
  ]

  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Features Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold mb-6">
            <span className="gradient-text">Special Features</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Revolutionary capabilities that set DeFAI Oracle apart from traditional DeFi management
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-effect p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border border-purple-500/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon size={28} className="text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-semibold">{feature.benefit}</span>
                <CheckCircle className="text-green-400" size={20} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Metrics Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold mb-6">
            <span className="gradient-text">Success Metrics</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Measurable results that demonstrate the power of AI-driven DeFi management
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {successMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="glass-effect p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className={`${metric.color} mb-4 flex justify-center`}>
                <metric.icon size={40} />
              </div>
              
              <motion.div
                className={`text-5xl font-bold ${metric.color} mb-2`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                {metric.metric}
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-2">{metric.label}</h3>
              <p className="text-gray-400 mb-3">{metric.description}</p>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-800 ${metric.color} text-sm font-medium`}>
                <TrendingUp size={14} className="mr-1" />
                {metric.improvement}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-8 py-4 glass-effect rounded-full mb-8"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="text-purple-400 mr-3" size={24} />
            </motion.div>
            <span className="text-white font-semibold text-lg">
              Ready to Optimize Your DeFi Portfolio?
            </span>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Deploy AI Agents
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Live Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
