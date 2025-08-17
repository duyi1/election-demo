import { Service } from 'egg';
import { ElectionError } from '../../lib/error';
import { ElectionStatus } from '../../lib/enum';

export default class UserVoteService extends Service {
  /**
   * 用户投票
   */
  public async castVote(userId: number, electionId: number, candidateId: number): Promise<any> {
    // 检查用户是否存在
    const user = await this.ctx.app.repository.user.findById(userId);
    if (!user) {
      throw new ElectionError(this.ctx, '用户不存在');
    }

    if (user.hasVoted) {
      throw new ElectionError(this.ctx, '用户已经投过票');
    }

    // 检查选举是否进行中
    const election = await this.ctx.app.repository.election.getElectionById(electionId);
    if (!election || election.status !== ElectionStatus.STARTED) {
      throw new ElectionError(this.ctx, '选举未开始或结束');
    }

    // 检查候选人是否存在
    const candidate = await this.ctx.app.repository.candidate.findById(candidateId);
    if (!candidate) {
      throw new ElectionError(this.ctx, '候选人不存在');
    }

    // 使用事务确保投票操作的原子性
    const conn = await this.app.mysql.beginTransaction();
    try {
      // 创建投票记录
      await this.ctx.app.repository.vote_record.create(userId, candidateId, electionId, conn);
      
      // 更新用户投票状态
      await this.ctx.app.repository.user.updateVoteStatus(userId, true, conn);
      
      // 更新候选人得票数
      await this.ctx.app.repository.candidate.updateVoteCount(candidateId, 1, conn);
      
      await conn.commit();
      
      return true;
    } catch (err) {
      await conn.rollback();
      this.ctx.logger.error('投票失败:', err);
      return false;
    }
  }
}