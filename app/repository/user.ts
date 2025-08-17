import { Context } from 'egg';
import Base from './base';
import { User, UserImpl } from '../model/user';

export default class UserRepository extends Base {
  constructor(ctx: Context) {
    super(ctx);
  }
  /**
   * 创建用户
   */
  async create(email: string, hkid: string): Promise<User> {
    const result: any = await this.DB.insert('users', {
      email,
      hkid,
      has_voted: false
    });
    
    return new UserImpl({
      id: result.insertId,
      email,
      hkid,
      hasVoted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * 根据ID查找用户
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.DB.get('users', { id });
    if (!user) return null;
    
    return new UserImpl({
      id: user.id,
      email: user.email,
      hkid: user.hkid,
      hasVoted: user.has_voted === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.DB.get('users', { email });
    if (!user) return null;
    
    return new UserImpl({
      id: user.id,
      email: user.email,
      hkid: user.hkid,
      hasVoted: user.has_voted === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  }

  /**
   * 根据HKID查找用户
   */
  async findByHKID(hkid: string): Promise<User | null> {
    const user = await this.DB.get('users', { hkid });
    if (!user) return null;
    
    return new UserImpl({
      id: user.id,
      email: user.email,
      hkid: user.hkid,
      hasVoted: user.has_voted === 1,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  }

  /**
   * 更新用户投票状态
   */
  async updateVoteStatus(userId: number, hasVoted: boolean, conn: any = this.DB): Promise<boolean> {
    const result = await conn.update('users', {
      has_voted: hasVoted,
      updated_at: new Date()
    }, {
      where: { id: userId }
    });
    
    return result.affectedRows === 1;
  }

  /**
   * 统计用户总数
   */
  async count(): Promise<number> {
    const result = await this.DB.query('SELECT COUNT(*) as count FROM users');
    return result[0].count;
  }
}