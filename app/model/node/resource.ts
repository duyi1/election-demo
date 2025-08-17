import { Context } from 'egg';
import { CacheKey, CacheTTL } from '../../lib/enum';

export interface ResourceAttr {
  bucketName: string;
  bucketPath: string;
  mime: string;
  size: number;
  region: string;
  isEncrypted: boolean;
  encryptedInfo?: EncryptedInfo;
}

export interface EncryptedInfo {
  encryptedSize: number;
  encryptedAlgorithm: string;
  encryptedVersion: string;
  encryptedKey: string;
}

export default class Resource {
  public readonly bucketName: string;
  public readonly bucketPath: string;
  public readonly mime: string;
  public readonly size: number;
  public readonly region: string;
  public readonly isEncrypted: boolean;
  public readonly encryptedInfo?: EncryptedInfo;

  constructor(attr: ResourceAttr) {
    this.bucketName = attr.bucketName;
    this.bucketPath = attr.bucketPath;
    this.size = attr.size;
    this.region = attr.region;
    this.isEncrypted = attr.isEncrypted;
    this.encryptedInfo = attr.encryptedInfo;
    this.mime = attr.mime;
  }

  public static async findFromCuria(ctx: Context, bucketName: string, bucketPath: string)
  : Promise<Resource | null> {
    const cacheKey = `${CacheKey.RESOURCE_ENCRYPTED_INFO}:${bucketName}/${bucketPath}`;
    const str = await ctx.app.redis.get(cacheKey);
    if (str !== null) {
      return new this(Resource.deserialize(str));
    }
    // head obj from curia
    const result = await ctx.app.curia.headObject(bucketName, bucketPath);
    if (result === false) {
      return null;
    }
    let obj: Resource;
    if (!result.Metadata || !result.Metadata['curia-provider']) { // 未处理过
      obj = new this({
          bucketName,
          bucketPath,
          mime: result.ContentType!,
          region: ctx.app.curia.region,
          size: result.ContentLength!,
          isEncrypted: false,
          encryptedInfo: undefined,
      });
    } else { // 处理过
      const attr: ResourceAttr = {
        bucketName: result.Metadata['curia-bucket'],
        bucketPath: result.Metadata['curia-key'],
        mime: result.Metadata['curia-mime'],
        region: result.Metadata['curia-region'],
        size: parseInt(result.Metadata['curia-size'], 10),
        isEncrypted: false,
      };
      if (result.Metadata['curia-encrypted-key']) { // 加密过
        attr.isEncrypted = true;
        attr.encryptedInfo = {
          encryptedSize: parseInt(result.Metadata['curia-encrypted-size'], 10),
          encryptedAlgorithm: result.Metadata['curia-encrypted-alg'],
          encryptedVersion: result.Metadata['curia-encrypted-ver'],
          encryptedKey: result.Metadata['curia-encrypted-key'],
        };
      }
      obj = new this(attr);
    }
    if (obj.isEncrypted) {
      await ctx.app.redis.setex(cacheKey, CacheTTL.RESOURCE_ENCRYPTED_INFO, Resource.serialize(obj));
    }
    return obj;
  }

  private static serialize(obj: Resource) {
    return JSON.stringify({
      bucketName: obj.bucketName,
      bucketPath: obj.bucketPath,
      mime: obj.mime,
      size: obj.size,
      region: obj.region,
      isEncrypted: obj.isEncrypted,
      encryptedInfo: obj.encryptedInfo,
    });
  }

  private static deserialize(str: string) {
    return JSON.parse(str);
  }
}
