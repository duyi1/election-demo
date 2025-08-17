import { Controller } from 'egg';
import { ErrorCode, QuqiError } from '../lib/error';

export default class NodeController extends Controller {
  public async getNodeList() {
    try {
      this.ctx.logger.info(`getNodeList into body:${JSON.stringify(this.ctx.request.query)}, ip:${this.ctx.request.ip}`);
      const { token, parent_id: parentId } = this.ctx.request.query;
      let { offset, limit } = this.ctx.request.query;
      if (!token || !parentId) {
        throw new QuqiError(this.ctx, ErrorCode.INVALID_PARAMS, {token, parentId, offset, limit}, true);
      }
      const nodeList = await this.ctx.service.nodes.getNodeList(token, parseInt(parentId, 10),
        offset ? parseInt(offset, 10) : 0, limit ? parseInt(limit, 10) : this.ctx.app.config.nodeList.limit);
      this.ctx.succResp({
        nodes: nodeList,
      });
    } catch (error) {
      this.ctx.logger.error(error);
      this.ctx.catchErrResp(error);
    }
  }

  public async nodeDownload() {
    try {
      this.ctx.logger.info(`nodeDownload into body:${JSON.stringify(this.ctx.request.query)}, ip:${this.ctx.request.ip}`);
      const { token, quqi_id: quqiId, node_id: nodeId} = this.ctx.request.query;
      if (!token || !quqiId || !nodeId) {
        throw new QuqiError(this.ctx, ErrorCode.INVALID_PARAMS, {
          token,
          quqiId,
          nodeId,
        }, true);
      }
      const downloadInfo = await this.ctx.service.nodes.getNodeDownloadInfo(token, parseInt(nodeId, 10));
      this.ctx.logger.info(`nodeDownload finish res:${JSON.stringify(downloadInfo)}`);
      this.ctx.succResp(downloadInfo);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }

  public async nodeDownloadV2() {
    try {
      this.ctx.logger.info(`nodeDownloadV2 into body:${JSON.stringify(this.ctx.request.query)}, ip:${this.ctx.request.ip}`);
      const { token, quqi_id: quqiId, node_id: nodeId} = this.ctx.request.query;
      if (!token || !quqiId || !nodeId) {
        throw new QuqiError(this.ctx, ErrorCode.INVALID_PARAMS, {
          token,
          quqiId,
          nodeId,
        }, true);
      }
      const downloadInfo = await this.ctx.service.nodes.getNodeDownloadInfo(token, parseInt(nodeId, 10), true);
      this.ctx.logger.info(`nodeDownloadV2 finish res:${JSON.stringify(downloadInfo)}`);
      this.ctx.succResp(downloadInfo);
    } catch (error) {
      this.ctx.catchErrResp(error);
    }
  }
}
