'use client'

import { useState } from 'react'

export default function IntelligentTestPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const tests = [
    {
      name: 'AI Market Analysis',
      description: 'Test OpenAI-powered market intelligence agent',
      endpoint: '/api/ai-agents',
      method: 'POST',
      payload: {
        agentType: 'market-intelligence',
        userProfile: {
          name: 'Test User',
          experience: '📊 Some Experience',
          riskTolerance: '⚖️ Moderate',
          goals: ['💰 Passive Income', '📈 Portfolio Growth'],
          preferredAssets: ['⟠ Ethereum (ETH)', '💵 Stablecoins']
        },
        marketData: {
          ethTrend: 'Bullish',
          gasPrice: 'High',
          tvlTrend: 'Growing'
        },
        action: 'analyze'
      }
    },
    {
      name: 'Smart Notification Test',
      description: 'Test intelligent notification filtering',
      endpoint: '/api/smart-notifications',
      method: 'POST',
      payload: {
        chatId: 5859252948,
        type: 'portfolio',
        data: {
          newValue: 95000,
          oldValue: 87000
        },
        priority: 'high'
      }
    },
    {
      name: 'User Onboarding Start',
      description: 'Test personalized onboarding system',
      endpoint: '/api/user-onboarding?action=start',
      method: 'GET'
    },
    {
      name: 'Agent Status Check',
      description: 'Check AI agent activation status',
      endpoint: '/api/ai-agents?action=status-all',
      method: 'GET'
    },
    {
      name: 'SMS Notification Test',
      description: 'Test SMS notification system',
      endpoint: '/api/sms-notification',
      method: 'POST',
      payload: {
        mobile: '+1555123456',
        message: '🤖 ZYRA Test: Your AI agents are now active! This is a test SMS notification.',
        agentName: 'Test Agent'
      }
    }
  ]

  const runTest = async (test: typeof tests[0]) => {
    setLoading(true)
    try {
      const response = await fetch(test.endpoint, {
        method: test.method,
        headers: test.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
        body: test.method === 'POST' ? JSON.stringify(test.payload) : undefined
      })

      const data = await response.json()
      
      setResults(prev => [...prev, {
        test: test.name,
        success: response.ok,
        data,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (error) {
      setResults(prev => [...prev, {
        test: test.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    setResults([])
    for (const test of tests) {
      await runTest(test)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait between tests
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🧠 ZYRA Intelligence Test Suite
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-300">{test.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{test.description}</p>
                  <button
                    onClick={() => runTest(test)}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 text-sm"
                  >
                    Run Test
                  </button>
                </div>
              ))}
              
              <button
                onClick={runAllTests}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </button>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No tests run yet</p>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      result.success ? 'border-green-400' : 'border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{result.test}</h3>
                      <span className="text-sm text-gray-400">{result.timestamp}</span>
                    </div>
                    <div className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </div>
                    {result.error && (
                      <p className="text-red-400 text-sm mt-2">Error: {result.error}</p>
                    )}
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-purple-300">
                          View Response Data
                        </summary>
                        <pre className="text-xs bg-gray-800 p-3 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">📱 Telegram Bot Testing</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">✅ Fixed Issues</h3>
              <ul className="text-sm space-y-1">
                <li>• Spam notifications completely disabled</li>
                <li>• Interactive deployment with questions</li>
                <li>• Mobile number collection</li>
                <li>• Personalized AI agent configuration</li>
              </ul>
            </div>
            
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">🆕 New Features</h3>
              <ul className="text-sm space-y-1">
                <li>• Interactive deployment questions</li>
                <li>• Mobile number collection</li>
                <li>• SMS notifications support</li>
                <li>• Personalized agent configuration</li>
              </ul>
            </div>
            
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">🤖 Commands</h3>
              <ul className="text-sm space-y-1">
                <li>• /setup - Personalize experience</li>
                <li>• /analyze - AI market analysis</li>
                <li>• /profile - View your profile</li>
                <li>• /help - Updated command list</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = `
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
`