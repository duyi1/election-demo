import { Service } from 'egg';
import { ElectionStatus } from '../../lib/enum';
import { ElectionError } from '../../lib/error';

export default class AdminElectionService extends Service {
  public async create(): Promise<any> {
    const { ctx } = this;
    const election = await ctx.app.repository.election.create();
    return election;
  }
  /**
   * 开始选举
   */
  public async start(electionId: number): Promise<any> {
    // 检查是否有至少2个候选人
    const candidateCount = await this.ctx.app.repository.candidate.count(electionId);
    if (candidateCount < 2) {
      throw new ElectionError(this.ctx, '至少需要2个候选人');
    }

    const election = await this.ctx.app.repository.election.getElectionById(electionId);
    if (!election || election.status !== ElectionStatus.PREPARE) {
      throw new ElectionError(this.ctx, '选举已开始或结束');
    }
    // 更新现有选举状态
    const updated = await this.ctx.app.repository.election.startElection(electionId);

    if (!updated) {
      throw new ElectionError(this.ctx, '选举开始失败');
    }
    return true;
  }

  /**
   * 结束选举
   */
  public async end(electionId: number): Promise<boolean> {
    const election = await this.ctx.app.repository.election.getElectionById(electionId);
    if (!election || election.status !== ElectionStatus.STARTED) {
     throw new ElectionError(this.ctx, '选举未开始或已结束');
    }

    const updated = await this.ctx.app.repository.election.endElection(electionId);
    if (!updated) {
      throw new ElectionError(this.ctx, '选举结束失败');
    }
    return true;
  }

  /**
   * 获取选举结果
   */
  public async getResults(electionId: number, page: number = 1, pageSize: number = 10): Promise<any> {

   const election = await this.ctx.app.repository.election.getElectionById(electionId);
    if (!election || election.status !== ElectionStatus.ENDED) {
      throw new ElectionError(this.ctx, '选举尚未结束');
    }

    const candidates = await this.ctx.app.repository.candidate.findAllSortedByVotes(electionId);
    const results = new Array();

    for (const candidate of candidates) {
      const totalVotes = await this.ctx.app.repository.vote_record.countVotesByCandidate(candidate.id);
      const votes = await this.ctx.app.repository.vote_record.findVotesByCandidate(
        candidate.id, 
        page, 
        pageSize
      );

      results.push({
        candidate: {
          id: candidate.id,
          name: candidate.name
        },
        totalVotes,
        voters: votes.map(v => ({
          id: v.userId,
          timestamp: v.updatedAt
        })),
        currentPage: page,
        totalPages: Math.ceil(totalVotes / pageSize)
      });
    }
    return results
  }
}