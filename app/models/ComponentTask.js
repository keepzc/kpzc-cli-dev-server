'use strict'
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const Git = require('simple-git')
const userHome = require('user-home')
const { formatName } = require('../utils/index')
const OSS = require('./OSS')
const { OSS_COMPONENT_BUCKET } = require('../../config/db')

class ComponentTask {
  constructor(
    { repo, name, version, branch, buildPath, examplePath },
    { ctx }
  ) {
    this._ctx = ctx
    this._repo = repo
    this._name = formatName(name)
    this._version = version
    this._branch = branch
    this._dir = path.resolve(
      userHome,
      '.kpzc-cli-dev',
      'node_modules',
      `${this._name}@${this._version}`
    )
    this._sourceCodeDir = path.resolve(this._dir, this._name)
    this._buildPath = path.resolve(this._sourceCodeDir, buildPath)
    this._examplePath = path.resolve(this._sourceCodeDir, examplePath)
    this._buildDir = buildPath
    this._exampleDir = examplePath
    fse.ensureDirSync(this._dir)
    fse.emptyDirSync(this._dir)
    this._git = new Git(this._dir)
    this.oss = new OSS(OSS_COMPONENT_BUCKET)
    console.log(this)
  }
  async downloadSourceCode() {
    await this._git.clone(this._repo)
    this._git = new Git(this._sourceCodeDir)
    await this._git.checkout(['-b', this._branch, `origin/${this._branch}`])
    return fs.existsSync(this._sourceCodeDir)
  }
  async publishBuild() {
    return new Promise((resolve) => {
      require('glob')(
        '**',
        {
          cwd: this._buildPath,
          nodir: true,
          ignore: '**/node_modules/**'
        },
        (err, files) => {
          if (err) {
            resolve(false)
          } else {
            Promise.all(
              files.map(async (file) => {
                const filePath = path.resolve(this._buildPath, file)
                const uploadOSSRes = await this.oss.put(
                  `${this._name}@${this._version}/${this._buildDir}/${file}`,
                  filePath
                )
                return uploadOSSRes
              })
            )
              .then(() => {
                resolve(true)
              })
              .catch((err) => {
                this._ctx.logger.error(err)
                resolve(false)
              })
          }
        }
      )
    })
  }

  async publishExample() {
    return new Promise((resolve) => {
      require('glob')(
        '**',
        {
          cwd: this._examplePath,
          nodir: true,
          ignore: '**/node_modules/**'
        },
        (err, files) => {
          if (err) {
            resolve(false)
          } else {
            Promise.all(
              files.map(async (file) => {
                const filepath = path.resolve(this._examplePath, file)
                const uploadOssRes = await this.oss.put(
                  `${this._name}@${this._version}/${this._exampleDir}/${file}`,
                  filepath
                )
                return uploadOssRes
              })
            )
              .then(() => {
                resolve(true)
              })
              .catch((err) => {
                this._ctx.logger.error(err)
                resolve(false)
              })
          }
        }
      )
    })
  }
}

module.exports = ComponentTask
