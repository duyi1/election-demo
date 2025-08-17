import { Context } from 'egg';
import { isUndefined } from 'util';

export const enum ErrorCode {
  DEFAULT = -1,
  INVALID_PARAMS = 1,
}

export const enum ErrorMsg {
  PARADISE_PASSWORD_ERROR_LOCK_1 = '请在',
  PARADISE_PASSWORD_ERROR_LOCK_2 = '分钟后重试',
}

export class ElectionError extends Error {
  public errCode: ErrorCode;
  public errMessage: string;
  public constructor(ctx: Context, errMsg: string, errCode?: ErrorCode, errCtx?: object) {
    super();
    this.errCode = errCode ?? ErrorCode.INVALID_PARAMS;
    this.errMessage = errMsg;
    if (this.errMessage === undefined) {
      this.errMessage = "error";
    }
    isUndefined(errCtx)
    ? ctx.logger.error(JSON.stringify({ errCode, errMsg: this.errMessage }))
    : ctx.logger.error(JSON.stringify({ errCode, errMsg: this.errMessage, errCtx}));
  }
  get message() {
    return this.errMessage;
  }
  get code() {
    return this.errCode;
  }
}

export const logUnKnownError = (ctx: Context, err, errCtx?) => {
  const content = {errName: err.name, errMsg: err.message, errCtx: {}};
  if (!isUndefined(errCtx)) {
    content.errCtx = errCtx;
  }
  ctx.logger.error(JSON.stringify(content));
};
