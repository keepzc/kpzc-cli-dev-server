'use strict'

const { Controller } = require('egg')
const mongo = require('../utils/mongo')
class ProjectController extends Controller{
    async getTemplate(){
        const {ctx} = this
        const data = await mongo().query('template')
        ctx.body = data
    }
    async getRedis(){
        const {ctx, app} = this
        const test = await app.redis.get('test')
        ctx.body = test
    }
}

module.exports = ProjectController
