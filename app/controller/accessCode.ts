import { Controller } from 'egg';
import { ErrorCode, QuqiError } from '../lib/error';

export default class AccessCodeController extends Controller {
  public async createCode() {
    try {
      const { quqi_id: quqiId, type, nodes, creator } = this.ctx.request.body;
      if (!quqiId || !type || !creator) {
        throw new QuqiError(this.ctx, ErrorCode.INVALID_PARAMS, {quqiId, type, nodes, creator}, true);
      }
      const codeInfo = await this.ctx.service.accessCode.createNewCode({
        creator,
        quqiId,
        authMode: type,
        authNodes: nodes,
      });
      this.ctx.succResp({
        access_code: codeInfo.code,
        expire_time: codeInfo.expireTime,
      });
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }

  public async checkCode() {
    try {
      this.ctx.logger.info(`CheckCode into body:${JSON.stringify(this.ctx.request.body)}, ip:${this.ctx.request.ip}`);
      const { access_code: accessCode} = this.ctx.request.body;
      if (!accessCode) {
        throw new QuqiError(this.ctx, ErrorCode.INVALID_PARAMS, {accessCode}, true);
      }
      const tokenInfo = await this.ctx.service.accessCode.checkCode(accessCode);
      this.ctx.succResp({
        token: tokenInfo.token,
        expire_time: tokenInfo.expireTime,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      this.ctx.catchErrResp(error);
    }
  }
}
