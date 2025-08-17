// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportAdminCandidate from '../../../app/controller/admin/candidate';
import ExportAdminElection from '../../../app/controller/admin/election';
import ExportUserAuth from '../../../app/controller/user/auth';
import ExportUserVote from '../../../app/controller/user/vote';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    admin: {
      candidate: ExportAdminCandidate;
      election: ExportAdminElection;
    }
    user: {
      auth: ExportUserAuth;
      vote: ExportUserVote;
    }
  }
}
