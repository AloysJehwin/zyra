import { NextRequest, NextResponse } from 'next/server';
import { AgentService } from '@/services/agentService';
import { AgentRequest, AgentType } from '@/types/agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requests } = body;

    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: 'Requests must be a non-empty array' },
        { status: 400 }
      );
    }

    if (requests.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 requests allowed per batch' },
        { status: 400 }
      );
    }

    // Validate each request
    const validatedRequests: AgentRequest[] = requests.map((req: any, index: number) => {
      if (!req.message || typeof req.message !== 'string') {
        throw new Error(`Request ${index}: Message is required and must be a string`);
      }

      const agentType = req.agentType || AgentType.GENERAL;
      if (!Object.values(AgentType).includes(agentType)) {
        throw new Error(`Request ${index}: Invalid agent type`);
      }

      return {
        message: req.message,
        agentType,
        context: req.context,
        maxTokens: Math.min(req.maxTokens || 300, 500)
      };
    });

    const agentService = AgentService.getInstance();
    const responses = await agentService.processMultipleRequests(validatedRequests);

    return NextResponse.json({
      responses,
      totalRequests: responses.length,
      successfulRequests: responses.filter(r => r.success).length,
      totalTokensUsed: responses.reduce((sum, r) => sum + r.tokensUsed, 0)
    });

  } catch (error) {
    console.error('Batch API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}