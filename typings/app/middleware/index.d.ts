// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdminAuth from '../../../app/middleware/admin_auth';
import ExportUserAuth from '../../../app/middleware/user_auth';

declare module 'egg' {
  interface IMiddleware {
    adminAuth: typeof ExportAdminAuth;
    userAuth: typeof ExportUserAuth;
  }
}
