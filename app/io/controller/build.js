'use strict';

const CloudBuildTask = require('../../models/CloudBuildTask')
const REDIS_PREFIX = "cloudbuild"

async function createCloudBuildTask(ctx, app) {
  const {socket, helper} = ctx
  const client = socket.id 
  const redisKey = `${REDIS_PREFIX}:${client}`
  const redisTask = await app.redis.get(redisKey)
  const task = JSON.parse(redisTask)
  socket.emit('build', helper.parseMsg('create task', {
    message:'创建云构建任务成功'
  }))
  return new CloudBuildTask({
    repo: task.repo,
    name: task.name,
    version: task.version,
    branch: task.branch,
    buildCmd: task.buildCmd
  })
}

module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this;
      const { socket, helper } = ctx
     const cloudBuildTask = await createCloudBuildTask(ctx, app)
    }
  }

  return Controller;
};
