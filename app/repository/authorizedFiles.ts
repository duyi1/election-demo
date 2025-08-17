import { Context } from 'egg';
import Base from './base';
import { CacheKey, CacheTTL, TableName } from '../lib/enum';
import QuqiDBInfoResp, { DBInfo } from './quqiDB';
import { ErrorCode, QuqiError } from '../lib/error';
import { docTypeStringTransfer } from '../lib/utils';

export interface ListNodeInfo {
  quqi_id: number;
  node_id: number;
  parent_id: number;
  node_name: string;
  is_dir: number;
  add_time: number;
  update_time: number;
  size?: number;
  ext?: string;
  doc_type?: number;
  broad_doc_type?: string;
}

export interface ListVersionInfo {
  quqi_id: number;
  node_id: number;
  version: number;
  size: number;
  ext: string;
  doc_type: string;
  broad_doc_type?: string;
}

export interface ListId {
  quqiId: number;
  parentId: number;
  offset: number;
  limit: number;
}

export default class AuthorizedFilesResp extends Base{
  constructor(ctx: Context) {
    super(ctx);
  }

  public async getList(listId: ListId): Promise<ListNodeInfo[]> {
    // let nodeList = await this.getNodeListCache(listId);
    // if (nodeList) {
    //   return nodeList;
    // }
    const nodes = await this.getNodesFromDB(listId);
    this.ctx.logger.info(`AuthorizedFilesResp.getList: listId:${JSON.stringify(listId)}, nodes:${nodes}`);
    if (nodes.length <= 0) {
      return nodes;
    }
    const { dirNodeList, fileNodeList } = this.separateNodes(nodes);
    let detailNodeList: ListNodeInfo[] = [];

    if (fileNodeList.length > 0) {
      const fileNodeIdList = fileNodeList.map((item) => item.node_id);
      this.ctx.logger.info(`AuthorizedFilesResp.getList: fileNodeIdList:${fileNodeIdList}`);
      const nodeVersionList = await this.getNodeVersionListFromDB(listId.quqiId, fileNodeIdList);
      // if (nodeVersionList.length <= 0) {
      //   throw new QuqiError(this.ctx, ErrorCode.GET_VERSION_LIST_ERROR, { quqiId: listId.quqiId, nodes: fileNodeIdList }, true);
      // }
      detailNodeList = this.mergeNodeVersionInfo(fileNodeList, nodeVersionList);
    }
    const nodeIdList = nodes.map((item) => item.node_id);
    const pageItems: ListNodeInfo[] = await this.orderPageItemsByNodeIdList(detailNodeList, dirNodeList, nodeIdList);
    await this.setNodeListCache(listId, pageItems);
    return pageItems;
  }

  private async getNodesFromDB(listId: ListId) {
    const dbInfo: DBInfo | null = await QuqiDBInfoResp.getDbInfo(this.ctx, listId.quqiId, TableName.TREE_NODE);
    if (!dbInfo) {
      this.ctx.logger.error(`getNodesFromDB, dberror, quqiId: ${listId.quqiId}, parentId:${listId.parentId}`);
      throw new QuqiError(this.ctx, ErrorCode.GET_QUQI_DB_ERROR, {quqiId: listId.quqiId}, true);
    }
    const nodes = await dbInfo.db.select(dbInfo.tableName, {
      where: {
        quqi_id: listId.quqiId,
        parent_id: listId.parentId,
      },
      columns: ['quqi_id', 'node_id', 'parent_id', 'node_name', 'is_dir', 'add_time', 'update_time'],
      orders: [['update_time', 'asc']],
      limit: listId.limit,
      offset: listId.offset,
    });
    if (!nodes || nodes.length <= 0) {
      return [];
    }
    return nodes;
  }

