import { app, assert } from 'egg-mock/bootstrap';

describe('app/service', async () => {
  test('/Test', async () => {
    const ctx =  await app.mockContext();
    const result = await ctx.service.test.sayHi('foo');
    await assert(result === 'hi, foo');
  });
});
