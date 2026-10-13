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
