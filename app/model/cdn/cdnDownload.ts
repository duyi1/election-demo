import { getCurrentTimestamp, hashString } from '../../lib/utils';
import { ExpireTime } from '../../lib/enum';

export interface CDNInfo {
  domain: string,
  bindBucket: string,
  encryptedSalt: string,
  speedLimitPathPrefix: string,
}

export interface DownloadUrlInfo {
  url: string;
  expiredTime: number;
}

export default class CDNDownload {
  public readonly domain: string;
  public readonly bindBucketName: string;
  public encryptedSalt: string;
  public pathPrefix: string; // speed limit

  constructor(attr: CDNInfo) {
    this.domain = attr.domain;
    this.bindBucketName = attr.bindBucket;
    this.encryptedSalt = attr.encryptedSalt;
    this.pathPrefix = attr.speedLimitPathPrefix;
  }

  public async generateDownloadUrlInfo(bucketPath: string)
  : Promise<DownloadUrlInfo> {
    if (!this.pathPrefix) {
      throw new Error(`invalid path prefix: ${JSON.stringify({
        bucket: this.bindBucketName,
        domain: this.domain,
      })}`);
    }
    const time = getCurrentTimestamp();
    const beforeMd5Str = `${this.encryptedSalt}/${this.pathPrefix}/${bucketPath}${time}`;
    const sign = hashString(beforeMd5Str, 'md5').toLowerCase();
    const url = `${this.domain}/${this.pathPrefix}/${bucketPath}?sign=${sign}&t=${time}`;
    return {
      url,
      expiredTime: time + ExpireTime.DOWNLOAD_URL,
    };
  }
}
