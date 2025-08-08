'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function HeroSection() {
  const { address, isConnected } = useAccount()

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-purple-400 opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-pink-400 opacity-30"
          animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Rocket size={50} />
        </motion.div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isConnected && (
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full glass-effect mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
            >
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse" />
              <span className="font-medium text-sm">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </motion.div>
          )}

          <motion.h1
            className="text-6xl md:text-8xl font-space font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block">The Future of</span>
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
              }}
            >
              Web Design
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-poppins leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experience revolutionary interfaces that adapt, respond, and evolve with your every interaction. 
            Built for the next generation of web experiences.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </motion.button>

            <motion.button
              className="px-8 py-4 border-2 border-purple-400 rounded-full font-semibold text-lg hover:bg-purple-400 hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
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