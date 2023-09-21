import { expect } from '@jest/globals';
import { generateOTP } from '../';

describe('generateOTP', () => {
  it('default length', () => {
    const otp = generateOTP();
    expect(otp.length).toEqual(6);
  });

  it('respects length', () => {
    const otp = generateOTP(10);
    expect(otp.length).toEqual(10);
  });

  it('returns digits', () => {
    const otp = generateOTP();
    expect(/^[0-9]{6}$/.test(otp)).toEqual(true);
  });

  it('returns unique tokens', () => {
    const set = new Set<string>();
    set.add(generateOTP());
    set.add(generateOTP());
    set.add(generateOTP());
    set.add(generateOTP());
    expect(set.size).toEqual(4);
  });
});
