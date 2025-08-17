import { Service } from 'egg';
import AccessCode, { NewCodeInitInfo } from '../model/accessCode';

export default class AccessCodeService extends Service {

  public async createNewCode(info: NewCodeInitInfo) {
    const accessCodeInstance = new AccessCode(this.ctx);
    const codeInfo = await accessCodeInstance.createNewCode(info);
    return codeInfo;
  }

  public async checkCode(code: string) {
    const accessCodeInstance = new AccessCode(this.ctx, code);
    const tokenInfo = await accessCodeInstance.checkCode();
    return tokenInfo;
  }
}
