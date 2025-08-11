import { NextResponse } from 'next/server';
import { AgentService } from '@/services/agentService';

export async function GET() {
  try {
    const agentService = AgentService.getInstance();
    const metrics = agentService.getMetrics();

    return NextResponse.json({
      ...metrics,
      timestamp: new Date().toISOString(),
      status: 'healthy'
    });

  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}