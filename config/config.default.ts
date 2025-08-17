import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { PlainObject } from '../typings/app';


export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

export interface BizConfig {
  sourceUrl: string;
}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig> & PlainObject;

  config.middleware = [];

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
  return config;
};
