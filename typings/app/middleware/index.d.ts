// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCheckPassportId from '../../../app/middleware/checkPassportId';

declare module 'egg' {
  interface IMiddleware {
    checkPassportId: typeof ExportCheckPassportId;
  }
}
