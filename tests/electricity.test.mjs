import test from 'node:test';
import assert from 'node:assert/strict';
import { ohmsLaw, resistorPower, acPeak, acPeriodMs, sineVoltage, twoResistorCircuit, generatorCycle } from '../src/lib/electricity.mjs';

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

test('Lesson 2 examples: 12 V / 24 Ω = 0.5 A and 6 W', () => {
  assert.equal(ohmsLaw(12, 24), 0.5);
  assert.equal(resistorPower(12, 24), 6);
  assert.equal(ohmsLaw(12, 48), 0.25);
  assert.equal(resistorPower(12, 48), 3);
  assert.equal(resistorPower(24, 24), 24);
});
test('Lesson 3 DC task: 48 W heater at 24 V for 3 hours', () => {
  assert.equal(48 / 24, 2);
  assert.equal(ohmsLaw(24, 12), 2);
  assert.equal(resistorPower(24, 12), 48);
  assert.equal(48 * 3, 144);
});
test('Lesson 4 task: 4 Ω ∥ 12 Ω on 12 V gives 4 A total and 48 W', () => {
  assert.equal(ohmsLaw(12, 4), 3);
  assert.equal(ohmsLaw(12, 12), 1);
  assert.ok(Math.abs(1 / (1 / 4 + 1 / 12) - 3) < 1e-9);
  assert.equal(resistorPower(12, 3), 48);
});
test('Lesson 6 task: 46 Ω heater at 230 V RMS = 5 A, 1150 W, peak 325 V, peak current 7.07 A', () => {
  assert.equal(ohmsLaw(230, 46), 5);
  assert.equal(resistorPower(230, 46), 1150);
  assert.ok(Math.abs(acPeak(230) - 325.27) < 0.01);
  assert.ok(Math.abs(acPeak(5) - 7.07) < 0.01);
});

test('At fixed voltage doubling resistance halves current', () => {
  assert.equal(ohmsLaw(9, 18), 0.5);
  assert.equal(ohmsLaw(9, 36), 0.25);
});

test('Two identical resistors in series split voltage and share current', () => {
  assert.deepEqual(twoResistorCircuit(12, 6, 'series'), {
    equivalentResistance: 12, sourceCurrent: 1, eachVoltage: 6, eachCurrent: 1,
  });
});
test('Parallel resistors share voltage and divide source current', () => {
  assert.deepEqual(twoResistorCircuit(12, 6, 'parallel'), {
    equivalentResistance: 3, sourceCurrent: 4, eachVoltage: 12, eachCurrent: 2,
  });
  assert.throws(() => twoResistorCircuit(12, 6, 'not-a-type'), RangeError);
});

test('Lesson 5: generator polarity follows the sign of flux change', () => {
  assert.deepEqual(generatorCycle(0), { fluxFraction: 1, emfFraction: 0 });
  assert.deepEqual(generatorCycle(90), { fluxFraction: 0, emfFraction: 1 });
  assert.deepEqual(generatorCycle(180), { fluxFraction: -1, emfFraction: 0 });
  assert.deepEqual(generatorCycle(270), { fluxFraction: 0, emfFraction: -1 });
  assert.deepEqual(generatorCycle(360), { fluxFraction: 1, emfFraction: 0 });
  assert.throws(() => generatorCycle(NaN), RangeError);
  assert.equal(acPeriodMs(25), 40);
});

test('Lesson 6: RMS gives the same average resistive heating as DC', () => {
  assert.ok(Math.abs(resistorPower(acPeak(1) * 5, 10) - 5) < 1e-9);
  assert.ok(Math.abs(acPeak(12) - 16.97) < 0.01);
});
