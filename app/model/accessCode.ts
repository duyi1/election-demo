import { Context } from 'egg';
import AuthorizedFiles from './authorizedFiles';
import { AuthMode, ExpireTime } from '../lib/enum';
import { getCurrentTimestamp, createRandomString, hashString } from '../lib/utils';
import AccessCodeResp, { CodeInfo } from '../repository/accessCode';
import { getAuthorizedFilesInstance } from './authFilesFatory';
import { ErrorCode, QuqiError } from '../lib/error';

export interface NewCodeInitInfo {
  creator: number;
  quqiId: number;
  authMode: AuthMode;
  authNodes: string;
}

export default class AccessCode {
  public ctx: Context;
  public code: string;
  public creator: number;
  public createTime: number;
  public expireTime: number;
  public quqiId: number;
  public authMode: AuthMode;
  public authFiles: AuthorizedFiles;
  public firstValidIp: string;
  
  constructor(ctx: Context, code?: string ) {
    this.ctx = ctx;
    if (code) {
      this.code = code;
    }
  }

  public async createNewCode(codeInfo: NewCodeInitInfo) {
    this.creator = codeInfo.creator;
    this.quqiId = codeInfo.quqiId;
    this.authMode = codeInfo.authMode;
    this.createTime = getCurrentTimestamp();
    this.expireTime = this.createTime + ExpireTime.ACCESS_CODE;
    this.code = createRandomString(16);

    const accessCodeRespInstance = new AccessCodeResp(this.ctx);
    this.expireTime = await accessCodeRespInstance.createNewCode({
      code: this.code,
      creator: this.creator,
      quqiId: this.quqiId,
      authMode: this.authMode,
    });

    const authFilesIns = getAuthorizedFilesInstance(this.ctx, this.authMode, this.quqiId, codeInfo.authNodes);
    await authFilesIns.filesAuthorize();
    return {
      code: this.code,
      expireTime: this.expireTime,
    };
  }

  public async checkCode() {
    const accessCodeRespInstance = new AccessCodeResp(this.ctx);
    await AccessCode.getCodeInfo(this.ctx, this.code);
    const token = hashString(Date.now().toString() + (Math.floor(Math.random() * 10001)).toString(), 'md5');
    const tokenExpireTime = getCurrentTimestamp() + ExpireTime.CODE_TOKEN;
    await accessCodeRespInstance.addCodeTokenCache(token, this.code);
    return {
      token,
      expireTime: tokenExpireTime,
    }
  }

  public static async checkToken(ctx: Context, token: string) {
    const accessCodeRespInstance = new AccessCodeResp(ctx);
    const code = await accessCodeRespInstance.getCodeFromToken(token);
    if (!code) {
      throw new QuqiError(ctx, ErrorCode.CODE_TOKEN_ERROR, {
        token,
        ip: ctx.request.ip,
      }, true);
    }
    const codeInfo = await AccessCode.getCodeInfo(ctx, code);
    const accessCodeIns = new this(ctx);
    accessCodeIns.codeInfoInit(codeInfo);
    return accessCodeIns;
  }

  private static async getCodeInfo(ctx: Context, code: string) {
    const accessCodeRespInstance = new AccessCodeResp(ctx);
    // 获取访问码信息
    const codeInfo = await accessCodeRespInstance.getCodeInfo(code);
    if (!codeInfo) {
      throw new QuqiError(ctx, ErrorCode.CODE_ERROR, {
        code: code,
        ip: ctx.request.ip,
      }, true);
    }
    const now = getCurrentTimestamp();
    const requestIp = ctx.request.ip;
    // 过期检测
    if (codeInfo.expiredTime && now >= codeInfo.expiredTime) {
      throw new QuqiError(ctx, ErrorCode.CODE_EXPIRED, {
        code: code,
        requestIp,
      }, true);
    }
    // 访问ip与首次ip检测
    if (codeInfo.firstValidIp) {
      // if (codeInfo.firstValidIp !== requestIp) {
      //   throw new QuqiError(ctx, ErrorCode.REQUEST_IP_NOT_MATCH_FIRST, {
      //     code: code,
      //     requestIp,
      //     firstValidIp: codeInfo.firstValidIp
      //   }, true);
      // }  
    } else {
      codeInfo.firstValidIp = requestIp;
      await accessCodeRespInstance.updateCodeInfo(codeInfo);
    }
    return codeInfo;
  }

  private codeInfoInit(codeInfo: CodeInfo) {
    this.code = codeInfo.code;
    this.creator = codeInfo.creator;
    this.firstValidIp = codeInfo.firstValidIp ? codeInfo.firstValidIp : '';
    this.expireTime = codeInfo.expiredTime ? codeInfo.expiredTime : 0;
    this.quqiId = codeInfo.quqiId;
    this.authMode = codeInfo.authMode;
    const authFilesIns = getAuthorizedFilesInstance(this.ctx, this.authMode, this.quqiId);
    this.authFiles = authFilesIns;
  }
}