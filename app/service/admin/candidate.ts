import { Service } from 'egg';
import { ElectionError } from '../../lib/error';

export default class AdminCandidateService extends Service {
  /**
   * 添加候选人
   */
  public async add(name: string, electionId: number): Promise<any> {
    // 检查候选人是否已存在
    const existingCandidate = await this.ctx.app.repository.candidate.findByName(name, electionId);
    if (existingCandidate) {
      return { success: false, message: '候选人已存在' };
    }

    // 创建候选人
    const candidate = await this.ctx.app.repository.candidate.create(name, electionId);
    return candidate;
  }

  /**
   * 获取候选人列表
   */
  public async list(electionId: number): Promise<any> {
    const candidates = await this.ctx.app.repository.candidate.findAll(electionId);
    
    return candidates;
  }
  /**
 * 获取所有候选人的实时得票情况
 */
  public async getAllVoteStatus(electionId: number): Promise<any> {
    // 获取所有候选人的得票情况
    const candidates = await this.ctx.app.repository.candidate.findAll(electionId);
    const result = new Array();
    
    for (const candidate of candidates) {
      // 获取每个候选人的得票数
      const voteCount = await this.ctx.app.repository.vote_record.countVotesByCandidate(candidate.id);
    
      result.push({
        candidate: {
          id: candidate.id,
          name: candidate.name
        },
        voteCount,
      });
    }
    return result;
  }
  /**
   * 获取指定候选人的实时得票情况
   */
  public async getCandateVoteStatus(candidateId: number, electionId: number,  page: number = 1): Promise<any> {
    const pageSize = 10;
    // 获取特定候选人的得票情况
    const candidate = await this.ctx.app.repository.candidate.findById(candidateId);
    if (!candidate || candidate.electionId !== electionId) {
      throw new ElectionError(this.ctx, '候选人不存在或不属于该选举');
    }
    
    // 获取该候选人的得票数
    const voteCount = await this.ctx.app.repository.vote_record.countVotesByCandidate(candidateId);
    
    // 获取投给该候选人的用户列表（分页）
    const voters = await this.ctx.app.repository.vote_record.findVotesByCandidate(candidateId, page, pageSize);
    
    return {
      candidate: {
        id: candidate.id,
        name: candidate.name
      },
      voteCount,
      voters: voters,
      pagination: {
        currentPage: page,
        pageSize,
        total: voteCount,
        totalPages: Math.ceil(voteCount / pageSize)
      }
    };
  }

}