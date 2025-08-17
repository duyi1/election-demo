import { Context } from 'egg';

export default (): any => {
  return async function checkPassportId(ctx: Context, next) {
    const passportId = ctx.cookies.get('passport_id', {signed: false});
    // tslint:disable-next-line:triple-equals
    if (!passportId || passportId == '') {
      ctx.req.destroy();
      ctx.logger.error(`checkPassportId login fail`);
      ctx.errResp('login fail', 99, {});
    } else {
      ctx.custom = {
        ...ctx.custom,
        passportId,
      };
      await next();
    }
  };
};
