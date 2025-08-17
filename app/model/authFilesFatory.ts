import { Context } from 'egg';
import AuthorizedFiles from './authorizedFiles';
import ParentNodeAuthorizedFiles from "./parentNodeAuthorizedFiles";
import { AuthMode } from '../lib/enum';

export function getAuthorizedFilesInstance(ctx: Context, authMode: AuthMode, quqiId: number, authNodes?: string) {
  switch (authMode) {
    case AuthMode.GROUP_AUTH:
      return new AuthorizedFiles(ctx, quqiId, authNodes);
    case AuthMode.PARENT_AUTH:
      return new ParentNodeAuthorizedFiles(ctx, quqiId, authNodes);
    default:
      return new AuthorizedFiles(ctx, quqiId, authNodes);
  }
}