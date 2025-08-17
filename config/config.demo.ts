import { DefaultConfig } from './config.default';

export default () => {
  const config: DefaultConfig = {};

  config.mysql = {
    clients: {
      download_assistant: {
        host: '10.1.0.253',
        port: '3306',
        user: 'doc',
        password: 'doc',
        database: 'download_assistant',
      },
    },
    app: true,
    agent: false,
  };

  config.redis = {
    client: {
      port: 6380,
      host: '10.1.0.253',
      password: '',
      db: 3,
    },
  };
  config.useCosUrl = true;
  return config;
};
