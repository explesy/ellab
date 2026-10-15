/** Ideal educational models. V, Ω, A, W, Hz. Not installation design tools. */
export function ohmsLaw(voltage, resistance) {
  if (!Number.isFinite(voltage) || !Number.isFinite(resistance) || resistance <= 0) {
    throw new RangeError('Voltage must be finite and resistance must be positive');
  }
  return voltage / resistance;
}
export function resistorPower(voltage, resistance) {
  return voltage * ohmsLaw(voltage, resistance);
}
export function acPeak(rms) {
  if (!Number.isFinite(rms) || rms < 0) throw new RangeError('RMS voltage must be non-negative');
  return rms * Math.SQRT2;
}
export function acPeriodMs(frequencyHz) {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0) throw new RangeError('Frequency must be positive');
  return 1000 / frequencyHz;
}
export function sineVoltage(timeSeconds, rms, frequencyHz, phaseRadians = 0) {
  if (!Number.isFinite(timeSeconds) || !Number.isFinite(phaseRadians)) throw new RangeError('Time and phase must be finite');
  return acPeak(rms) * Math.sin(2 * Math.PI * frequencyHz * timeSeconds + phaseRadians);
}

/** Two identical ideal ohmic resistors on an ideal voltage source. */
export function twoResistorCircuit(voltage, resistance, connection = 'series') {
  if (!Number.isFinite(voltage) || voltage < 0 || !Number.isFinite(resistance) || resistance <= 0) {
    throw new RangeError('Voltage must be non-negative and resistance positive');
  }
  if (!['series', 'parallel'].includes(connection)) throw new RangeError('Invalid connection type');
  const series = connection === 'series';
  const equivalentResistance = series ? 2 * resistance : resistance / 2;
  const sourceCurrent = voltage / equivalentResistance;
  return {
    equivalentResistance,
    sourceCurrent,
    eachVoltage: series ? voltage / 2 : voltage,
    eachCurrent: series ? sourceCurrent : voltage / resistance,
  };
}


/** One electrical cycle of an ideal single-pole-pair generator. θ=0 at maximum flux. */
export function generatorCycle(angleDegrees) {
  if (!Number.isFinite(angleDegrees)) throw new RangeError('Angle must be finite');
  const theta = angleDegrees * Math.PI / 180;
  const clean = x => Math.abs(x) < 1e-12 ? 0 : x;
  return {
    fluxFraction: clean(Math.cos(theta)),
    emfFraction: clean(Math.sin(theta)),
  };
}
