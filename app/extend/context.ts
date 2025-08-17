import { Context } from 'egg';
import { isUndefined } from 'util';

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
    if (!isUndefined(err.errCode)) {
      content.err = err.errCode;
      content.msg = msg === '' ? err.message : msg;
    } else {
      content.msg = msg === '' ? err.message : msg;
    }
    this.body = content;
  }
}