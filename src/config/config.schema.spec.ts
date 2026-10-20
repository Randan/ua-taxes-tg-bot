import { configValidationSchema } from './config.schema';

const env = { BOT_TOKEN: 't', TAX_EN_PERCENT: '5', TAX_ESV: '1902.34', TAX_MILITARY_PERCENT: '1' };

describe('configValidationSchema', () => {
  it('fills the defaults', () => {
    expect(configValidationSchema(env)).toMatchObject({ PORT: 3000, NODE_ENV: 'production', TAX_ESV: '1902.34' });
  });

  it.each(Object.keys(env))('requires %s', key => {
    expect(() => configValidationSchema({ ...env, [key]: '' })).toThrow(`Missing required env: ${key}`);
  });

  it.each(['abc', '-1'])('rejects a tax rate of %s', value => {
    expect(() => configValidationSchema({ ...env, TAX_ESV: value })).toThrow('TAX_ESV must be a non-negative number');
  });
});
