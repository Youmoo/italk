微信消息处理器
=======

配合[wechat](https://github.com/node-webot/wechat)使用.

支持的消息格式见[这里](__tests__/handlers)



### 使用方法

```js
const italk = require("italk");
const handler_path = "path/to/your/handlers";
const handler = italk(handler_path);

const express = require("express");
const router = express.Router();
const wechat = require("wechat");

const config = {
  token: "",
  appid: "",
  encodingAESKey: ""
};

router.use(wechat(config, handler));
```
