import { Context } from 'egg';
import Base from './base';
import { AuthMode, CacheKey, CacheTTL, ExpireTime, TableName } from '../lib/enum';
import { getCurrentTimestamp } from '../lib/utils';

export interface CodeInfo {
  code: string;
  creator: number;
  quqiId: number;
  authMode: AuthMode;
  expiredTime?: number;
  firstValidIp?: string;
}

export default class AccessCodeResp extends Base{
  constructor(ctx: Context) {
    super(ctx);
  }

  public async createNewCode(codeInfo: CodeInfo) {
    const now = getCurrentTimestamp();
    codeInfo.expiredTime = now + ExpireTime.ACCESS_CODE;
    await this.setCodeCache(codeInfo);
    await this.DB.insert(TableName.ACCESS_CODE, {
      code: codeInfo.code,
      creator: codeInfo.creator,
      quqi_id: codeInfo.quqiId,
      auth_mode: codeInfo.authMode,
      add_time: now,
      expire_time: codeInfo.expiredTime,
    });
    return codeInfo.expiredTime;
  }

  public async getCodeInfo(code: string): Promise<CodeInfo | null> {
    let codeInfo = await this.getCodeCache(code);
    if (codeInfo) {
      return codeInfo;
    }
    const info = await this.DB.get(TableName.ACCESS_CODE, { code });
    if (info) {
      codeInfo = {
        code: info.code,
        creator: info.creator,
        quqiId: info.quqi_id,
        authMode: info.auth_mode,
        firstValidIp: info.first_valid_ip,
        expiredTime: info.expire_time,
      }
      await this.setCodeCache(codeInfo);
      return codeInfo;
    }
    return null;
  }

  public async updateCodeInfo(codeInfo: CodeInfo) {
    await this.setCodeCache(codeInfo);
    await this.DB.update(TableName.ACCESS_CODE,  {
      first_valid_ip: codeInfo.firstValidIp,
      expire_time: codeInfo.expiredTime,
      update_time: getCurrentTimestamp(),
    }, {
      where: {
        code: codeInfo.code,
      }
    });
  }

  public async addCodeTokenCache(token: string, code: string) {
    const cacheKey = `${CacheKey.CODE_TOKEN}:${token}`;
    await this.cache.set(cacheKey, code, 'EX', CacheTTL.CODE_TOKEN);
  }
  public async getCodeFromToken(token: string) {
    const cacheKey = `${CacheKey.CODE_TOKEN}:${token}`;
    const code = await this.cache.get(cacheKey);
    return code;
  }

  public async expiredCodeToken(token: string) {
    const cacheKey = `${CacheKey.CODE_TOKEN}:${token}`;
    await this.cache.del(cacheKey);
  }

  private async setCodeCache(codeInfo: CodeInfo) {
    const cacheKey = `${CacheKey.CODE_INFO}:${codeInfo.code}`;
    await this.cache.set(cacheKey, JSON.stringify(codeInfo), 'EX', CacheTTL.CODE_INFO);
  }

  private async getCodeCache(code: string) {
    const cacheKey = `${CacheKey.CODE_INFO}:${code}`;
    const codeInfo = await this.cache.get(cacheKey);
    return codeInfo ? JSON.parse(codeInfo) : null;
  }
}