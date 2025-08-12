// Telegram notification service
export class TelegramNotificationService {
  private static instance: TelegramNotificationService
  private isConfigured: boolean = false

  private constructor() {
    this.checkConfiguration()
  }

  public static getInstance(): TelegramNotificationService {
    if (!TelegramNotificationService.instance) {
      TelegramNotificationService.instance = new TelegramNotificationService()
    }
    return TelegramNotificationService.instance
  }

  private async checkConfiguration() {
    try {
      const response = await fetch('/api/telegram?action=status')
      const data = await response.json()
      this.isConfigured = data.configured
    } catch (error) {
      console.error('Failed to check Telegram configuration:', error)
      this.isConfigured = false
    }
  }

  public async sendPortfolioUpdate(data: {
    totalValue: number
    dailyChange: number
    action?: string
    asset?: string
  }) {
    if (!this.isConfigured) return

    const change = data.dailyChange >= 0 ? '+' : ''
    const changeEmoji = data.dailyChange >= 0 ? '📈' : '📉'
    
    let message = `💼 *Portfolio Update*\n\n`
    message += `💰 Total Value: $${data.totalValue.toLocaleString()}\n`
    message += `${changeEmoji} 24h Change: ${change}${data.dailyChange.toFixed(2)}%\n`
    
    if (data.action) {
      message += `⚡ Action: ${data.action}\n`
    }
    if (data.asset) {
      message += `🎯 Asset: ${data.asset}\n`
    }
    
    message += `\n🕒 ${new Date().toLocaleTimeString()}`

    await this.sendNotification(message, data.dailyChange >= 0 ? 'success' : 'warning')
  }

  public async sendAgentUpdate(agentName: string, status: 'online' | 'offline' | 'active', details?: string) {
    if (!this.isConfigured) return

    const statusEmoji = {
      online: '🟢',
      offline: '🔴',
      active: '🔥'
    }

    let message = `🤖 *Agent Update*\n\n`
    message += `${statusEmoji[status]} ${agentName}: ${status.toUpperCase()}\n`
    
    if (details) {
      message += `📋 ${details}\n`
    }
    
    message += `\n🕒 ${new Date().toLocaleTimeString()}`

    await this.sendNotification(message, status === 'offline' ? 'warning' : 'info')
  }

  public async sendMarketAlert(type: 'opportunity' | 'risk' | 'news', data: {
    protocol?: string
    apy?: string
    tvl?: string
    description: string
  }) {
    if (!this.isConfigured) return

    const typeEmoji = {
      opportunity: '💎',
      risk: '⚠️',
      news: '📰'
    }

    let message = `${typeEmoji[type]} *Market ${type.charAt(0).toUpperCase() + type.slice(1)}*\n\n`
    
    if (data.protocol) {
      message += `🏦 Protocol: ${data.protocol}\n`
    }
    if (data.apy) {
      message += `💹 APY: ${data.apy}\n`
    }
    if (data.tvl) {
      message += `💰 TVL: $${data.tvl}\n`
    }
    
    message += `📝 ${data.description}\n`
    message += `\n🕒 ${new Date().toLocaleTimeString()}`

    await this.sendNotification(message, type === 'risk' ? 'warning' : 'info')
  }

  public async sendTransactionUpdate(txData: {
    type: string
    amount: string
    status: 'pending' | 'completed' | 'failed'
    gasOptimization?: string
  }) {
    if (!this.isConfigured) return

    const statusEmoji = {
      pending: '⏳',
      completed: '✅',
      failed: '❌'
    }

    let message = `💸 *Transaction Update*\n\n`
    message += `${statusEmoji[txData.status]} Status: ${txData.status.toUpperCase()}\n`
    message += `🔄 Type: ${txData.type}\n`
    message += `💰 Amount: ${txData.amount}\n`
    
    if (txData.gasOptimization) {
      message += `⛽ Gas Saved: ${txData.gasOptimization}\n`
    }
    
    message += `\n🕒 ${new Date().toLocaleTimeString()}`

    await this.sendNotification(
      message, 
      txData.status === 'completed' ? 'success' : 
      txData.status === 'failed' ? 'error' : 'info'
    )
  }

  public async sendAIInsight(agent: string, insight: string) {
    if (!this.isConfigured) return

    let message = `🧠 *AI Insight*\n\n`
    message += `🤖 Agent: ${agent}\n`
    message += `💡 ${insight}\n`
    message += `\n🕒 ${new Date().toLocaleTimeString()}`

    await this.sendNotification(message, 'info')
  }

  private async sendNotification(message: string, type: 'info' | 'success' | 'warning' | 'error') {
    try {
      const response = await fetch('/api/telegram?' + new URLSearchParams({
        action: 'send_notification',
        message,
        type
      }))

      if (!response.ok) {
        console.error('Failed to send Telegram notification:', await response.text())
      }
    } catch (error) {
      console.error('Error sending Telegram notification:', error)
    }
  }

  public async getSubscriberCount(): Promise<number> {
    try {
      const response = await fetch('/api/telegram?action=subscribers')
      const data = await response.json()
      return data.subscribers || 0
    } catch (error) {
      console.error('Failed to get subscriber count:', error)
      return 0
    }
  }

  public isEnabled(): boolean {
    return this.isConfigured
  }
}

// Export singleton instance
export const telegramService = TelegramNotificationService.getInstance()

// Hook for React components
export function useTelegramNotifications() {
  const service = TelegramNotificationService.getInstance()
  
  return {
    sendPortfolioUpdate: (data: Parameters<typeof service.sendPortfolioUpdate>[0]) => 
      service.sendPortfolioUpdate(data),
    sendAgentUpdate: (agentName: string, status: 'online' | 'offline' | 'active', details?: string) =>
      service.sendAgentUpdate(agentName, status, details),
    sendMarketAlert: (type: 'opportunity' | 'risk' | 'news', data: Parameters<typeof service.sendMarketAlert>[1]) =>
      service.sendMarketAlert(type, data),
    sendTransactionUpdate: (data: Parameters<typeof service.sendTransactionUpdate>[0]) =>
      service.sendTransactionUpdate(data),
    sendAIInsight: (agent: string, insight: string) =>
      service.sendAIInsight(agent, insight),
    getSubscriberCount: () => service.getSubscriberCount(),
    isEnabled: () => service.isEnabled()
  }
}