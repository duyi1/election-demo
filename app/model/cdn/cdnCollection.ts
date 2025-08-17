import { Context } from 'egg';
import CDNDownload from './cdnDownload';
import { TableName } from '../../lib/enum';
import { ErrorCode, QuqiError } from '../../lib/error';

export default class CDNCollection {
  public ctx: Context;
  public cdnMap: Map<string, CDNDownload>;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.cdnMap = new Map();
  }
  get DB() {
    return this.ctx.app.mysql.get('download_assistant') as any;
  }
  public async getCdnInstance(bucket: string) {
    let cdnInstance = this.cdnMap.get(bucket);
    if (cdnInstance) {
      return cdnInstance;
    }
    const cdnInfo = await this.DB.get(TableName.CDN_INFO, {
      bucket,
    });
    if (!cdnInfo) {
      throw new QuqiError(this.ctx, ErrorCode.BIND_BUCKET_CDN_NOT_EXIST, {
        bucket,
      }, true);
    }
    cdnInstance = new CDNDownload({
      domain: cdnInfo.domain,
      bindBucket: cdnInfo.bucket,
      encryptedSalt: cdnInfo.encrypted_salt,
      speedLimitPathPrefix: cdnInfo.speed_limit_path_prefix,
    });
    this.cdnMap.set(cdnInstance.bindBucketName, cdnInstance);
    return cdnInstance;
  }

  public async loadCdnMap() {
    const cdnInfos = await this.DB.select(TableName.CDN_INFO);
    if (cdnInfos.length <= 0) {
      return;
    }
    for (const info of cdnInfos){
      const cdnInstance = new CDNDownload({
        domain: info.domain,
        bindBucket: info.bucket,
        encryptedSalt: info.encrypted_salt,
        speedLimitPathPrefix: info.speed_limit_path_prefix,
      });
      this.cdnMap.set(cdnInstance.bindBucketName, cdnInstance);
    }
  }
}