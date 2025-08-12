'use client'

import { useState } from 'react'

export default function TelegramTestPage() {
  const [result, setResult] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const testNotifications = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/test-notifications?type=${type}`)
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const sendCustomMessage = async () => {
    if (!customMessage.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/test-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: customMessage, type: 'info' })
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
      setCustomMessage('')
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const checkBotStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/telegram?action=status')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🤖 Telegram Bot Testing Interface
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Quick Tests</h2>
            <div className="space-y-4">
              <button
                onClick={() => testNotifications('all')}
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
              >
                Send All Test Notifications
              </button>
              
              <button
                onClick={() => testNotifications('portfolio')}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
              >
                Portfolio Update
              </button>
              
              <button
                onClick={() => testNotifications('agent')}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                Agent Status
              </button>
              
              <button
                onClick={() => testNotifications('market')}
                disabled={loading}
                className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg disabled:opacity-50"
              >
                Market Alert
              </button>

              <button
                onClick={checkBotStatus}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50"
              >
                Check Bot Status
              </button>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Custom Message</h2>
            <div className="space-y-4">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter custom message to send via Telegram..."
                className="w-full h-32 p-3 bg-gray-800 rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={sendCustomMessage}
                disabled={loading || !customMessage.trim()}
                className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg disabled:opacity-50"
              >
                Send Custom Message
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">How to Subscribe:</h2>
          <div className="glass-effect p-6 rounded-xl">
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Open Telegram and search for <code className="bg-gray-800 px-2 py-1 rounded">@zyra_info_bot</code></li>
              <li>Send the message <code className="bg-gray-800 px-2 py-1 rounded">/start</code></li>
              <li>Send the message <code className="bg-gray-800 px-2 py-1 rounded">/subscribe</code></li>
              <li>You&apos;ll receive a confirmation message</li>
              <li>Now test the notifications above!</li>
            </ol>
          </div>
        </div>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="glass-effect p-4 rounded-xl text-sm overflow-auto bg-gray-900">
              {result}
            </pre>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="glass-effect p-6 rounded-xl flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
        )}
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