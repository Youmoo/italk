'use strict';


/**
 *
 * @param dir 消息处理器所在要路径
 * @param test 过滤器，用于过滤掉不需要的处理器
 * @returns {handle}
 */
module.exports = (dir, test) => {

  const {keywords, tests} = require('./parser')(dir, test);

  /**
   * @param req 用户请求
   * @param res 回复
   * @param msg 消息体
   * @returns {boolean} true: 消息被处理; false: 消息未被处理
   */
  return async function handle(req, res, msg) {
    const {content} = msg;
    // 先从关键词中取
    const handler = keywords[content];
    if (handler) {
      return await apply(handler);
    }
    // 再从test函数中取
    for (let h of tests) {
      if (h.test.length === 1) {
        if (await h.test(msg)) {
          return await apply(h);
        }
      } else {
        const [check, result] = [] = await new Promise((res, rej) => {
          h.test(msg, (check) => {
            check !== false ? res([true, apply(h)]) : res([false])
          });
        });
        if (check) {
          return await result;
        }
      }

    }
    return false;

    // 执行选中的消息处理器
    async function apply(handler) {
      const result = handler.handle.length <= 1 ? handler.handle(msg) : handler.handle(req, res, msg);
      if (result !== null && result !== undefined) {
        const r = await result;
        if (r !== undefined) {
          if (typeof r === 'object') {
            res.reply(Array.isArray(r) ? r : [r]);
          } else {
            // 有些handler可能会返回数字，有必要在这里进行string转化
            res.reply(String(r));
          }
        }
      }
      return true;
    }

  }
};
