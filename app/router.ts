import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/healthCheck', controller.home.index);
  // router.get('/counter', controller.monitor.counter);
  // router.get('/gauge1', controller.monitor.gauge1);
  // router.get('/gauge2', controller.monitor.gauge2);
  // router.get('/histogram1', controller.monitor.histogram1);
  // router.get('/histogram2', controller.monitor.histogram2);
  // router.get('/summary', controller.monitor.summary);

  router.post('/downloadAssistantIntra/accessCode/create', controller.accessCode.createCode);
  router.post('/downloadAssistant/accessCode/check', controller.accessCode.checkCode);
  router.get('/downloadAssistant/fileList', controller.node.getNodeList);
  router.get('/downloadAssistant/file/download', controller.node.nodeDownload);
  router.get('/downloadAssistant/file/v2/download', controller.node.nodeDownloadV2);
};

