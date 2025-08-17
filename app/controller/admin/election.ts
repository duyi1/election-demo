import { Controller } from 'egg';
import {ElectionError} from '../../lib/error';

export default class AdminElectionController extends Controller {
  // 创建选举活动
  public async create() {
    const { ctx } = this;
    try {
      const { name } = ctx.request.body;
      if (!name) {
        throw new ElectionError(ctx, '请输入选举名称');
      }
      const election = await ctx.service.admin.election.create();
      this.ctx.succResp(election);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }
  // 开始选举
  public async start() {
    const { ctx } = this;
    try {
      const { electionId } = ctx.request.body;
      if(!electionId) {
        throw new ElectionError(ctx, '选举ID错误');
      } 
      const res = await ctx.service.admin.election.start(electionId);
      if(!res) {
        throw new ElectionError(ctx, '选举开始失败');
      }
      this.ctx.succResp({});
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }

  // 结束选举
  public async end() {
    const { ctx } = this;
    try {
      const { electionId } = ctx.request.body;
      if(!electionId) {
        throw new ElectionError(ctx, '选举ID错误');
      } 
      const res = await ctx.service.admin.election.end(electionId);
      if(!res) {
        throw new ElectionError(ctx, '选举结束失败');
      }
      this.ctx.succResp({});
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }
  // 获取选举活动中所有候选人得票情况
  public async getAllVoteStatus() {
    const { ctx } = this;
    try {
      const { electionId } = ctx.query;
      if(!electionId) {
        throw new ElectionError(ctx, '请输入选举ID');
      }
      const results = await ctx.service.admin.candidate.getAllVoteStatus(electionId);
      this.ctx.succResp(results);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }

  // 查询选举结果
  public async getResults() {
    const { ctx } = this;
    try {
      const { page = 1, pageSize = 10, electionId } = ctx.query;
      if(!electionId) {
        throw new ElectionError(ctx, '请输入选举ID');
      }
      const results = await ctx.service.admin.election.getResults(electionId, page, pageSize);
      this.ctx.succResp(results);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }
}