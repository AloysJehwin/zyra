'use client';

import { useState, useCallback } from 'react';
import { AgentResponse, AgentType } from '@/types/agent';
import { agentClient } from '@/lib/agentClient';

export function useAgent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(async (
    message: string,
    agentType: AgentType = AgentType.GENERAL,
    options?: {
      context?: string;
      maxTokens?: number;
    }
  ): Promise<AgentResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await agentClient.chat(message, agentType, options);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const batchChat = useCallback(async (
    requests: Array<{
      message: string;
      agentType?: AgentType;
      context?: string;
      maxTokens?: number;
    }>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await agentClient.batchChat(requests);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMetrics = useCallback(async () => {
    try {
      return await agentClient.getMetrics();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get metrics';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Convenience methods
  const financialAdvice = useCallback((question: string, context?: string) => 
    chat(question, AgentType.FINANCIAL, { context }), [chat]);

  const technicalHelp = useCallback((question: string, context?: string) => 
    chat(question, AgentType.TECHNICAL, { context }), [chat]);

  const creativeAssistance = useCallback((prompt: string, context?: string) => 
    chat(prompt, AgentType.CREATIVE, { context }), [chat]);

  const research = useCallback((query: string, context?: string) => 
    chat(query, AgentType.RESEARCH, { context }), [chat]);

  return {
    loading,
    error,
    chat,
    batchChat,
    getMetrics,
    financialAdvice,
    technicalHelp,
    creativeAssistance,
    research
  };
}