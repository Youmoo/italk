const help = `
用户发送:   async_handle
服务端返回: pong
`.trim();
module.exports = {
  help,
  test: 'async handle',
  async handle() {
    return await Promise.resolve('pong');
  }
};
