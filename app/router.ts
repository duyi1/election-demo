import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/healthCheck', controller.home.index);

// 管理员路由
  router.post('/admin/election/start', controller.admin.election.start);
  router.post('/admin/election/end', controller.admin.election.end);
  router.get('/admin/election/results', controller.admin.election.getResults);
  router.post('/admin/candidates', controller.admin.candidate.add);
  router.get('/admin/candidates', controller.admin.candidate.list);
  
  // 用户路由
  router.post('/user/register', controller.user.auth.register);
  router.post('/user/vote', controller.user.vote.castVote);
  router.get('/election/status', controller.user.vote.getStatus);
};

