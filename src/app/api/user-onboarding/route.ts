import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// User profiles storage (in production, use a database)
const userProfiles = new Map<number, {
  name: string
  experience: string
  riskTolerance: string
  goals: string[]
  preferredAssets: string[]
  notifications: string[]
  personality: string
  onboardingComplete: boolean
  lastAnalysis?: any
}>()

const onboardingQuestions = [
  {
    id: 1,
    question: "Hi! I'm ZYRA, your personal DeFi AI assistant. What's your name?",
    type: "text",
    key: "name"
  },
  {
    id: 2, 
    question: "Nice to meet you, {name}! What's your experience level with DeFi?",
    type: "options",
    key: "experience",
    options: ["🌱 Complete Beginner", "📊 Some Experience", "🚀 Advanced Trader", "🧠 DeFi Expert"]
  },
  {
    id: 3,
    question: "How would you describe your risk tolerance?",
    type: "options", 
    key: "riskTolerance",
    options: ["🛡️ Conservative (Safety first)", "⚖️ Moderate (Balanced approach)", "🎯 Aggressive (Higher risk, higher reward)", "🚀 YOLO (Maximum risk for maximum gains)"]
  },
  {
    id: 4,
    question: "What are your main DeFi goals? (Select all that apply)",
    type: "multiple",
    key: "goals",
    options: ["💰 Passive Income", "📈 Portfolio Growth", "🔄 Active Trading", "🏦 Lending/Borrowing", "🎮 Experimenting with new protocols", "🛡️ Capital Preservation"]
  },
  {
    id: 5,
    question: "Which assets do you prefer to work with?",
    type: "multiple",
    key: "preferredAssets", 
    options: ["₿ Bitcoin (BTC)", "⟠ Ethereum (ETH)", "💵 Stablecoins (USDC, USDT)", "🏦 Blue-chip DeFi (AAVE, UNI)", "🔮 Altcoins", "🆕 New/experimental tokens"]
  },
  {
    id: 6,
    question: "How often would you like me to notify you?",
    type: "multiple",
    key: "notifications",
    options: ["🚨 Critical alerts only", "📊 Daily portfolio summary", "💎 New opportunities", "⚠️ Risk warnings", "🎯 Trade recommendations", "📈 Market analysis"]
  }
]

export async function POST(request: NextRequest) {
  try {
    const { chatId, questionId, answer, currentData } = await request.json()

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID required' }, { status: 400 })
    }

    // Get or create user profile
    let profile = userProfiles.get(chatId) || {
      name: '',
      experience: '',
      riskTolerance: '',
      goals: [],
      preferredAssets: [],
      notifications: [],
      personality: '',
      onboardingComplete: false
    }

    // Update profile with answer
    const question = onboardingQuestions.find(q => q.id === questionId)
    if (question) {
      if (question.type === 'multiple') {
        profile[question.key as keyof typeof profile] = answer as any
      } else {
        profile[question.key as keyof typeof profile] = answer as any
      }
    }

    // Check if onboarding is complete
    if (questionId === onboardingQuestions.length) {
      profile.onboardingComplete = true
      
      // Generate AI personality analysis
      const personalityPrompt = `Based on this user profile, create a brief personality analysis and personalized DeFi strategy:
      
      Name: ${profile.name}
      Experience: ${profile.experience}
      Risk Tolerance: ${profile.riskTolerance}
      Goals: ${profile.goals.join(', ')}
      Preferred Assets: ${profile.preferredAssets.join(', ')}
      
      Respond in a friendly, personal tone as ZYRA, their AI assistant. Keep it concise (2-3 sentences).`

      try {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: personalityPrompt }],
          max_tokens: 150,
          temperature: 0.7,
        })

        profile.personality = aiResponse.choices[0]?.message?.content || "I'm excited to help you on your DeFi journey!"
      } catch (error) {
        console.error('OpenAI API error:', error)
        profile.personality = `Perfect! Based on your ${profile.experience.toLowerCase()} experience and ${profile.riskTolerance.toLowerCase()} risk tolerance, I'll tailor my recommendations specifically for you, ${profile.name}!`
      }
    }

    userProfiles.set(chatId, profile)

    // Get next question or completion message
    const nextQuestion = onboardingQuestions[questionId] 
    let responseMessage = ''
    let isComplete = false

    if (nextQuestion) {
      responseMessage = nextQuestion.question.replace('{name}', profile.name)
      if (nextQuestion.options) {
        responseMessage += '\n\n' + nextQuestion.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')
      }
    } else {
      isComplete = true
      responseMessage = `🎉 Perfect! Welcome to ZYRA, ${profile.name}!\n\n${profile.personality}\n\n✅ Your AI agents are now configured with your preferences\n🎯 You'll receive personalized ${profile.notifications.join(' and ')} \n🚀 Ready to start your optimized DeFi journey!`
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      nextQuestionId: nextQuestion?.id,
      questionType: nextQuestion?.type,
      isComplete,
      profile: profile
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to process onboarding' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const chatId = parseInt(searchParams.get('chatId') || '0')
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'start':
        // Start onboarding
        return NextResponse.json({
          success: true,
          message: onboardingQuestions[0].question,
          questionId: onboardingQuestions[0].id,
          questionType: onboardingQuestions[0].type
        })

      case 'profile':
        // Get user profile
        const profile = userProfiles.get(chatId)
        if (!profile) {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, profile })

      case 'reset':
        // Reset onboarding
        userProfiles.delete(chatId)
        return NextResponse.json({ success: true, message: 'Profile reset' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Onboarding GET error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Export user profiles for other services to use
export function getUserProfile(chatId: number) {
  return userProfiles.get(chatId)
}

export function updateUserProfile(chatId: number, updates: Partial<typeof userProfiles extends Map<number, infer T> ? T : never>) {
  const profile = userProfiles.get(chatId)
  if (profile) {
    Object.assign(profile, updates)
    userProfiles.set(chatId, profile)
  }
  return profile
}