const debug = require('debug')('italk:timeout');

/**
 * 测试超时,handle函数支持变参
 */
module.exports = {
  test: /^timeout_varargs:[1-9]{1,2}$/,
  handleTimeout: true,
  handle(req, res, {MsgId, content}) {
    const duration = +content.split(':')[1];
    return new Promise((res) => {
      setTimeout(() => {
        res('任务完成')
      }, duration * 1000)
    })
  }
};
