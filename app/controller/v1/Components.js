const Controller = require('egg').Controller
const ComponentService = require('../../service/ComponentService')
const constant = require('../../const')
const { success, failed } = require('../../utils/request')
const VersionService = require('../../service/VersionService')

class ComponentsController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'get'
  }
  async create() {
    const { ctx, app } = this
    const { component, git } = ctx.request.body
    const timestamp = new Date().getTime()
    // 1 添加组件信息
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
    const componentService = new ComponentService(app)

    const haveComponentInDB = await componentService.queryOne({
      classname: componentData.classname
    })
    let componentId
    if (!haveComponentInDB) {
      componentId = await componentService.insert(componentData)
    } else {
      componentId = haveComponentInDB.id
    }
    if (!componentId) {
      failed('添加组件失败')
      return
    }
    //2. 添加组件多版本信息
    const versionData = {
      component_id: componentId,
      version: git.version,
      build_path: component.buildPath,
      example_path: component.examplePath,
      example_list: JSON.stringify(component.exampleList),
      status: constant.STATUS.ON,
      create_by: git.login,
      create_dt: timestamp,
      update_by: git.login,
      update_dt: timestamp
    }
    const versionService = new VersionService(app)
    const haveVersionInDB = versionService.queryOne({
      component_id: componentId,
      version: versionData.version
    })
    if (!haveVersionInDB) {
      const versionRes = await versionService.insert(versionData)
      if (!versionRes) {
        ctx.body = failed('添加组件失败')
        return
      }
    } else {
      // 跟新
      const updateData = {
        build_path: component.buildPath,
        example_path: component.examplePath,
        example_list: JSON.stringify(component.exampleList),
        update_by: git.login,
        update_dt: timestamp
      }
      const updateVersionRes = await versionService.update(updateData, {
        component_id: componentId,
        version: versionData.version
      })
      if (!updateVersionRes) {
        ctx.body = failed('跟新组件失败')
        return
      }
    }
  }
  async show() {
    const { ctx } = this
    ctx.body = 'get single'
  }
}

module.exports = ComponentsController
