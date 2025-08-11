export interface AgentRequest {
  message: string;
  agentType: AgentType;
  context?: string;
  maxTokens?: number;
}

export interface AgentResponse {
  id: string;
  message: string;
  agentType: AgentType;
  tokensUsed: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export enum AgentType {
  FINANCIAL = 'financial',
  TECHNICAL = 'technical', 
  CREATIVE = 'creative',
  RESEARCH = 'research',
  GENERAL = 'general'
}

export interface AgentConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export interface AgentMetrics {
  totalRequests: number;
  totalTokensUsed: number;
  averageResponseTime: number;
  successRate: number;
}