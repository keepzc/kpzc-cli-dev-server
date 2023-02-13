// app/io/middleware/auth.js
'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const {socket, logger} = ctx
    const query = socket.handshake.query
    logger.info('query', query)
    await next();
    console.log('disconnect!');
  };
};
