import { Context } from 'egg';

export default function adminAuthMiddleware(): any {
  return async (ctx: Context, next) => {
    // 管理员身份验证
    const isAdmin = ctx.headers['x-admin-token'] === 'admin-secret';
    if (!isAdmin) {
      ctx.status = 403;
      ctx.body = { error: '无权限访问' };
      return;
    }
    await next();
  };
}