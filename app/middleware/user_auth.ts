import { Context } from 'egg';

export default function userAuthMiddleware(): any {
  return async (ctx: Context, next) => {
    // 前置JWT或其他插件进行身份校验，获取校验后用户身份
    const userId = ctx.headers['x-user-id'];
    if (!userId) {
      ctx.status = 401;
      ctx.body = { error: '用户身份信息错误' };
      return;
    }
    ctx.userId = userId;
    await next();
  };
}