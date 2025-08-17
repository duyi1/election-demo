// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAccessCode from '../../../app/service/accessCode';
import ExportTest from '../../../app/service/Test';
import ExportAdminCandidate from '../../../app/service/admin/candidate';
import ExportAdminElection from '../../../app/service/admin/election';
import ExportUserAuth from '../../../app/service/user/auth';
import ExportUserVote from '../../../app/service/user/vote';

declare module 'egg' {
  interface IService {
    accessCode: AutoInstanceType<typeof ExportAccessCode>;
    test: AutoInstanceType<typeof ExportTest>;
    admin: {
      candidate: AutoInstanceType<typeof ExportAdminCandidate>;
      election: AutoInstanceType<typeof ExportAdminElection>;
    }
    user: {
      auth: AutoInstanceType<typeof ExportUserAuth>;
      vote: AutoInstanceType<typeof ExportUserVote>;
    }
  }
}
