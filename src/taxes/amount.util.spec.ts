import { parseAmount } from './amount.util';

describe('parseAmount', () => {
  it.each([
    ['25000', 25000],
    ['25 000', 25000],
    ['25 000', 25000],
    ["25'000", 25000],
    ['25000.50', 25000.5],
    ['25000,50', 25000.5],
    ['25 000,50', 25000.5],
    ['1,250,000', 1250000],
    ['1.250.000', 1250000],
    ['1,250,000.75', 1250000.75],
    ['1.250.000,75', 1250000.75],
    ['25000 грн', 25000],
    ['25000грн.', 25000],
    ['₴ 25 000', 25000],
    ['25000 UAH', 25000],
    ['  42  ', 42],
    ['0.5', 0.5],
  ])('%s → %d', (text, amount) => {
    expect(parseAmount(text)).toBe(amount);
  });

  it.each([
    ['', 'empty'],
    ['привіт', 'no number'],
    ['25000 і 3000', 'two numbers'],
    ['-25000', 'negative'],
    ['0', 'zero'],
    ['25.000.5', 'broken grouping'],
    ['abc25000', 'text around'],
    ['2000000000', 'surely a typo'],
  ])('%s is not an amount (%s)', text => {
    expect(parseAmount(text)).toBeNull();
  });

  it('no longer turns 10000.50 into 1 000 050 (the old replace(/\\D/g) bug)', () => {
    expect(parseAmount('10000.50')).toBe(10000.5);
  });
});
