import { DefaultConfig } from './config.default';

export default () => {
  const config: DefaultConfig = {};
  config.mysql = {
  clients: {
    election: {
      host: '127.0.0.1',
      port: '3306',
      user: 'xxx',
      password: 'xxx',
      database: 'election',
    },
  },
  app: true,
  agent: false,
};

config.redis = {
  client: {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0,
  },
};
  return config;
};
