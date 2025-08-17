import { DefaultConfig } from './config.default';

export default () => {
  const config: DefaultConfig = {};
  config.logger = {
    // 这么做的原因是将日志往stdout、stderr输出，方便在生产环境下由Docker logdrivers截获并生成docker logs，也方便fluentBit 收集传递给ES
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
    disableConsoleAfterReady: false,
  };

  config.mysql = {
    clients: {
      download_assistant: {
        host: '10.11.2.27',
        port: '3306',
        user: '',
        password: '',
        database: '',
      },
    },
    app: true,
    agent: false,
  };

  config.redis = {
    client: {
      port: 6379,
      host: '10.11.0.25',
      password: '',
      db: 2,
    },
  };

  config.cos = {
    defaultBucket: 'quqicom-1253287318',
  }
  config.useCosUrl = true;
  return config;
};
