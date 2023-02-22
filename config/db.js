'use strict'
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
/**Mongodb */
const mongodbUrl = 'mongodb://kpzc:123456@lovedl.keepzc.xyz:27017/kpzc-cli'
const mongodbName = 'kpzc-cli'
/**OSS */
const OSS_ACCESS_KEY = 'LTAI5tQWhW19jcYjKxHMB2Ch'
const OSS_ACCESS_SECRET_KEY = fs
  .readFileSync(
    path.resolve(userHome, '.kpzc-cli-dev', 'oss_access_secret_key')
  )
  .toString()
const OSS_PROD_BUCKET = 'keep-cli-sync'
const OSS_DEV_BUCKET = 'keep-cli-sync-dev'
const OSS_COMPONENT_BUCKET = 'keep-cli-component'
const OSS_REGION = 'oss-cn-beijing'
/** MYSQL */
const MYSQL_HOST = '43.143.251.28'
const MYSQL_PORT = 3307
const MYSQL_USER = 'root'
const MYSQL_PWD = fs
  .readFileSync(path.resolve(userHome, '.kpzc-cli-dev', 'mysql_password'))
  .toString()
  .trim()
const MYSQL_DB = 'keep-cli-dev'
module.exports = {
  mongodbUrl,
  mongodbName,
  OSS_ACCESS_KEY,
  OSS_ACCESS_SECRET_KEY,
  OSS_PROD_BUCKET,
  OSS_DEV_BUCKET,
  OSS_COMPONENT_BUCKET,
  OSS_REGION,
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_PWD,
  MYSQL_USER
}
