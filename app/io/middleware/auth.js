// app/io/middleware/auth.js
'use strict'
const REDIS_PREFIX = 'cloudbuild'
module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx
    const { id } = socket
    const { redis } = app
    // 获取客户端传过来的数据
    const query = socket.handshake.query
    try {
      socket.emit(
        id,
        helper.parseMsg('connect', {
          type: 'connect',
          message: '云构建服务连接成功'
        })
      )
      let hasTask = await redis.get(`${REDIS_PREFIX}:${id}`)
      if (!hasTask) {
        await redis.set(`${REDIS_PREFIX}:${id}`, JSON.stringify(query))
      }
      hasTask = await redis.get(`${REDIS_PREFIX}:${id}`)
      if (!hasTask) {
        logger.error('redis reeor', 'Redis服务异常,请重新启动redis!')
      }
      await next()
      console.log('disconnect!')
    } catch (e) {
      logger.error('build error', e.message)
    }
  }
}
