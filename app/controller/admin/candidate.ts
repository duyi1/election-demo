import { Controller } from 'egg';
import { ElectionError } from '../../lib/error';

export default class AdminCandidateController extends Controller {
  // 添加候选人
  public async add() {
    const { ctx } = this;
    try {
      const { name, electionId } = ctx.request.body;
      if(!name || !electionId) {
          throw new ElectionError(ctx, '候选人姓名错误或选举活动id错误');
      }    
      const  candidate = await ctx.service.admin.candidate.add(name, electionId);
      this.ctx.succResp(candidate);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }

  // 获取候选人列表
  public async list() {
    const { ctx } = this;
    try {
      const { electionId } = ctx.query;
      const candidates = await ctx.service.admin.candidate.list(electionId);
      this.ctx.succResp({
        list: candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          voteCount: candidate.voteCount,
        })),
      });
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }

  // 获取候选人得票详情
  public async getVoteDetail() {
    const { ctx } = this;
    try {
      const { candidateId, electionId, page} = ctx.query;
      if (!candidateId || !electionId) {
        throw new ElectionError(ctx, 'Invalid params');
      }
      const detail = await ctx.service.admin.candidate.getCandateVoteStatus(candidateId, electionId, page);
      this.ctx.succResp(detail);
    }catch (error) {
      this.ctx.catchErrResp(error);
    }
  }
}
