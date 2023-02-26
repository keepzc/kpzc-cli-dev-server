'use strict'

const { Controller } = require('egg')
const mongo = require('../utils/mongo')
class SectionController extends Controller {
  async getTemplate() {
    const { ctx } = this
    const data = await mongo().query('section')
    ctx.body = data
  }
}

module.exports = SectionController
