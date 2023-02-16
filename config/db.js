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
const OSS_REGION = 'oss-cn-beijing'
module.exports = {
  mongodbUrl,
  mongodbName,
  OSS_ACCESS_KEY,
  OSS_ACCESS_SECRET_KEY,
  OSS_PROD_BUCKET,
  OSS_DEV_BUCKET,
  OSS_REGION
}
