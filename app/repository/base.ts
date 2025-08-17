import { Context } from 'egg';

export default class Base {
  protected ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  get cache() {
    return this.ctx.app.redis;
  }
  get DB() {
    const db = this.ctx.app.mysql.get('election') as any;
    return db;
  }
}
