'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Activity, RefreshCw, Wallet } from 'lucide-react'
import { usePortfolio } from '../../lib/hooks/usePortfolio'
import { usePortfolioUpdates } from '../../lib/hooks/useRealtime'

export default function PortfolioDashboard() {
  const { 
    portfolio, 
    loading, 
    error, 
    isConnected, 
    rebalancePortfolio, 
    refetch 
  } = usePortfolio()
  
  const { portfolioUpdates, connected: realtimeConnected } = usePortfolioUpdates()

  if (!isConnected) {
    return (
      <section id="portfolio" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            className="glass-effect p-12 rounded-2xl max-w-md mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your DeFi portfolio and deploy AI agents
            </p>
            <w3m-button />
          </motion.div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="portfolio" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !portfolio) {
    return (
      <section id="portfolio" className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            className="glass-effect p-8 rounded-2xl max-w-md mx-auto border border-red-400/50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Portfolio</h3>
            <p className="text-gray-400 mb-4">{error || 'Failed to load portfolio data'}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  const handleRebalance = async () => {
    try {
      await rebalancePortfolio()
    } catch (error) {
      console.error('Rebalance failed:', error)
    }
  }

  return (
    <section id="portfolio" className="py-20 px-6">
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
            <span className="gradient-text">Your Portfolio</span>
          </h2>
          <div className="flex justify-center items-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-green-400 font-medium">Portfolio Active</span>
            </div>
            {realtimeConnected && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
                <span className="text-blue-400 font-medium text-sm">Live Updates</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="glass-effect p-8 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
            </div>
            <div className={`flex items-center ${portfolio.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolio.dailyChange >= 0 ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="font-medium">
                {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyChange.toFixed(2)}% today
              </span>
            </div>
          </motion.div>

          <motion.div
            className="glass-effect p-8 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-purple-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {portfolio.totalGrowth.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Total Growth</div>
              </div>
            </div>
            <div className="text-purple-400 font-medium">
              AI Optimized
            </div>
          </motion.div>

          <motion.div
            className="glass-effect p-8 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {portfolio.assets.length}
                </div>
                <div className="text-sm text-gray-400">Active Positions</div>
              </div>
            </div>
            <div className="text-blue-400 font-medium">
              Multi-Chain
            </div>
          </motion.div>
        </div>

        {/* Top Assets */}
        <motion.div
          className="glass-effect p-8 rounded-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Top Assets</h3>
            <motion.button
              className="flex items-center px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              onClick={handleRebalance}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} className="mr-2" />
              Rebalance
            </motion.button>
          </div>

          <div className="space-y-4">
            {portfolio.assets.slice(0, 5).map((asset, index) => (
              <motion.div
                key={asset.symbol}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{asset.symbol}</div>
                    <div className="text-sm text-gray-400">{asset.protocol}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white">
                    ${asset.value.toLocaleString()}
                  </div>
                  <div className={`text-sm flex items-center ${
                    asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.change24h >= 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-purple-400 font-medium">
                    {asset.apy.toFixed(1)}% APY
                  </div>
                  <div className="text-sm text-gray-400">
                    {asset.allocation.toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        {portfolioUpdates.length > 0 && (
          <motion.div
            className="glass-effect p-6 rounded-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Live Updates</h3>
            <div className="space-y-3">
              {portfolioUpdates.slice(0, 3).map((update, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
                    <span className="text-gray-300">
                      Portfolio value: ${update.totalValue?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}



