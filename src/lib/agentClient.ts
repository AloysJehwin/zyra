import { AgentRequest, AgentResponse, AgentType } from '@/types/agent';

export class AgentClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async chat(
    message: string, 
    agentType: AgentType = AgentType.GENERAL,
    options?: {
      context?: string;
      maxTokens?: number;
    }
  ): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/agents/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        agentType,
        context: options?.context,
        maxTokens: options?.maxTokens
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get agent response');
    }

    return response.json();
  }

  async batchChat(requests: Array<{
    message: string;
    agentType?: AgentType;
    context?: string;
    maxTokens?: number;
  }>): Promise<{
    responses: AgentResponse[];
    totalRequests: number;
    successfulRequests: number;
    totalTokensUsed: number;
  }> {
    const response = await fetch(`${this.baseUrl}/api/agents/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process batch requests');
    }

    return response.json();
  }

  async getMetrics(): Promise<{
    totalRequests: number;
    totalTokensUsed: number;
    averageTokensPerRequest: number;
    timestamp: string;
    status: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/agents/metrics`);

    if (!response.ok) {
      throw new Error('Failed to get metrics');
    }

    return response.json();
  }

  // Convenience methods for specific agent types
  async financialAdvice(question: string, context?: string): Promise<AgentResponse> {
    return this.chat(question, AgentType.FINANCIAL, { context });
  }

  async technicalHelp(question: string, context?: string): Promise<AgentResponse> {
    return this.chat(question, AgentType.TECHNICAL, { context });
  }

  async creativeAssistance(prompt: string, context?: string): Promise<AgentResponse> {
    return this.chat(prompt, AgentType.CREATIVE, { context });
  }

  async research(query: string, context?: string): Promise<AgentResponse> {
    return this.chat(query, AgentType.RESEARCH, { context });
  }
}

// Create a default instance
export const agentClient = new AgentClient();