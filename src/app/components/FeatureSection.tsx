'use client'

import { motion } from 'framer-motion'
import { Smartphone, Zap, Shield, Palette, Globe, Cpu } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with sub-second load times and instant interactions.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Perfectly responsive design that works flawlessly on any device.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'Enterprise-grade security with end-to-end encryption and privacy protection.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'Stunning visual design with smooth animations and modern aesthetics.',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: Globe,
    title: 'Global Ready',
    description: 'Multi-language support and worldwide accessibility compliance.',
    color: 'from-indigo-400 to-purple-500'
  },
  {
    icon: Cpu,
    title: 'AI Powered',
    description: 'Intelligent features that learn and adapt to user behavior patterns.',
    color: 'from-red-400 to-pink-500'
  }
]

export default function FeatureSection() {
  return (
    <section className="py-20 px-6 relative" id="features">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
            <span className="gradient-text">Exceptional Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-poppins">
            Discover the powerful capabilities that make our platform extraordinary
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 glass-effect rounded-2xl hover:glow-effect transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-space font-bold mb-4 text-white group-hover:gradient-text transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed font-poppins">
                {feature.description}
              </p>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)`,
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}