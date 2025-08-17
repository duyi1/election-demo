import { Controller } from 'egg';
import { ElectionError } from '../../lib/error';

export default class UserVoteController extends Controller {
  // 用户投票
  public async castVote() {
    const { ctx } = this;
    try {
        const { userId, electionId, candidateId } = ctx.request.body;
        if(!userId || !electionId || !candidateId) {
          throw new ElectionError(ctx, '请输入用户ID、选举ID和候选人ID');
        }
        
        const result = await ctx.service.user.vote.castVote(userId, electionId, candidateId);
        ctx.succResp(result);
    } catch (error) {
        ctx.catchErrResp(error)
    }
  }
}