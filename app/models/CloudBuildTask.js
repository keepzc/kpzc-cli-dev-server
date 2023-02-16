'use strict'
const fs = require('fs')
const path = require('path')
const userHome = require('os').homedir()
const fse = require('fs-extra')
const Git = require('simple-git')
const { SUCCESS, FAILED } = require('../const')

class CloudBuildTask {
  constructor(options, ctx) {
    this._ctx = ctx
    this._logger = this._ctx.logger
    this._repo = options.repo // 仓库地址
    this._name = options.name // 项目名称
    this._version = options.version // 项目版本
    this._branch = options.branch // 仓库分支号
    this._buildCmd = options.buildCmd // 构建命令
    //缓存目录
    this._dir = path.resolve(
      userHome,
      '.kpzc-cli-dev',
      'cloudbuild',
      `${this._name}@${this._version}`
    )
    this._sourceCodeDir = path.resolve(this._dir, this._name) // 缓存源码的目录
    this._logger.info('_dir', this._dir)
    this._logger.info('_sourceCodeDir', this._sourceCodeDir)
  }
  async prepare() {
    fse.ensureDirSync(this._dir)
    fse.emptyDirSync(this._dir)
    this._git = new Git(this._dir)
    return this.success()
  }
  success(message, data) {
    return this.response(SUCCESS, message, data)
  }
  async download() {
    await this._git.clone(this._repo)
    // 跟新 sample-git目录 当前目录下一级
    this._git = new Git(this._sourceCodeDir)
    // git checkout -b dev/1.1.1 origin/dev/1.1.1
    await this._git.checkout(['-b', this._branch, `origin/${this._branch}`])
    return fs.existsSync(this._sourceCodeDir) ? this.success() : this.failed()
  }
  failed(message, data) {
    return this.response(FAILED, message, data)
  }
  response(code, message, data) {
    return {
      code,
      message,
      data
    }
  }
}

module.exports = CloudBuildTask
