import { NextRequest, NextResponse } from 'next/server';
import { AgentService } from '@/services/agentService';
import { AgentRequest, AgentType } from '@/types/agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, agentType = AgentType.GENERAL, context, maxTokens } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!Object.values(AgentType).includes(agentType)) {
      return NextResponse.json(
        { error: 'Invalid agent type' },
        { status: 400 }
      );
    }

    const agentRequest: AgentRequest = {
      message,
      agentType,
      context,
      maxTokens: Math.min(maxTokens || 300, 500) // Enforce token limit
    };

    const agentService = AgentService.getInstance();
    const response = await agentService.processRequest(agentRequest);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Agent Chat API is running',
    availableAgents: Object.values(AgentType),
    maxTokensPerRequest: 500
  });
}