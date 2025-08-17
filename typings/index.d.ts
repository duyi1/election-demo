import {Redis} from 'ioredis';
import { Cruia } from '../app/lib/curia';
import CDNCollection from '../app/model/cdn/cdnCollection';

declare module 'egg' {
  interface Application {
    redis: Redis;
    mysql: any;
    curia: Cruia;
    cdnCollection: CDNCollection;
  }
}