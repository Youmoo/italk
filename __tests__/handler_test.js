describe('italk', () => {
  const handler = require('../')(__dirname + '/handlers');

  it('sync', async () => {
    handleMsg(handler, {c: 'ping'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });


  it('async_test', async () => {
    handleMsg(handler, {c: 'async test'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });


  it('async_handle', async () => {
    handleMsg(handler, {c: 'async handle'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

  it('async_all', async () => {
    handleMsg(handler, {c: 'async all'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

  it('sync_callback', async () => {
    handleMsg(handler, {c: 'sync callback'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

  it('async_callback', async () => {
    handleMsg(handler, {c: 'async callback'}, async (req, res, handled) => {
      expect(handled).toBe(true);
      const val = await res.val;
      expect(val).toBe('pong')
    });
  });

});
