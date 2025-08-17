import { Application, Context } from 'egg';
import { Cruia } from './app/lib/curia';

export default class AppBootHook {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async willReady() {
    const ctx = this.app.createAnonymousContext();
    if (ctx.app.config.curia.enable) {
      await initCuria(ctx);
    }
  }
}

