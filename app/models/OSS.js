'use strict'

const config = require('../../config/db')

class OSS {
  constructor(bucket) {
    this.oss = require('ali-oss')({
      accessKeyId: config.OSS_ACCESS_KEY,
      accessKeySecret: config.OSS_ACCESS_SECRET_KEY,
      bucket,
      region: config.OSS_REGION
    })
  }
}

module.exports = OSS
