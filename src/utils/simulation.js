export const METRICS = [
    {key: 'temperature', label: 'Temperatura', unit: '°C', min: 10, max: 120, start: 42, direction: 'high', category: 'sensores'},
    {key: 'pressure', label: 'Pressão', unit: 'kPa', min: 80, max: 130, start: 101, direction: 'high', category: 'sensores'},
    {key: 'radiation', label: 'Radiação', unit: 'mSv', min: 0, max: 100, start: 18, direction: 'high', category: 'sensores'},

    {key: 'battery', label: 'Bateria', unit: '%', min: 0, max: 100, start: 87, direction: 'low', category: 'energia'},
    {key: 'solarInput', label: 'Paineis', unit: 'W', min: 0, max: 500, start: 320, direction: 'low', category: 'energia'},


    {key: 'signal', label: 'Sinal', unit: '%', min: 0, max: 100, start: 78, direction: 'low', category: 'comunicacao'},
    {key: 'latency', label: 'Latência', unit: 'ms', min: 20, max: 1500, start: 240, direction: 'high', category: 'comunicacao'},

];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function nextValue(metric, currentValue) {
  const range = metric.max - metric.min;
  const variation = randomBetween(-0.04, 0.04) * range;
  const next = currentValue + variation;
  // Arredondo pra 1 casa decimal só pra não exibir "42.38719283" na tela.
  return Math.round(clamp(next, metric.min, metric.max) * 10) / 10;
}

export function createInitialReadings() {
  const readings = {};
  METRICS.forEach((m) => {
    readings[m.key] = m.start;
  });
  return readings;
}

export function tickReadings(currentReadings) {
  const updated = {};
  METRICS.forEach((m) => {
    updated[m.key] = nextValue(m, currentReadings[m.key]);
  });
  return updated;
}