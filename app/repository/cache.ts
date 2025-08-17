import { Service } from 'egg';

export default class CacheRepository extends Service {
  /**
   * 获取候选人实时得票数
   */
  async getCandidateVoteCount(candidateId: number): Promise<number> {
    const key = `candidate:vote_count:${candidateId}`;
    const count = await this.app.redis.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * 增加候选人得票数
   */
  async incrementCandidateVoteCount(candidateId: number): Promise<number> {
    const key = `candidate:vote_count:${candidateId}`;
    const count = await this.app.redis.incr(key);
    
    // 设置过期时间（例如1小时）
    await this.app.redis.expire(key, 3600);
    
    return count;
  }

  /**
   * 设置候选人得票数
   */
  async setCandidateVoteCount(candidateId: number, count: number): Promise<void> {
    const key = `candidate:vote_count:${candidateId}`;
    await this.app.redis.set(key, count.toString());
    await this.app.redis.expire(key, 3600);
  }

  /**
   * 获取选举状态
   */
  async getElectionStatus(): Promise<string | null> {
    return await this.app.redis.get('election:status');
  }

  /**
   * 设置选举状态
   */
  async setElectionStatus(status: string): Promise<void> {
    await this.app.redis.set('election:status', status);
    await this.app.redis.expire('election:status', 3600);
  }

  /**
   * 缓存选举结果
   */
  async cacheElectionResults(results: any, expireSeconds: number = 300): Promise<void> {
    await this.app.redis.setex(
      'election:results',
      expireSeconds,
      JSON.stringify(results)
    );
  }

  /**
   * 获取缓存的选举结果
   */
  async getElectionResults(): Promise<any> {
    const cached = await this.app.redis.get('election:results');
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * 清除选举相关缓存
   */
  async clearElectionCache(): Promise<void> {
    const keys = await this.app.redis.keys('election:*');
    if (keys.length > 0) {
      await this.app.redis.del(...keys);
    }
    
    const candidateKeys = await this.app.redis.keys('candidate:vote_count:*');
    if (candidateKeys.length > 0) {
      await this.app.redis.del(...candidateKeys);
    }
  }
}