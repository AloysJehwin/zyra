import { NextRequest, NextResponse } from 'next/server'

// In a real implementation, you would use services like:
// - Twilio
// - AWS SNS 
// - Vonage/Nexmo
// - TextMagic
// For demo purposes, we'll simulate SMS sending

interface SMSRequest {
  mobile: string
  message: string
  agentName?: string
}

// Store sent SMS for tracking (in production, use a database)
const smsHistory = new Map<string, {
  messages: Array<{
    message: string
    timestamp: Date
    agentName?: string
    status: 'sent' | 'delivered' | 'failed'
  }>
  lastSent: Date
}>()

export async function POST(request: NextRequest) {
  try {
    const { mobile, message, agentName }: SMSRequest = await request.json()

    if (!mobile || !message) {
      return NextResponse.json({ error: 'Mobile number and message are required' }, { status: 400 })
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(mobile)) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 })
    }

    // Rate limiting: max 10 SMS per hour per number
    const userHistory = smsHistory.get(mobile) || { messages: [], lastSent: new Date(0) }
    const oneHourAgo = new Date(Date.now() - 3600000)
    const recentMessages = userHistory.messages.filter(m => m.timestamp > oneHourAgo)
    
    if (recentMessages.length >= 10) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Maximum 10 SMS per hour.' 
      }, { status: 429 })
    }

    // Simulate SMS sending (in production, integrate with SMS provider)
    const success = await sendSMS(mobile, message, agentName)
    
    if (success) {
      // Record the SMS
      userHistory.messages.push({
        message,
        timestamp: new Date(),
        agentName,
        status: 'sent'
      })
      userHistory.lastSent = new Date()
      smsHistory.set(mobile, userHistory)

      // Log successful SMS (for demo purposes)
      console.log(`📱 SMS sent to ${mobile}: ${message}`)

      return NextResponse.json({
        success: true,
        message: 'SMS sent successfully',
        mobile: mobile.slice(0, -4) + '****', // Partially mask number
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send SMS'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('SMS notification error:', error)
    return NextResponse.json(
      { error: 'Failed to process SMS request' },
      { status: 500 }
    )
  }
}

// Simulate SMS sending (replace with real SMS service integration)
async function sendSMS(_mobile: string, _message: string, _agentName?: string): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05

  if (success) {
    // In production, this would make an API call to your SMS provider
    // Example with Twilio:
    /*
    const client = require('twilio')(accountSid, authToken)
    
    await client.messages.create({
      body: message,
      from: '+1234567890', // Your Twilio number
      to: mobile
    })
    */

    return true
  } else {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const mobile = searchParams.get('mobile')

  try {
    switch (action) {
      case 'history':
        if (!mobile) {
          return NextResponse.json({ error: 'Mobile number required' }, { status: 400 })
        }
        
        const history = smsHistory.get(mobile)
        return NextResponse.json({
          success: true,
          mobile: mobile.slice(0, -4) + '****',
          messageCount: history?.messages.length || 0,
          lastSent: history?.lastSent || null,
          recentMessages: history?.messages.slice(-5).map(m => ({
            agentName: m.agentName,
            timestamp: m.timestamp,
            status: m.status
          })) || []
        })

      case 'stats':
        const totalNumbers = smsHistory.size
        const totalMessages = Array.from(smsHistory.values()).reduce((sum, h) => sum + h.messages.length, 0)
        const last24h = Array.from(smsHistory.values()).reduce((sum, h) => {
          const yesterday = new Date(Date.now() - 86400000)
          return sum + h.messages.filter(m => m.timestamp > yesterday).length
        }, 0)

        return NextResponse.json({
          success: true,
          stats: {
            totalNumbers,
            totalMessages,
            last24h,
            serviceStatus: 'operational'
          }
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('SMS GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get SMS data' },
      { status: 500 }
    )
  }
}