const debug = require('debug')('italk:timeout');

/**
 * 测试超时
 */
module.exports = {
  test: /^timeout:[1-9]{1,2}$/,
  handleTimeout: true,
  handle({MsgId, content}) {
    const duration = +content.split(':')[1];
    return new Promise((res) => {
      setTimeout(() => {
        res('任务完成')
      }, duration * 1000)
    })
  }
};
