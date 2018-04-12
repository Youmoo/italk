describe('italk', () => {
  const handler = require('../')(__dirname + '/handlers');

  it('sync', async () => {
    return handleMsg(handler, {c: 'ping'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });


  it('async_test', async () => {
    return handleMsg(handler, {c: 'async test'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });


  it('async_handle', async () => {
    return handleMsg(handler, {c: 'async handle'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

  it('async_all', async () => {
    return handleMsg(handler, {c: 'async all'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

  it('sync_callback', async () => {
    return handleMsg(handler, {c: 'sync callback'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

  it('async_callback', async () => {
    return handleMsg(handler, {c: 'async callback'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong');
    });
  });

  it('timeout:3', async () => {

    const expected = ['任务完成'];
    let i = 1;
    for (; i <= 3; i++) {
      const val = await handleMsg(handler, {c: 'timeout:3', id: 1}, async (req, res, handled) => {
        expect(handled).toBe(true);
        const val = await res.val;
        expect(val).toBe(expected[i - 1]);
        return val;
      });
      if (val === '任务完成') {
        break;
      }
    }
    expect(i).toBe(1);

  });

  it('timeout:6', async () => {
    const expected = [void 0, '任务完成'];
    let i = 1;
    for (; i <= 3; i++) {
      const val = await handleMsg(handler, {c: 'timeout:6', id: 2}, async (req, res, handled) => {
        expect(handled).toBe(true);
        const val = await res.val;
        expect(val).toBe(expected[i - 1]);
        return val;
      });
      if (val === '任务完成') {
        break;
      }
    }
    expect(i).toBe(2);
  }, 10 * 1000);

  it('timeout:14', async () => {

    const expected = [void 0, void 0, '任务完成'];
    let i = 1;
    for (; i <= 3; i++) {
      const val = await handleMsg(handler, {c: 'timeout:14', id: 3}, async (req, res, handled) => {
        expect(handled).toBe(true);
        const val = await res.val;
        expect(val).toBe(expected[i - 1]);
        return val;
      });
      if (val === '任务完成') {
        break;
      }
    }
    expect(i).toBe(3);

  }, 15 * 1000);

  it('timeout:16', async () => {

    const expected = [void 0, void 0, '任务超时'];
    let i = 1;
    for (; i <= 3; i++) {
      const val = await handleMsg(handler, {c: 'timeout:16', id: 4}, async (req, res, handled) => {
        expect(handled).toBe(true);
        const val = await res.val;
        expect(val).toBe(expected[i - 1]);
        return val;
      });
      if (val === '任务完成') {
        break;
      }
    }
    expect(i).toBe(4);

  }, 20 * 1000);

});
