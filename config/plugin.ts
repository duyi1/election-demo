import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  redis: {
    package: 'egg-redis',
  },
  mysql: {
    package: 'egg-mysql',
  },
};

export default plugin;
