import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
 alinode: {
    enable: false,
    package: 'egg-alinode',
  },
  // prom: {
  //   enable: false,
  //   package: 'egg-prom',
  // },
  redis: {
    package: 'egg-redis',
  },
  mysql: {
    package: 'egg-mysql',
  },
};

export default plugin;
