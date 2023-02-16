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
  async put(object, localPath, options = {}) {
    await this.oss.put(object, localPath, options)
  }
}

module.exports = OSS
