'use client'

import { motion } from 'framer-motion'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProblemSolutionSection from './components/ProblemSolutionSection'
import AgentsSection from './components/AgentsSection'
import TechStackSection from './components/TechStackSection'
import ArchitectureSection from './components/ArchitectureSection'
import FeaturesMetricsSection from './components/FeaturesMetricsSection'
import ParticleBackground from './components/ParticleBackground'
import PortfolioDashboard from './components/PortfolioDashboard'
import ClientWrapper from './components/ClientWrapper'

export default function Home() {
  return (
    <ClientWrapper>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-x-hidden">
        <div className="relative">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, -50, 0],
                y: [0, 50, 0],
                scale: [1.1, 1, 1.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Additional responsive AI-themed background elements */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-30 h-30 sm:w-60 sm:h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"
              animate={{
                x: [0, 25, -25, 0],
                y: [0, -25, 25, 0],
                scale: [1, 1.05, 0.95, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/3 w-20 h-20 sm:w-40 sm:h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"
              animate={{
                x: [0, -15, 15, 0],
                y: [0, 15, -15, 0],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <ParticleBackground />
          <Header />
          <HeroSection />
          <ProblemSolutionSection />
          <AgentsSection />
          <PortfolioDashboard />
          <TechStackSection />
          <ArchitectureSection />
          <FeaturesMetricsSection />
        </div>
      </main>
    </ClientWrapper>
  )
}