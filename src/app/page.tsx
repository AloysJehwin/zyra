'use client'

import { motion } from 'framer-motion'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FeatureSection from './components/FeatureSection'
import StatsSection from './components/StatsSection'
import TestimonialSection from './components/TestimonialSection'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <Header />
        <HeroSection />
        <FeatureSection />
        <StatsSection />
        <TestimonialSection />
        <Footer />
      </div>
    </main>
  )
}