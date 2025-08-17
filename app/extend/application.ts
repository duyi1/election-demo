import CDNCollection from '../model/cdn/cdnCollection';
import COS = require('cos-nodejs-sdk-v5');

const cdnCollectionSymbol = Symbol('CDNCONNECTIONINSTANCE');
const cosClientSymbol = Symbol('COS_CLIENT_SYMBOL');

const app: any = {
  get cdnCollection () {
    if (!this[cdnCollectionSymbol]) {
      const ctx = this.createAnonymousContext();
      this[cdnCollectionSymbol] = new CDNCollection(ctx);
      return this[cdnCollectionSymbol];
    }
    return this[cdnCollectionSymbol];

  },
  get cosClient() {
    if (!this[cosClientSymbol]) {
      const ctx = this.createAnonymousContext();
      this[cosClientSymbol] = new COS({
        SecretId: ctx.app.config.cosConfig.SecretId,
        SecretKey: ctx.app.config.cosConfig.SecretKey,
      });
      return this[cosClientSymbol];
    }
    return this[cosClientSymbol];
  },
};

export default app;
