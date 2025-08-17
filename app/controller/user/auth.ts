import { Controller } from 'egg';
import { ElectionError } from '../../lib/error';

export default class UserAuthController extends Controller {
  // 用户注册
  public async register() {
    const { ctx } = this;
    try {
      const { email, hkid } = ctx.request.body;
      if(!email || !hkid) {
        throw new ElectionError(ctx, '请输入邮箱和HKID');
      }
      const user = await ctx.service.user.auth.register(email, hkid);
      this.ctx.succResp(user);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }
}
