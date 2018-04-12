const debug = require('debug')('italk:test');
const nanoid = require('nanoid');

const mockRes = () => {
  let ret;
  return {
    reply: (text) => {
      debug(ret = text);
    },
    articles(items) {
      this.reply([].concat(items));
    },
    get val() {
      return ret
    }

  }
};

const mockReq = ({c: Content, u: FromUserName = 'test', id: MsgId = nanoid()}) => {
  return {
    weixin: {
      MsgId,
      Content, FromUserName,
      content: Content,
      user: FromUserName
    }
  }
};

const handleMsg = async (handle, msg, cb) => {
  const req = mockReq(msg);
  const res = mockRes();
  if (handle.test && handle.handle) {
    handle = require('../../lib/')(handle);
  }
  const canHandleError = cb.length === 4;

  try {
    const handled = await handle(req, res, req.weixin);
    return canHandleError ? cb(null, req, res, handled) : cb(req, res, handled);
  } catch (e) {
    if (cb.length !== 4) {
      throw new Error(`handler报错，cb函数只接收${cb.length}个参数`)
    }
    cb(e, req, res, true);
  }
};

/**
 * 暴露给全局变量
 */
Object.assign(global, {mockRes, mockReq, handleMsg});
