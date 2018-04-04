const help = `
用户发送:   async_test
服务端返回: pong
`.trim();
module.exports = {
  help,
  async test({content}) {
    return await Promise.resolve(content === 'async test')
  },
  handle() {
    return 'pong';
  }
};
