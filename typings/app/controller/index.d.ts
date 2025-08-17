// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccessCode from '../../../app/controller/accessCode';
import ExportHome from '../../../app/controller/home';
import ExportNode from '../../../app/controller/node';

declare module 'egg' {
  interface IController {
    accessCode: ExportAccessCode;
    home: ExportHome;
    node: ExportNode;
  }
}
