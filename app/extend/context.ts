import { Context } from 'egg';
import { isUndefined } from 'util';
import { logUnKnownError } from '../lib/error';

export default {
  succResp (this: Context, data: object | null): void {
    if (data) {
      this.body = {
        err: 0,
        msg: 'success',
        data,
      };
    } else {
      this.body = {
        err: 0,
        msg: 'success',
      };
    }
  },
  errResp (this: Context, msg: string, err: number = 1, data: object | null = null): void {
    this.body = { err, msg, data };
  },

  catchErrResp(this: Context, err, msg: string = '') {
    const content = {
      err: 1,
      msg,
      data: null,
    };
    // this.logger.error(JSON.stringify({errCode: err.code, errMsg: err.message, errStack: err.stack }));
    if (!isUndefined(err.errCode)) {
      content.err = err.errCode;
      content.msg = msg === '' ? err.message : msg;
    } else {
      content.msg = msg === '' ? err.message : msg;
    }
    this.body = content;
  },
  innerSuccResp(this: Context, data: object | null): void {
    if (data) {
      this.body = {
        status: 0,
        msg: 'success',
        data,
      };
    } else {
      this.body = {
        status: 0,
        msg: 'success',
      };
    }
  },
  innerErrResp (this: Context, msg: string, data: object | null): void {
    if (data) {
      this.body = {
        status: 1,
        msg,
        data,
      };
    } else {
      this.body = {
        status: 1,
        msg,
      };
    }
  },
  catchErrInnerResp(this: Context, err, msg: string = '', ctxContent?) {
    const content = {
      status: 1,
      msg,
      data: null,
    };
    if (!isUndefined(err.errCode)) {
      content.status = err.errCode;
    } else {
      logUnKnownError(this, err, ctxContent);
    }
    this.body = JSON.stringify(content);
  },
};
