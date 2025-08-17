import { Context } from 'egg';
import AuthorizedFiles from './authorizedFiles';
import { AuthMode } from '../lib/enum';

export default class ParentNodeAuthorizedFiles extends AuthorizedFiles {

  constructor(ctx: Context, quqiId: number, authNodes: string = '') {
    super(ctx, quqiId, authNodes);
    this.authMode = AuthMode.PARENT_AUTH;
  }

  public async filesAuthorize() {
    return;
  }

  public async getFileListByParent(parentId: number, offset: number, limit: number) {
    const items = await super.getFileListByParent(parentId, offset, limit);
    return items;
  }
}