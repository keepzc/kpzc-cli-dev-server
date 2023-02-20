const Controller = require('egg').Controller
const constant = require('../../const')
class ComponentsController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'get'
  }
  async create() {
    const { ctx } = this
    const { component, git } = ctx.request.body
    const timestamp = new Date().getTime()
    const componentData = {
      name: component.projectName,
      classname: component.className,
      description: component.description,
      npm_name: component.npmName,
      npm_version: component.npmVersion,
      git_type: git.type,
      git_remote: git.remote,
      git_owner: git.owner,
      git_login: git.login,
      status: constant.STATUS.ON,
      create_by: git.login,
      create_dt: timestamp,
      update_by: git.login,
      update_dt: timestamp
    }
    console.log(componentData)
    ctx.body = 'post'
  }
  async show() {
    const { ctx } = this
    ctx.body = 'get single'
  }
}

module.exports = ComponentsController
