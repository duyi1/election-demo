import { Context } from 'egg';
import { isUndefined } from 'util';

const errorRefMsg = {
  Default: 'default error',
  1: '参数错误',
  20001: 'code error',
  20002: 'request ip not match first',
  20003: 'code expired',
  20004: 'token error',
  20005: 'get quqi db error',
  20006: 'get nodeInfo error',
  20007: 'get doc version error',
  20008: 'dir not cant create download url',
  20009: 'cos info error',
  20010: 'cos object is not exist or head error',
  20011: 'bucket binded cdn not exist',
  20012: 'get version list error',
};

export const enum ErrorCode {
  INVALID_PARAMS = 1,
  CODE_ERROR = 20001,
  REQUEST_IP_NOT_MATCH_FIRST = 20002,
  CODE_EXPIRED = 20003,
  CODE_TOKEN_ERROR = 20004,
  GET_QUQI_DB_ERROR = 20005,
  GET_NODE_INFO_ERROR = 20006,
  GET_DOC_INFO_ERROR = 20007,
  DIR_NODE_DOWNLOAD_ERROR = 20008,
  COS_INFO_ERROR = 20009,
  COS_OBJECT_HEAD_ERROR = 20010,
  BIND_BUCKET_CDN_NOT_EXIST = 20011,
  GET_VERSION_LIST_ERROR = 20012,
}

export const enum ErrorMsg {
  PARADISE_PASSWORD_ERROR_LOCK_1 = '请在',
  PARADISE_PASSWORD_ERROR_LOCK_2 = '分钟后重试',
}

export class QuqiError extends Error {
  public errCode: ErrorCode;
  public errMessage: string;
  public constructor(ctx: Context, errCode: ErrorCode, errCtx?: object, isErrorLog: boolean = false) {
    super();
    this.name = 'quqiError';
    this.errCode = errCode;
    this.errMessage = errorRefMsg[errCode];
    if (this.errMessage === undefined) {
      this.errMessage = errorRefMsg.Default;
    }
    if (isErrorLog) {
      isUndefined(errCtx)
      ? ctx.logger.error(JSON.stringify({ errName: this.name, errCode, errMsg: this.errMessage }))
      : ctx.logger.error(JSON.stringify({ errName: this.name, errCode, errMsg: this.errMessage, errCtx}));
    }
  }
  get message() {
    return this.errMessage;
  }
  get code() {
    return this.errCode;
  }
}

export class QuqiMessageError extends Error {
  public errCode: ErrorCode;
  public errMessage: string;
  public constructor(ctx: Context, errMsg: string, errCtx?: object, isErrorLog: boolean = false) {
    super();
    this.name = 'quqiError';
    this.errCode = 1;
    this.errMessage = errMsg;
    if (this.errMessage === undefined) {
      this.errMessage = errorRefMsg.Default;
    }
    if (isErrorLog) {
      isUndefined(errCtx)
      ? ctx.logger.error(JSON.stringify({ errName: this.name, errMsg: this.errMessage }))
      : ctx.logger.error(JSON.stringify({ errName: this.name, errMsg: this.errMessage, errCtx}));
    }
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
