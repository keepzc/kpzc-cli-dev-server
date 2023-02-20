/* eslint valid-jsdoc: "off" */

'use strict'
const {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_PWD,
  MYSQL_USER
} = require('./db.js')
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
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1665924887037_3563'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }
  // add websocket
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: []
      }
    }
  }
  config.redis = {
    client: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PWD,
      db: 0
    }
  }
  config.mysql = {
    client: {
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PWD,
      database: MYSQL_DB
    },
    app: true,
    agent: false
  }
  //missing csrf toke  不设置的会保持，临时使用，为了安全正式使用请设置true
  //CSRF是为了防止攻击，在发起请求前要在header里设置 x-csrf-token。x-csrf-token的值要后端取
  config.security = {
    csrf: {
      enable: false
    }
  }
  return {
    ...config,
    ...userConfig
  }
}
