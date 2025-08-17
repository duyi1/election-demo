import { Context } from 'egg';
import Base from './base';
import { VoteRecord, VoteRecordImpl } from '../model/vote_record';

export default class VoteRecordRepository extends Base {
  constructor(ctx: Context) {
    super(ctx);
  }
  /**
   * 创建投票记录
   */
  async create(userId: number, candidateId: number, electionId: number, conn: any = this.DB): Promise<VoteRecord> {
    const result = await conn.insert('vote_records', {
      user_id: userId,
      candidate_id: candidateId,
      election_id: electionId,
    });
    
    return new VoteRecordImpl({
      id: result.insertId,
      userId,
      candidateId,
      electionId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * 检查用户是否已投票
   */
  async hasUserVoted(userId: number): Promise<boolean> {
    const result = await this.DB.get('vote_records', { user_id: userId });
    return !!result;
  }

  /**
   * 根据候选人ID统计得票数
   */
  async countVotesByCandidate(candidateId: number): Promise<number> {
    const result = await this.DB.query(
      'SELECT COUNT(*) as count FROM vote_records WHERE candidate_id = ?',
      [candidateId]
    );
    return result[0].count;
  }

  /**
   * 获取投给特定候选人的投票记录（分页）
   */
  async findVotesByCandidate(
    candidateId: number, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<VoteRecord[]> {
    const offset = (page - 1) * pageSize;
    const records = await this.DB.query(
      `SELECT vr.*, u.email, u.hkid 
       FROM vote_records vr 
       JOIN users u ON vr.user_id = u.id 
       WHERE vr.candidate_id = ? 
       ORDER BY updated_at DESC 
       LIMIT ? OFFSET ?`,
      [candidateId, pageSize, offset]
    );
    
    return records.map(r => new VoteRecordImpl({
      id: r.id,
      userId: r.user_id,
      candidateId: r.candidate_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  }

  /**
   * 获取选举统计信息
   */
  async getElectionStats(): Promise<Array<{ candidateId: number; voteCount: number }>> {
    const results = await this.DB.query(
      `SELECT candidate_id, COUNT(*) as vote_count 
       FROM vote_records 
       GROUP BY candidate_id`
    );
    
    return results.map(r => ({
      candidateId: r.candidate_id,
      voteCount: r.vote_count
    }));
  }
}