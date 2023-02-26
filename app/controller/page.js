'use strict'

const { Controller } = require('egg')
const mongo = require('../utils/mongo')
class PageController extends Controller {
  async getTemplate() {
    const { ctx } = this
    const data = await mongo().query('page')
    ctx.body = data
  }
}

module.exports = PageController
