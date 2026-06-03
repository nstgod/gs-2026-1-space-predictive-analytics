import { METRICS } from "./simulation";

export const LEVELS = {
    OK: "ok",
    WARNING: "warning",
    CRITICAL: "critical",
};

export const DEFAULT_THRESHOLDS = {
  temperature: { warning: 70,  critical: 90 },
  pressure:    { warning: 115, critical: 125 },
  radiation:   { warning: 50,  critical: 75 },
  battery:     { warning: 30,  critical: 15 },
  solarInput:  { warning: 150, critical: 80 },
  signal:      { warning: 50,  critical: 25 },
  latency:     { warning: 600, critical: 1000 },
};

function getMetric(key) {
  return METRICS.find((m) => m.key === key);
}

export function evaluate(metricKey, value, thresholds) {
  const metric = getMetric(metricKey);
  const limit = thresholds[metricKey];
  if (!metric || !limit) return LEVELS.OK; // métrica desconhecida = trato como ok

  if (metric.direction === 'high') {
    // Valor ALTO é ruim: quanto maior, pior. Testo o crítico PRIMEIRO.
    // Por que primeiro o crítico? Porque 95 também é > warning(70); se eu testasse
    // o warning antes, ele "ganharia" e eu nunca chegaria a marcar como crítico.
    if (value >= limit.critical) return LEVELS.CRITICAL;
    if (value >= limit.warning) return LEVELS.WARNING;
  } else {
    // Valor BAIXO é ruim: quanto menor, pior. Mesma lógica, invertida.
    if (value <= limit.critical) return LEVELS.CRITICAL;
    if (value <= limit.warning) return LEVELS.WARNING;
  }
  return LEVELS.OK;
}

export function buildAlerts(readings, thresholds) {
  const alerts = [];
  METRICS.forEach((metric) => {
    const level = evaluate(metric.key, readings[metric.key], thresholds);
    if (level !== LEVELS.OK) {
      alerts.push({
        key: metric.key,
        label: metric.label,
        value: readings[metric.key],
        unit: metric.unit,
        level, // 'warning' ou 'critical'
      });
    }
  });
  return alerts;
}