  private async getNodeVersionListFromDB(quqiId: number, nodeIds: number[]): Promise<ListVersionInfo[]> {
    const dbInfo: DBInfo | null = await QuqiDBInfoResp.getDbInfo(this.ctx, quqiId, TableName.TREE_VERSION);
    if (!dbInfo) {
      this.ctx.logger.error(`getDocInfoFromDB, dberror, quqiId: ${quqiId}`);
      throw new QuqiError(this.ctx, ErrorCode.GET_QUQI_DB_ERROR, {quqiId}, true);
    }
    const versions = await dbInfo.db.select(dbInfo.tableName, {
      where: {
        quqi_id: quqiId,
        node_id: nodeIds,
      },
      columns: ['quqi_id', 'node_id', 'version', 'doc_type_new', 'doc_size', 'doc_ext'],
      orders: [['node_id', 'asc'], ['version', 'desc']],
    });
    if (!versions || versions.length < 1) {
      this.ctx.logger.error(`getNodeVersionListFromDB, versionerror, quqiId: ${quqiId}, nodeIds:${nodeIds}, version:${versions}`);
      return [];
    }
    let lastestVersions: ListVersionInfo[] = [];
    let currentNode = 0;
    for (const version of versions) {
      if (version.node_id != currentNode) {
        lastestVersions.push({
          quqi_id: version.quqi_id,
          node_id: version.node_id,
          version: version.version,
          doc_type: version.doc_type_new,
          size: version.doc_size,
          ext: version.doc_ext,
          broad_doc_type: docTypeStringTransfer(version.doc_type_new),
        });
        currentNode = version.node_id;
      }
    }
    return lastestVersions;
  }

  private separateNodes(nodes: ListNodeInfo[]) {
    const dirNodeList: ListNodeInfo[] = [];
    const fileNodeList: ListNodeInfo[] = [];
    for (const node of nodes) {
      if (node.is_dir) {
        dirNodeList.push(node);
      } else {
        fileNodeList.push(node);
      }
    }
    return {dirNodeList, fileNodeList};
  }

  private mergeNodeVersionInfo(nodes: ListNodeInfo[], versions: ListVersionInfo[]): ListNodeInfo[] {
    const nodeInfoMap = new Map();
    for (const node of nodes) {
      nodeInfoMap.set(node.node_id, node);
    }
    for (const version of versions) {
      const nodeId = version.node_id;
      const nodeInfo = nodeInfoMap.get(nodeId);
      if (nodeInfo) {
        nodeInfoMap.set(nodeId, { ...nodeInfo, ...version });
      }
    }
    const mergedNodeList: ListNodeInfo[] = new Array();
    for (const value of nodeInfoMap.values()) {
      mergedNodeList.push(value);
    }
    return mergedNodeList;
  }

  
  private orderPageItemsByNodeIdList(files: ListNodeInfo[], dirs: ListNodeInfo[], nodeIdList: number[]) {
    const pageItemMap: {[nodeId: number]: ListNodeInfo } = {};
    const itemList: ListNodeInfo[] = [];
    for (const file of files) {
      pageItemMap[file.node_id] = file;
    }
    for (const dir of dirs) {
      pageItemMap[dir.node_id] = dir;
    }
    for (const nodeId of nodeIdList) {
      if (pageItemMap[nodeId]) {
        itemList.push(pageItemMap[nodeId]);
      }
    }
    return itemList;
  }
  private async setNodeListCache(listId: ListId, nodeList: ListNodeInfo[]) {
    const cacheKey = this.getListCacheKey(listId);
    await this.cache.set(cacheKey, JSON.stringify(nodeList), 'EX', CacheTTL.NODE_INFO);
  }

  // private async getNodeListCache(listId: ListId) {
  //   const cacheKey = this.getListCacheKey(listId);
  //   const nodeList = await this.cache.get(cacheKey);
  //   return nodeList ? JSON.parse(nodeList) : null;
  // }
  private getListCacheKey(listId: ListId) {
    return `${CacheKey.NODE_LIST}:${listId.quqiId}_${listId.parentId}_${listId.offset}_${listId.limit}`;
  }
}