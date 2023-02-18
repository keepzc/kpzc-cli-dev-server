'use strict'

const { Controller } = require('egg')
const mongo = require('../utils/mongo')
const config = require('../../config/db')
const OSS = require('../models/OSS')
const { success, failed } = require('../utils/request')

class ProjectController extends Controller {
  async getTemplate() {
    const { ctx } = this
    const data = await mongo().query('template')
    ctx.body = data
  }
  async getOSSProject() {
    const { ctx } = this
    let ossProjectType = ctx.query.type
    let ossProjectName = ctx.query.name
    if (!ossProjectName) {
      ctx.body = failed('项目名称不存在')
      return
    }
    if (!ossProjectType) {
      ossProjectType = 'prod'
    }
    let oss
    if (ossProjectType === 'prod') {
      oss = new OSS(config.OSS_PROD_BUCKET)
    } else {
      oss = new OSS(config.OSS_DEV_BUCKET)
    }
    if (oss) {
      const fileList = await oss.list(ossProjectName)
      ctx.body = success('获取项目文件成功', fileList)
    } else {
      ctx.body = success('获取项目文件失败')
    }
  }
  async getOSSFile() {
    const { ctx } = this
    const dir = ctx.query.name
    const file = ctx.query.file
    let ossProjectType = ctx.query.type
    if (!dir || !file) {
      ctx.body = failed('请提供OSS文件名称')
    }
    if (!ossProjectType) {
      ossProjectType = 'prod'
    }
    let oss
    if (ossProjectType === 'prod') {
      oss = new OSS(config.OSS_PROD_BUCKET)
    } else {
      oss = new OSS(config.OSS_DEV_BUCKET)
    }
    if (oss) {
      const fileList = await oss.list(dir)
      const fileName = `${dir}/${file}`
      const finalFile = fileList.find((item) => item.name === fileName)
      ctx.body = success('获取项目文件成功', finalFile)
    } else {
      ctx.body = failed('获取项目失败')
    }
  }
  async getRedis() {
    const { ctx, app } = this
    const test = await app.redis.get('test')
    ctx.body = test
  }
}

module.exports = ProjectController
