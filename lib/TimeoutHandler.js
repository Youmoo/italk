const debug = require('debug')('italk:timeout');

const TIMEOUT_PER_OP = 4950;
const ON_TIMEOUT = (counter) => {
  return counter === 3 ? '任务超时' : void 0;
};

/**
 * 用来处理超时(消息重试时的处理逻辑)
 */
class TimeoutHandler {
  constructor({msgId, handle, timeout = TIMEOUT_PER_OP, onTimeout = ON_TIMEOUT}) {
    this.msgId = msgId;
    this.counter = 0;
    this.result = null;// 最终的执行结果
    this._handle = handle;
    this.timeout = timeout;
    this.onTimeout = onTimeout;
  }

  async handle() {
    const counter = ++this.counter;
    if (counter === 1) {
      debug(`开始执行任务 id-> ${this.msgId}`);
      this.result = this._handle();
    }
    debug(`第${counter}次执行 id-> ${this.msgId} `);
    return await Promise.race([this.result, new Promise(res => {
      setTimeout(() => {
        debug('超时: ', counter);
        res(this.onTimeout(counter))
      }, this.timeout);
    })]);
  }
}

module.exports = TimeoutHandler;
