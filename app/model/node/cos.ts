import {Context} from 'egg';
import { HeadObjectResult, GetObjectUrlParams } from 'cos-nodejs-sdk-v5';
import { getCosUrlDomianFromBucket } from '../../lib/utils';

export interface CosUrlInfo {
  passportId?: number,
  quqiId: number,
  clientType?: number,
  downloadType?: number,
  resourceType?: number,
  expiredSecs: number,
  speedLimit: number,
}

export default class Cos {
  public ctx: Context;
  public bucket: string;
  public key: string;
  public region: string;
  public mime: string;
  public size: number;

  constructor(ctx: Context, bucket: string, key: string, region: string ) {
    this.ctx = ctx;
    this.bucket = bucket;
    this.key = key;
    this.region = region;
  }

  public getDownloadUrl(urlInfo: CosUrlInfo) {
    return new Promise<string>((resolve, reject) => {
      try {
        let params: GetObjectUrlParams = {
          Region: this.region,
          Bucket: this.bucket,
          Key: this.key,
          Sign: true,
          Method: 'GET',
          Query: {
            'x-cos-traffic-limit': urlInfo.speedLimit * 1024 * 8,
            'quqi-id': urlInfo.quqiId,
          },
          Expires: urlInfo.expiredSecs,
          Protocol: 'https:',
        };
        const domain = getCosUrlDomianFromBucket(this.bucket);
        if(domain) {
          params = {
            ...params,
            Domain: domain
          }
        }
        this.ctx.app.cosClient.getObjectUrl(params, (err, data) => {
          if (err !== null) {
            return reject(err);
          }
          return resolve(data.Url);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public headObjectFromCOS() {
    return new Promise<HeadObjectResult | null>((resolve, reject) => {
      try {
        this.ctx.app.cosClient.headObject({
          Bucket: this.bucket,
          Key: this.key,
          Region: this.region,
        }, (err, data) => {
          if (err !== null) {
            if (err.code === '404') {
              return resolve(null);
            }
            this.ctx.logger.error(err);
            return reject(err);
          }
          resolve(data);
        });
      } catch (err) {
        return reject(err);
      }
    });
  }
}