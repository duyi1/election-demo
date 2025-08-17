import { Context } from 'egg';
import NodeInfoResp from '../../repository/nodeInfo';
import Resource from './resource';
import { ErrorCode, QuqiError } from '../../lib/error';
import CDNDownload, {DownloadUrlInfo} from '../cdn/cdnDownload';
import Cos from './cos';
import { getCurrentTimestamp } from '../../lib/utils';

export interface NodeDownloadInfo {
  name: string,
  mime?: string,
  size?: number,
  is_encrypted: boolean,
  url?: string,
  expired_time?: number,
  encrypted_key?: string,
}

export default class NodeInfo {
  public ctx: Context;
  public quqiId: number;
  public nodeId: number;
  public nodeName: string;
  public parentId: number;
  public isDir: number;
  public addTime: number;
  public updateTime: number;

  public size?: number;
  public docType?: number;
  public ext?: string;
  public storageBucket?: string;
  public storageKey?: string;
  public resource: Resource | null | Cos;

  constructor(ctx: Context, quqiId: number, nodeId: number ) {
    this.ctx = ctx;
    this.quqiId = quqiId;
    this.nodeId = nodeId;
  }

  public async getNodeInfo() {
    const nodeInfoRespIns = new NodeInfoResp(this.ctx);
    const nodeInfo = await nodeInfoRespIns.getNodeInfo(this.quqiId, this.nodeId);
    this.nodeName = nodeInfo.nodeName;
    this.parentId = nodeInfo.parentId;
    this.addTime = nodeInfo.addTime;
    this.updateTime = nodeInfo.updateTime;
    this.isDir = nodeInfo.isDir;
    if (!this.isDir) {
      this.size = nodeInfo.size;
      this.ext = nodeInfo.ext;
      this.docType = nodeInfo.docType;
      this.storageBucket = nodeInfo.bucket;
      this.storageKey = nodeInfo.key;
    }
  }

  public async getNodeDownloadCdnPath(): Promise<NodeDownloadInfo> {
    if (this.isDir) {
      throw new QuqiError(this.ctx, ErrorCode.DIR_NODE_DOWNLOAD_ERROR, {quqiId: this.quqiId, nodeId: this.nodeId}, true);
    }
    if (!this.storageBucket || !this.storageKey) {
      throw new QuqiError(this.ctx, ErrorCode.COS_INFO_ERROR, {
        quqiId: this.quqiId,
        nodeId: this.nodeId,
        bucket: this.storageBucket,
        key: this.storageKey,
      });
    }
    this.resource = await Resource.findFromCuria(this.ctx, this.storageBucket, this.storageKey);
    if (!this.resource) {
      throw new QuqiError(this.ctx, ErrorCode.COS_OBJECT_HEAD_ERROR, {
        quqiId: this.quqiId,
        nodeId: this.nodeId,
        bucket: this.storageBucket,
        key: this.storageKey,
      });
    }
    // 未加密返回
    if (!this.resource.isEncrypted) {
      return {
        name: this.nodeName,
        is_encrypted: false
      }
    }
    // 加密生成cdn下载链接
    const cdnInstance: CDNDownload = await this.ctx.app.cdnCollection.getCdnInstance(this.resource.bucketName);
    const cdnDownloadInfo: DownloadUrlInfo = await cdnInstance.generateDownloadUrlInfo(this.resource.bucketPath);
    return {
      name: this.nodeName,
      mime: this.resource.mime,
      size: this.resource.size,
      is_encrypted: true,
      url: cdnDownloadInfo.url,
      expired_time: cdnDownloadInfo.expiredTime,
      encrypted_key: this.resource.encryptedInfo?.encryptedKey,
    }
  }

  public async getNodeDownloadCosPath(): Promise<NodeDownloadInfo> {
    if (this.isDir) {
      throw new QuqiError(this.ctx, ErrorCode.DIR_NODE_DOWNLOAD_ERROR, {quqiId: this.quqiId, nodeId: this.nodeId}, true);
    }
    if (!this.storageBucket || !this.storageKey) {
      throw new QuqiError(this.ctx, ErrorCode.COS_INFO_ERROR, {
        quqiId: this.quqiId,
        nodeId: this.nodeId,
        bucket: this.storageBucket,
        key: this.storageKey,
      });
    }
    const nodeCosInstance = new Cos(
      this.ctx,
      this.storageBucket,
      this.storageKey,
      this.ctx.app.config.cosConfig.Region
    );
    const headRes = await nodeCosInstance.headObjectFromCOS();
    if (!headRes) {
      throw new QuqiError(this.ctx, ErrorCode.COS_OBJECT_HEAD_ERROR, {
        quqiId: this.quqiId,
        nodeId: this.nodeId,
        bucket: this.storageBucket,
        key: this.storageKey,
      });
    }
    nodeCosInstance.mime = headRes.headers!['content-type'];
     nodeCosInstance.size = parseInt(headRes.headers!['content-length'], 10);
    // 生成cos下载链接
    const url = await nodeCosInstance.getDownloadUrl({
      quqiId: this.quqiId,
      speedLimit: this.ctx.app.config.cosConfig.DownloadSpeedLimit,
      expiredSecs: this.ctx.app.config.cosConfig.DownloadUrlExpireTime,
    });
    return {
      name: this.nodeName,
      mime: nodeCosInstance.mime,
      size: nodeCosInstance.size,
      is_encrypted: false,
      url,
      expired_time: getCurrentTimestamp() + this.ctx.app.config.cosConfig.DownloadUrlExpireTime,
      encrypted_key: '',
    }
  }
}