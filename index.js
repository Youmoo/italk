'use strict';

const debug = require('debug')('italk:handler');

const parse = require('./lib/index');

module.exports = (dir, test) => {

  const handle = parse(dir, test);

  return async function italk(req, res) {

    // 微信输入信息都在req.weixin上
    const message = req.weixin;

    message.user = message.FromUserName;
    message.content = message.Content || '';

    try {
      const handled = await handle(req, res, message);
      if (!handled) {
        res.reply('您好，暂不支持该次对话');
      }
      debug(JSON.stringify(message, null, 2));
      debug('handled: ', handled);
      return handled;
    } catch (e) {
      res.reply('报错啦: ' + e.message);
      debug('error: ', e);
    }
    return true;
  }
};
