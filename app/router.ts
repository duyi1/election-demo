import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const adminAuth = app.middleware.adminAuthMiddleware();
  const userAuth = app.middleware.userAuthMiddleware();
  router.get('/healthCheck', controller.home.index);

// 管理员路由
  router.post('/admin/election/create', adminAuth, controller.admin.election.create);
  router.post('/admin/election/start', adminAuth, controller.admin.election.start);
  router.post('/admin/election/end', adminAuth, controller.admin.election.end);
  router.get('/admin/election/results', adminAuth,controller.admin.election.getResults);
  router.post('/admin/candidates', adminAuth,controller.admin.candidate.add);
  router.get('/admin/candidates', adminAuth,controller.admin.candidate.list);
  router.get('/admin/candidate/status', adminAuth,controller.admin.candidate.getVoteDetail);
  router.get('/admin/election/vote_status', adminAuth, controller.admin.election.getAllVoteStatus);
  
  // 用户路由
  router.post('/user/register', controller.user.auth.register);
  router.post('/user/vote', userAuth, controller.user.vote.castVote);
  router.get('/user/election/status', userAuth, controller.user.vote.getAllVoteStatus);
};

