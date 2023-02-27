'use strict'
const Controller = require('egg').Controller
const axios = require('axios')
const ComponentService = require('../../service/ComponentService')
const constant = require('../../const')
const { success, failed } = require('../../utils/request')
const VersionService = require('../../service/VersionService')
const { formatName } = require('../../utils/index')
const ComponentTask = require('../../models/ComponentTask')
const { decode } = require('js-base64')

class ComponentsController extends Controller {
  async index() {
    const { ctx, app } = this
    const { name } = ctx.query
    const andWhere = name ? `AND c.name LIKE '%${name}%'` : ''
    const sql = `SELECT c.id,c.name,c.classname, c.description, c.npm_name, c.npm_version, c.git_type, c.git_remote,c.git_owner,c.git_login,c.create_dt,c.update_dt,v.version,v.build_path,v.example_path, v.example_list
    FROM component As c LEFT JOIN version as v ON c.id = v.component_id
    WHERE c.status = 1 AND v.status = 1 ${andWhere}
    ORDER BY c.create_dt, v.version DESC`
    const result = await app.mysql.query(sql)
    const componnets = []
    result.forEach((component) => {
      let hasComponent = componnets.find((item) => item.id === component.id)
      if (!hasComponent) {
        hasComponent = {
          ...component
        }
        delete hasComponent.version
        delete hasComponent.build_path
        delete hasComponent.example_list
        delete hasComponent.example_path
        hasComponent.version = []
        componnets.push(hasComponent)
        hasComponent.version.push({
          version: component.version,
          build_path: component.build_path,
          example_path: component.example_path,
          example_list: component.example_list
        })
      } else {
        hasComponent.version.push({
          version: component.version,
          build_path: component.build_path,
          example_path: component.example_path,
          example_list: component.example_list
        })
      }
    })
    ctx.body = componnets
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
    const haveVersionInDB = await versionService.queryOne({
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
        ctx.body = failed('更新新组件失败')
        return
      }
    }
    //3. 像OSS中上传组件预览文件
    const task = new ComponentTask(
      {
        repo: git.remote,
        version: git.version,
        name: component.className,
        branch: git.branch,
        buildPath: component.buildPath,
        examplePath: component.examplePath
      },
      { ctx }
    )
    try {
      //3.1 .下载和构建源码
      await task.downloadSourceCode()
      //3.2 上传组件构建结果
      await task.publishBuild()
      //3.3 上传组件多预览文件
      await task.publishExample()
      ctx.body = success('添加组件成功', {
        component: await componentService.queryOne({ id: componentId }),
        version: await versionService.queryOne({
          component_id: componentId,
          version: versionData.version
        })
      })
    } catch (e) {
      ctx.logger.error(e)
      ctx.body = failed('添加组件失败' + e.message)
    }
  }
  async show() {
    const { ctx, app } = this
    const id = ctx.params.id
    const result = await app.mysql.select('component', {
      where: { id }
    })
    if (result && result.length > 0) {
      const component = result[0]
      component.versions = await app.mysql.select('version', {
        where: {
          component_id: id
        },
        orders: [['version', 'desc']]
      })
      //gitee: https://gitee.com/api/v5/repos/{owner}/{repo}/contents(/{path})
      //github: https://api.github.com/repos/{owner}/{repo}/{path}
      let readmeUrl
      const name = formatName(component.classname)
      if (component.git_type === 'gitee') {
        readmeUrl = `https://gitee.com/api/v5/repos/${component.git_login}/${name}/contents/README.md`
      } else {
        readmeUrl = `https://api.github.com/repos/${component.git_login}/${name}/readme`
      }
      const readme = await axios.get(readmeUrl)
      if (readme.status === 200) {
        let content = readme.data && readme.data.content
        if (content) {
          content = decode(content)
          component.readme = content
        }
      } else {
        component.readme = '暂无'
      }
      ctx.body = component
    } else {
      ctx.body = {}
    }

    ctx.body = result
  }
}

module.exports = ComponentsController
