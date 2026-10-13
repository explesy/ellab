import test from 'node:test';
import assert from 'node:assert/strict';
import { ohmsLaw, resistorPower, acPeak, acPeriodMs, sineVoltage } from '../src/lib/electricity.mjs';

test('Ohm: 12 V on 6 ohms = 2 A and 24 W', () => {
  assert.equal(ohmsLaw(12, 6), 2);
  assert.equal(resistorPower(12, 6), 24);
});
test('Doubling R halves I at fixed U', () => {
  assert.equal(ohmsLaw(12, 12), 1);
  assert.equal(resistorPower(12, 12), 12);
});
test('50 Hz has 20 ms period and 230 V RMS has about 325 V peak', () => {
  assert.equal(acPeriodMs(50), 20);
  assert.ok(Math.abs(acPeak(230) - 325.269) < 0.01);
  assert.ok(Math.abs(sineVoltage(0.005, 230, 50) - acPeak(230)) < 1e-9);
  assert.ok(Math.abs(sineVoltage(0.015, 230, 50) + acPeak(230)) < 1e-9);
});
test('Invalid parameters reject nonsensical calculations', () => {
  assert.throws(() => ohmsLaw(12, 0), RangeError);
  assert.throws(() => ohmsLaw(12, -1), RangeError);
  assert.throws(() => acPeriodMs(0), RangeError);
});
