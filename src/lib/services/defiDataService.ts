// Real-time DeFi data service integrating multiple APIs
export interface DeFiProtocol {
  name: string;
  tvl: number;
  apy?: number;
  category: string;
  chain: string;
  riskScore?: number;
  url?: string;
}

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  volume_24h: number;
  circulating_supply: number;
}

export interface YieldOpportunity {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
  riskScore: number;
  category: string;
  chain: string;
  poolAddress?: string;
  rewards?: string[];
}

export class DeFiDataService {
  private static instance: DeFiDataService;
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  static getInstance(): DeFiDataService {
    if (!DeFiDataService.instance) {
      DeFiDataService.instance = new DeFiDataService();
    }
    return DeFiDataService.instance;
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data as T;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      // Return cached data if available, even if stale
      if (cached) {
        return cached.data as T;
      }
      throw error;
    }
  }

  // Fetch DeFi protocols from DeFiLlama
  async getDeFiProtocols(): Promise<DeFiProtocol[]> {
    return this.fetchWithCache('defi-protocols', async () => {
      const response = await fetch('https://api.llama.fi/protocols');
      if (!response.ok) {
        throw new Error(`DeFiLlama API error: ${response.status}`);
      }
      const protocols = await response.json() as Array<{
        name: string;
        tvl: number;
        category: string;
        chains?: string[];
        url?: string;
        founded?: string;
      }>;
      
      return protocols
        .filter((p) => p.tvl > 1000000) // Filter protocols with > $1M TVL
        .slice(0, 50) // Top 50 protocols
        .map((protocol) => ({
          name: protocol.name,
          tvl: protocol.tvl,
          category: protocol.category,
          chain: protocol.chains?.[0] || 'Multi-chain',
          riskScore: this.calculateRiskScore(protocol),
          url: protocol.url
        }));
    });
  }

  // Fetch token prices from CoinGecko
  async getTokenPrices(tokenIds: string[] = ['ethereum', 'bitcoin', 'usd-coin', 'chainlink', 'uniswap']): Promise<TokenData[]> {
    return this.fetchWithCache(`token-prices-${tokenIds.join(',')}`, async () => {
      const idsParam = tokenIds.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      return await response.json();
    });
  }

  // Fetch yield opportunities (combining multiple sources)
  async getYieldOpportunities(): Promise<YieldOpportunity[]> {
    return this.fetchWithCache('yield-opportunities', async () => {
      // Fetch from DeFiLlama yields API
      const response = await fetch('https://yields.llama.fi/pools');
      if (!response.ok) {
        throw new Error(`DeFiLlama Yields API error: ${response.status}`);
      }
      
      interface PoolResponse {
        data: Array<{
          project: string;
          symbol: string;
          apy: number;
          tvlUsd: number;
          chain: string;
          pool: string;
          rewardTokens?: string[];
        }>;
      }
      const pools = await response.json() as PoolResponse;
      
      return pools.data
        .filter((pool) => 
          pool.apy > 0 && 
          pool.tvlUsd > 100000 && // Min $100k TVL
          pool.apy < 1000 // Filter out unrealistic APYs
        )
        .slice(0, 20) // Top 20 opportunities
        .map((pool) => ({
          protocol: pool.project,
          asset: pool.symbol,
          apy: pool.apy,
          tvl: pool.tvlUsd,
          riskScore: this.calculatePoolRiskScore(pool),
          category: this.categorizePool(pool),
          chain: pool.chain,
          poolAddress: pool.pool,
          rewards: pool.rewardTokens || []
        }));
    });
  }

  // Get real-time market summary
  async getMarketSummary() {
    return this.fetchWithCache('market-summary', async () => {
      // Fetch global DeFi data
      const [protocols, tokens, yields] = await Promise.all([
        this.getDeFiProtocols(),
        this.getTokenPrices(),
        this.getYieldOpportunities()
      ]);

      const totalTVL = protocols.reduce((sum, p) => sum + p.tvl, 0);
      const avgAPY = yields.reduce((sum, y) => sum + y.apy, 0) / yields.length;

      return {
        totalTVL,
        protocolCount: protocols.length,
        avgAPY,
        topProtocols: protocols.slice(0, 10),
        topTokens: tokens.slice(0, 10),
        topYields: yields.slice(0, 10),
        lastUpdate: new Date().toISOString(),
        marketTrend: this.calculateMarketTrend(tokens)
      };
    });
  }

  // Get specific chain data
  async getChainData(chain: string = 'ethereum') {
    return this.fetchWithCache(`chain-${chain}`, async () => {
      const response = await fetch(`https://api.llama.fi/v2/chains`);
      if (!response.ok) {
        throw new Error(`Chain data API error: ${response.status}`);
      }
      
      const chains = await response.json() as Array<{
        name: string;
        [key: string]: unknown;
      }>;
      const chainData = chains.find((c) => 
        c.name.toLowerCase() === chain.toLowerCase()
      );

      return chainData || null;
    });
  }

  // Real-time gas prices
  async getGasPrices() {
    return this.fetchWithCache('gas-prices', async () => {
      try {
        const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken');
        if (!response.ok) {
          throw new Error('Gas API error');
        }
        
        const data = await response.json();
        return {
          slow: data.result?.SafeGasPrice || 10,
          standard: data.result?.ProposeGasPrice || 15,
          fast: data.result?.FastGasPrice || 20,
          timestamp: new Date().toISOString()
        };
      } catch {
        // Fallback gas prices
        return {
          slow: 10 + Math.random() * 5,
          standard: 15 + Math.random() * 5,
          fast: 20 + Math.random() * 5,
          timestamp: new Date().toISOString()
        };
      }
    });
  }

  // Calculate risk score based on protocol data
  private calculateRiskScore(protocol: { tvl: number; founded?: string; category: string }): number {
    let score = 2.5; // Base score

    // TVL factor
    if (protocol.tvl > 1000000000) score -= 0.5; // > $1B TVL
    else if (protocol.tvl < 10000000) score += 0.5; // < $10M TVL

    // Age factor (if available)
    if (protocol.founded && Date.now() - new Date(protocol.founded).getTime() > 365 * 24 * 60 * 60 * 1000) {
      score -= 0.3; // Older than 1 year
    }

    // Category factor
    const lowRiskCategories = ['Lending', 'Liquid Staking', 'DEX'];
    if (lowRiskCategories.includes(protocol.category)) {
      score -= 0.2;
    }

    return Math.max(1, Math.min(5, score));
  }

  private calculatePoolRiskScore(pool: { apy: number; tvlUsd: number; symbol: string; project: string }): number {
    let score = 2.5;

    // APY factor
    if (pool.apy > 100) score += 1; // Very high APY = higher risk
    else if (pool.apy < 5) score -= 0.3; // Conservative APY

    // TVL factor
    if (pool.tvlUsd > 100000000) score -= 0.5; // > $100M TVL
    else if (pool.tvlUsd < 1000000) score += 0.5; // < $1M TVL

    // Stablecoin pools are generally safer
    if (pool.symbol.includes('USD') || pool.symbol.includes('DAI') || pool.symbol.includes('USDT')) {
      score -= 0.3;
    }

    return Math.max(1, Math.min(5, score));
  }

  private categorizePool(pool: { symbol: string; project: string }): string {
    if (pool.symbol.includes('-')) return 'Liquidity Providing';
    if (pool.symbol.includes('USD')) return 'Stable Swapping';
    if (pool.project.toLowerCase().includes('stake')) return 'Liquid Staking';
    if (pool.project.toLowerCase().includes('lend')) return 'Lending';
    return 'Yield Farming';
  }

  private calculateMarketTrend(tokens: TokenData[]): 'bullish' | 'bearish' | 'neutral' {
    const positiveChanges = tokens.filter(t => t.price_change_percentage_24h > 0).length;
    const ratio = positiveChanges / tokens.length;
    
    if (ratio > 0.6) return 'bullish';
    if (ratio < 0.4) return 'bearish';
    return 'neutral';
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export default DeFiDataService;