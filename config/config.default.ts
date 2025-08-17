import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { PlainObject } from '../typings/app';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
  sourceUrl: string;
}

export default (appInfo: EggAppInfo) => {
  // tslint:disable-next-line:no-object-literal-type-assertion
  const config = {} as PowerPartial<EggAppConfig> & PlainObject;
  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1528877296520_8695';

  // add your config here
  config.middleware = [];
  config.loginUrl = '/p/login.html';
  config.logrotator = {
    maxDays: 7, // 与ES retainHours 360h 保持一致
  };

  config.nodeList = {
    offset: 0,
    limit: 1000,
  }
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
    disableConsoleAfterReady: false,
  };
  config.proxy = true;
  config.useCosUrl = false;
  return config;
};
