const fs = require("fs");
const debug = require('debug')('italk:parser');
const TimeoutHandler = require('./TimeoutHandler');

/**
 * 加载消息处理器并进行分组
 *
 * @param dir 消息处理器所在路径或消息处理器本身
 * @param test 过滤器，用于过滤掉不需要的处理器
 * @returns {{keywords: {}, tests: Array}}
 */
module.exports = function resolve(dir, test) {

  if (!test) {
    test = () => true
  }
  if (typeof test !== 'function') {
    throw new Error("Parameter `test` must be a function")
  }

  // 所有的消息处理器
  const msg_handlers = [];

  if (dir.test && dir.handle) {
    msg_handlers.push(dir);
  }
  else if (fs.lstatSync(dir).isFile()) {
    msg_handlers.push(require(dir));
  } else {
    (function load(dir, dirs, nest) {
      fs.readdirSync(dir).forEach(function (file) {
        if (!test(dir + '/' + file)) {
          return;
        }
        try {
          msg_handlers.push(require(dir + '/' + file));
          debug('-'.repeat(nest) + ' ' + file);
        } catch (e) {
          if (e.code === 'MODULE_NOT_FOUND') {// 没有index.js
            debug('文件夹: %s', dirs.concat(file).join('/'));
            load(dir + '/' + file, dirs.concat(file), nest + 1);
          } else {
            throw e;
          }
        }
      });
    })(dir, [], 1);
  }


  // 关键词消息处理器
  const keywords = {};
  // test函数消息处理器
  const tests = [];

  // 帮助文档
  const helps = [];

  msg_handlers.forEach(handler => {
    const {test, help} = handler;
    if (!test) {
      debug('不支持的test类型: %o', test);
      return;
    }
    handler = decorate(handler);
    help && helps.push(help);
    (Array.isArray(test) ? test : [test]).forEach(kw => {

      if (typeof kw === 'string') {
        if (keywords[kw]) {
          console.warn('keyword重复: %o %o', handler, kw);
        }
        keywords[kw] = handler;
      } else if (kw instanceof RegExp) {
        tests.push({
          test(msg) {
            // global为true时，regexp是stateful的，需要重新构造
            return (kw.global ? new RegExp(kw.source) : kw).test(msg.content);
          },
          handle: handler.handle
        })
      } else if (typeof kw === 'function') {
        tests.push(handler);
      } else {
        debug('不支持的keyword类型: %o', kw)
      }
    });
  });

  const help_text = helps.join('\n\n');
  keywords.man = {
    test: 'man',
    handle() {
      return help_text;
    }
  };

  return {keywords, tests, helps};
};


/**
 * 让handler支持消息重试
 */
function decorate(handler) {
  if (!handler.handleTimeout) {
    return handler;
  }
  const {handle} = handler;

  if (handle.length === 0) {
    debug('handler.handle必须至少有一个入参: %o', handler);
    return handler;
  }

  const handlers = Object.create(null);
  handler.handle = async (...args) => {
    const {MsgId} = args[args.length - 1];
    const handler = handlers[MsgId] || new TimeoutHandler({
      msgId: MsgId,
      handle: () => {
        return handle(...args)
      }
    });
    handlers[MsgId] = handler;
    const re = await handler.handle();
    if (re) {
      handlers[MsgId] = null;
    }
    return re;
  };

  return handler;

}
