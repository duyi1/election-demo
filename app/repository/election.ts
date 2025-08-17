import { Context } from 'egg';
import Base from './base';
import { Election, ElectionImpl } from '../model/election';
import { ElectionStatus } from '../lib/enum';

export default class ElectionRepository extends Base {
  constructor(ctx: Context) {
    super(ctx);
  }
  /**
   * 创建选举
   */
  async create(status: ElectionStatus = ElectionStatus.PREPARE): Promise<Election> {
    const result : any = await this.DB.insert('elections', {
      status
    });
    return new ElectionImpl({
      id: result.insertId,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  async getElectionById(electionId: number): Promise<Election | null> {
    const election: any = await this.DB.query(
      'SELECT * FROM elections where election_id = ?', [electionId]
    );
    
    if (election.length === 0) return null;
    
    const e = election[0];
    return new ElectionImpl({
      id: e.id,
      status: e.status,
      startTime: e.start_time,
      endTime: e.end_time,
      createdAt: e.created_at,
      updatedAt: e.updated_at
    });
  }

  /**
   * 根据状态查找选举
   */
  async findByStatus(status: ElectionStatus): Promise<Election | null> {
    const election = await this.DB.query(
      'SELECT * FROM elections WHERE status = ? ORDER BY created_at DESC LIMIT 1',
      [status]
    );
    
    if (election.length === 0) return null;
    
    const e = election[0];
    return new ElectionImpl({
      id: e.id,
      status: e.status,
      startTime: e.start_time,
      endTime: e.end_time,
      createdAt: e.created_at,
      updatedAt: e.updated_at
    });
  }

  /**
   * 更新选举状态
   */
  async updateStatus(
    electionId: number, 
    status: ElectionStatus, 
    additionalFields: any = {}
  ): Promise<boolean> {
    const updateData: any = { status };
    
    if (status === ElectionStatus.PREPARE && !additionalFields.startTime) {
      updateData.start_time = new Date();
    }
    
    if (status === ElectionStatus.ENDED && !additionalFields.endTime) {
      updateData.end_time = new Date();
    }
    
    if (additionalFields.startTime) {
      updateData.start_time = additionalFields.startTime;
    }
    
    if (additionalFields.endTime) {
      updateData.end_time = additionalFields.endTime;
    }
    
    updateData.updated_at = new Date();
    // disable eslint rule for updateData
    const result = await this.DB.update('elections', updateData, {
      where: { id: electionId }
    });
    
    return result.affectedRows === 1;
  }

  /**
   * 开始选举
   */
  async startElection(electionId: number): Promise<boolean> {
    return await this.updateStatus(electionId, ElectionStatus.STARTED, { startTime: new Date() });
  }

  /**
   * 结束选举
   */
  async endElection(electionId: number): Promise<boolean> {
    return await this.updateStatus(electionId, ElectionStatus.ENDED, { endTime: new Date() });
  }
}