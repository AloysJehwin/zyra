import { openai, DEFAULT_CONFIG } from '../lib/openai';
import { AgentRequest, AgentResponse, AgentType, AgentConfig } from '../types/agent';

const AGENT_PROMPTS: Record<AgentType, string> = {
  [AgentType.FINANCIAL]: "You are a financial advisor AI. Provide clear, concise financial advice and insights. Keep responses under 200 words.",
  [AgentType.TECHNICAL]: "You are a technical expert AI. Provide clear technical explanations and solutions. Keep responses under 200 words.",
  [AgentType.CREATIVE]: "You are a creative assistant AI. Help with creative tasks and brainstorming. Keep responses under 200 words.",
  [AgentType.RESEARCH]: "You are a research assistant AI. Provide well-researched, factual information. Keep responses under 200 words.",
  [AgentType.GENERAL]: "You are a helpful assistant AI. Provide clear, helpful responses. Keep responses under 200 words."
};

export class AgentService {
  private static instance: AgentService;
  private requestCount = 0;
  private totalTokens = 0;

  private constructor() {}

  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const config: AgentConfig = {
        model: DEFAULT_CONFIG.model,
        maxTokens: Math.min(request.maxTokens || DEFAULT_CONFIG.maxTokens, 500), // Hard limit of 500 tokens
        temperature: DEFAULT_CONFIG.temperature,
        systemPrompt: AGENT_PROMPTS[request.agentType]
      };

      const completion = await openai.chat.completions.create({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        messages: [
          {
            role: 'system',
            content: config.systemPrompt
          },
          {
            role: 'user',
            content: request.context ? `Context: ${request.context}\n\nQuestion: ${request.message}` : request.message
          }
        ],
      });

      const tokensUsed = completion.usage?.total_tokens || 0;
      this.requestCount++;
      this.totalTokens += tokensUsed;

      return {
        id: requestId,
        message: completion.choices[0]?.message?.content || 'No response generated',
        agentType: request.agentType,
        tokensUsed,
        timestamp: new Date(),
        success: true
      };

    } catch (error) {
      console.error('Agent service error:', error);
      
      return {
        id: requestId,
        message: 'Sorry, I encountered an error processing your request.',
        agentType: request.agentType,
        tokensUsed: 0,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getMetrics() {
    return {
      totalRequests: this.requestCount,
      totalTokensUsed: this.totalTokens,
      averageTokensPerRequest: this.requestCount > 0 ? this.totalTokens / this.requestCount : 0
    };
  }

  async processMultipleRequests(requests: AgentRequest[]): Promise<AgentResponse[]> {
    // Process requests in parallel but limit to 3 concurrent requests to avoid rate limits
    const batchSize = 3;
    const results: AgentResponse[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(request => this.processRequest(request))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
}