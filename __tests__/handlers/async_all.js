const help = `
用户发送:   async_all
服务端返回: pong
`.trim();

module.exports = {
  help,
  async test({content}) {
    return await Promise.resolve(content === 'async all')
  },
  async handle() {
    return await Promise.resolve('pong');
  }
};
