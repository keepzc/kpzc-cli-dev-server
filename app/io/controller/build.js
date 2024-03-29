'use strict'

const { createCloudBuildTask } = require('../../models/CloudBuildTask')

const { FAILED } = require('../../const')

async function prepare(cloudBuildTask, socket, helper) {
  socket.emit(
    'build',
    helper.parseMsg('prepare', {
      message: '开始执行构建前准备工作'
    })
  )
  const prepareRes = await cloudBuildTask.prepare()
  if (!prepareRes || prepareRes.code === FAILED) {
    socket.emit(
      'build',
      helper.parseMsg('prepare failed', {
        message: '执行构建前准备工作失败'
      })
    )
    return
  }
  socket.emit(
    'build',
    helper.parseMsg('prepare', {
      message: '构建前准备工作成功'
    })
  )
}
async function download(cloudBuildTask, socket, helper) {
  socket.emit(
    'build',
    helper.parseMsg('download repo', {
      message: '开始下载源码'
    })
  )
  const downloadRes = await cloudBuildTask.download()
  if (!downloadRes || downloadRes.code === FAILED) {
    socket.emit(
      'build',
      helper.parseMsg('download failed', {
        message: '源码下载失败'
      })
    )
    return
  } else {
    socket.emit(
      'build',
      helper.parseMsg('download repo', {
        message: '源码下载成功'
      })
    )
  }
}

async function install(cloudBuildTask, socket, helper) {
  socket.emit(
    'build',
    helper.parseMsg('install dependencies', {
      message: '项目开始安装依赖'
    })
  )
  const installRes = await cloudBuildTask.install()
  if (!installRes || installRes.code === FAILED) {
    socket.emit(
      'build',
      helper.parseMsg('install failed', {
        message: '项目安装依赖失败'
      })
    )
    return
  } else {
    socket.emit(
      'build',
      helper.parseMsg('install dependencies', {
        message: '项目安装依赖成功'
      })
    )
  }
}

async function build(cloudBuildTask, socket, helper) {
  socket.emit(
    'build',
    helper.parseMsg('build', {
      message: '开始启动云构建'
    })
  )
  const buildRes = await cloudBuildTask.build()
  if (!buildRes || buildRes.code === FAILED) {
    socket.emit(
      'build',
      helper.parseMsg('build failed', {
        message: '云构建任务执行失败'
      })
    )
    return
  } else {
    socket.emit(
      'build',
      helper.parseMsg('build', {
        message: '云构建任务执行成功'
      })
    )
  }
}

async function prePublish(cloudBuildTask, socket, helper) {
  socket.emit(
    'build',
    helper.parseMsg('pre-publish', {
      message: '开始发布前预检查'
    })
  )
  const prePublishRes = await cloudBuildTask.prePublish()
  if (!prePublishRes || prePublishRes.code === FAILED) {
    socket.emit(
      'build',
      helper.parseMsg('pre-publish failed', {
        message:
          '发布前预检查执行失败, 失败原因：' +
          (prePublishRes && prePublishRes.message
            ? prePublishRes.message
            : '未知错误')
      })
    )
    throw new Error('发布终止')
  } else {
    socket.emit(
      'build',
      helper.parseMsg('pre-publish', {
        message: '发布前预检查通过'
      })
    )
  }
}
async function publish(cloudBuildTask, socket, helper) {
  socket.emit(
    'build',
    helper.parseMsg('publish', {
      message: '开始发布项目'
    })
  )
  const publishRes = await cloudBuildTask.publish()
  if (!publishRes) {
    socket.emit(
      'build',
      helper.parseMsg('publish failed', {
        message: '发布项目失败'
      })
    )
    return
  } else {
    socket.emit(
      'build',
      helper.parseMsg('publish', {
        message: '发布项目成功'
      })
    )
  }
}

module.exports = (app) => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this
      const { socket, helper } = ctx
      const cloudBuildTask = await createCloudBuildTask(ctx, app)
      try {
        await prepare(cloudBuildTask, socket, helper)
        await download(cloudBuildTask, socket, helper)
        await install(cloudBuildTask, socket, helper)
        await build(cloudBuildTask, socket, helper)
        await prePublish(cloudBuildTask, socket, helper)
        await publish(cloudBuildTask, socket, helper)
        // 断开websocket连接
        socket.emit(
          'build',
          helper.parseMsg('build success', {
            message: `云构建成功， 访问连接：https://${
              cloudBuildTask.isProd() ? 'keep-cli-sync' : 'keep-cli-sync-dev'
            }.lovedl.xyz/${cloudBuildTask._name}`
          })
        )
        socket.disconnect()
      } catch (e) {
        socket.emit(
          'build',
          helper.parseMsg('error', {
            message: '云构建失败，失败原因' + e.message
          })
        )
        socket.disconnect()
      }
    }
  }

  return Controller
}
