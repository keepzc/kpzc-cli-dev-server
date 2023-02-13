/* eslint valid-jsdoc: "off" */

'use strict';
const REDIS_PORT = 6379
const REDIS_HOST = '127.0.0.1'
const REDIS_PWD = ''
// aliyun
// const REDIS_PORT = 6379
// const REDIS_HOST = '47.93.58.48'
// const REDIS_PWD = ''
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1665924887037_3563';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // add websocket
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      }
    },
  };
  config.redis = {
    client: {
      port: REDIS_PORT,         
      host: REDIS_HOST,
      password: REDIS_PWD,
      db: 0,
    },
  }

  return {
    ...config,
    ...userConfig,
  };
};
