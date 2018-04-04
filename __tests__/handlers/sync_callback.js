const help = `
用户发送:   ping
服务端返回: pong
`.trim();

module.exports = {
  help,
  test({content}, cb) {
    if (content === 'sync callback') {
      cb();
    }
  },
  handle() {
    return 'pong';
  }
};
