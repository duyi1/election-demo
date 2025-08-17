import { Context } from 'egg';
import { AuthMode } from '../lib/enum';
import AuthorizedFilesResp from '../repository/authorizedFiles';

export default class AuthorizedFiles {
  code: string;
  quqiId: number;
  authMode: AuthMode;
  authNodes: string;
  ctx: Context;
  constructor(ctx: Context, quqiId: number, authNodes: string = '') {
    this.ctx = ctx;
    this.authMode = AuthMode.GROUP_AUTH;
    this.quqiId = quqiId;
    this.authNodes = authNodes;
  }

  public async filesAuthorize() {
    return;
  }

  public async getFileListByParent(parentId: number, offset: number, limit: number) {
    const authorizedFilesRespInstance = new AuthorizedFilesResp(this.ctx);
    const pageItems = await authorizedFilesRespInstance.getList({
      quqiId: this.quqiId,
      parentId,
      offset,
      limit
    });
    return pageItems;
  }
}