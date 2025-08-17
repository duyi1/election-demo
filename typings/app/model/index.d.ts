// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccessCode from '../../../app/model/accessCode';
import ExportAuthFilesFatory from '../../../app/model/authFilesFatory';
import ExportAuthorizedFiles from '../../../app/model/authorizedFiles';
import ExportCandidate from '../../../app/model/candidate';
import ExportElection from '../../../app/model/election';
import ExportParentNodeAuthorizedFiles from '../../../app/model/parentNodeAuthorizedFiles';
import ExportUser from '../../../app/model/user';
import ExportVoteRecord from '../../../app/model/vote_record';
import ExportCdnCdnCollection from '../../../app/model/cdn/cdnCollection';
import ExportCdnCdnDownload from '../../../app/model/cdn/cdnDownload';
import ExportNodeCos from '../../../app/model/node/cos';
import ExportNodeNodeInfo from '../../../app/model/node/nodeInfo';
import ExportNodeResource from '../../../app/model/node/resource';

declare module 'egg' {
  interface IModel {
    AccessCode: ReturnType<typeof ExportAccessCode>;
    AuthFilesFatory: ReturnType<typeof ExportAuthFilesFatory>;
    AuthorizedFiles: ReturnType<typeof ExportAuthorizedFiles>;
    Candidate: ReturnType<typeof ExportCandidate>;
    Election: ReturnType<typeof ExportElection>;
    ParentNodeAuthorizedFiles: ReturnType<typeof ExportParentNodeAuthorizedFiles>;
    User: ReturnType<typeof ExportUser>;
    VoteRecord: ReturnType<typeof ExportVoteRecord>;
    Cdn: {
      CdnCollection: ReturnType<typeof ExportCdnCdnCollection>;
      CdnDownload: ReturnType<typeof ExportCdnCdnDownload>;
    }
    Node: {
      Cos: ReturnType<typeof ExportNodeCos>;
      NodeInfo: ReturnType<typeof ExportNodeNodeInfo>;
      Resource: ReturnType<typeof ExportNodeResource>;
    }
  }
}
