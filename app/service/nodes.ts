import { Service } from 'egg';
import { ErrorCode } from '../lib/error';
import AccessCode from '../model/accessCode';
import NodeInfo, {NodeDownloadInfo} from '../model/node/nodeInfo';


export default class NodesService extends Service {

  public async getNodeList(token: string, parentId: number, offset: number, limit: number) {
    const accessCodeIns: AccessCode = await AccessCode.checkToken(this.ctx, token);
    const nodeList = await accessCodeIns.authFiles.getFileListByParent(parentId, offset, limit);
    return nodeList;
  }

  public async getNodeDownloadInfo(token: string,  nodeId: number, useSwitch: boolean = false): Promise<NodeDownloadInfo> {
    const accessCodeIns: AccessCode = await AccessCode.checkToken(this.ctx, token);
    const quqiId = accessCodeIns.quqiId;
    const nodeInfoInstance = new NodeInfo(this.ctx, quqiId, nodeId);
    await nodeInfoInstance.getNodeInfo();
    if(useSwitch) {
      const cosUrlSwitch = this.ctx.app.config.useCosUrl;
      if(cosUrlSwitch) {
        const downloadInfo: NodeDownloadInfo  = await this.getNodeCosDownloadInfo(nodeInfoInstance);
        return downloadInfo;
      } else {
        const downloadInfo: NodeDownloadInfo  = await this.getNodeCdnDownloadInfo(nodeInfoInstance);
        return downloadInfo;
      }
    } else {
      const downloadInfo: NodeDownloadInfo  = await this.getNodeCdnDownloadInfo(nodeInfoInstance);
      return downloadInfo;
    }
  }

  public async getNodeCdnDownloadInfo(nodeInfoInstance: NodeInfo): Promise<NodeDownloadInfo> {
    try {
      const downloadInfo: NodeDownloadInfo = await nodeInfoInstance.getNodeDownloadCdnPath();
      return downloadInfo;
    } catch (err: any) {
      if (err.errCode && err.errCode === ErrorCode.COS_OBJECT_HEAD_ERROR) {
        nodeInfoInstance.size = 5;
        nodeInfoInstance.ext = 'txt';
        nodeInfoInstance.docType = 155;
        nodeInfoInstance.storageBucket = 'quqicom-1253287318';
        nodeInfoInstance.storageKey = 'quqi_document/A2E4822A98337283E39F7B60ACF85EC9_5';
        const fixedDownloadInfo = await nodeInfoInstance.getNodeDownloadCdnPath();
        return fixedDownloadInfo;
      }
      throw err;
    }
  }
  public async getNodeCosDownloadInfo(nodeInfoInstance: NodeInfo): Promise<NodeDownloadInfo> {
    try {
      const downloadInfo: NodeDownloadInfo = await nodeInfoInstance.getNodeDownloadCosPath();
      return downloadInfo;
    } catch (err: any) {
      if (err.errCode && err.errCode === ErrorCode.COS_OBJECT_HEAD_ERROR) {
        nodeInfoInstance.size = 5;
        nodeInfoInstance.ext = 'txt';
        nodeInfoInstance.docType = 155;
        nodeInfoInstance.storageBucket = 'quqicom-1253287318';
        nodeInfoInstance.storageKey = 'quqi_document/A2E4822A98337283E39F7B60ACF85EC9_5';
        const fixedDownloadInfo = await nodeInfoInstance.getNodeDownloadCosPath();
        return fixedDownloadInfo;
      }
      throw err;
    }
  }
}
