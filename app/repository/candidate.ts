import Base from '../repository/base';
import { Context } from 'egg';
import { Candidate, CandidateImpl } from '../model/candidate';

export default class CandidateRepository extends Base {
  constructor(ctx: Context) {
    super(ctx);
  }
  /**
   * 创建候选人
   */
  async create(name: string, electionId: number): Promise<Candidate> {
    const result: any = await this.DB.insert('candidates', {
      name,
      election_id: electionId,
      vote_count: 0
    });
    
    return new CandidateImpl({
      id: result.insertId,
      name,
      electionId: electionId,
      voteCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * 根据ID查找候选人
   */
  async findById(id: number): Promise<Candidate | null> {
    const candidate: any = await this.DB.get('candidates', { id });
    if (!candidate) return null;
    
    return new CandidateImpl({
      id: candidate.id,
      name: candidate.name,
      electionId: candidate.election_id,
      voteCount: candidate.vote_count,
      createdAt: candidate.created_at,
      updatedAt: candidate.updated_at
    });
  }

    /**
   * 根据ID查找候选人
   */
  async findByName(name: string, electionId: number): Promise<Candidate | null> {
    const candidate: any = await this.DB.get('candidates', { name, election_id: electionId });
    if (!candidate) return null;
    
    return new CandidateImpl({
      id: candidate.id,
      name: candidate.name,
      electionId: candidate.election_id,
      voteCount: candidate.vote_count,
      createdAt: candidate.created_at,
      updatedAt: candidate.updated_at
    });
  }

  /**
   * 获取所有候选人
   */
  async findAll(electionId: number): Promise<Candidate[]> {
    const candidates: any = await this.DB.select('candidates', {
      where: { election_id: electionId },
      orders: [['id', 'asc']]
    });
    
    return candidates.map(c => new CandidateImpl({
      id: c.id,
      name: c.name,
      electionId: c.election_id,
      voteCount: c.vote_count,
      createdAt: c.created_at,
      updatedAt: c.updated_at
    }));
  }


  /**
   * 更新候选人得票数
   */
  async updateVoteCount(candidateId: number, increment: number, conn: any = this.DB): Promise<any> {
    await conn.query(
      'UPDATE candidates SET vote_count = vote_count + ?, updated_at = ? WHERE id = ?',
      [increment, new Date(), candidateId]
    );
  }

  /**
   * 获取候选人列表并按得票数排序
   */
  async findAllSortedByVotes(electionId: number): Promise<Candidate[]> {
    const candidates: any = await this.DB.select('candidates', {
      where: { election_id: electionId },
      orders: [['vote_count', 'desc']]
    });
    
    return candidates.map(c => new CandidateImpl({
      id: c.id,
      name: c.name,
      electionId: c.election_id,
      voteCount: c.vote_count,
      createdAt: c.created_at,
      updatedAt: c.updated_at
    }));
  }

  /**
   * 统计候选人数量
   */
  async count(electionId: number): Promise<number> {
    const result = await this.DB.query('SELECT COUNT(*) as count FROM candidates where election_id = ?', [electionId]);
    return result[0].count;
  }
}