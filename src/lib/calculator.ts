/**
 * Stoffice Calculation Engine — ported from legacy app.js
 * Pure functions, fully testable, no DOM dependencies.
 */

export interface CalculatorInputs {
  daysPerYear: number;
  incidentsPerDay: number;
  minutesPerIncident: number;
  hourlyRate: number;
  costAI: number;
  optZwilling: boolean;
  optAssets: boolean;
  optDoku: boolean;
  optAuto: boolean;
}

export interface OptimizationFactor {
  id: string;
  pct: number;
  labelKey: string;
  color: string;
  active: boolean;
}

export interface CalculatorResults {
  costNow: number;
  costNew: number;
  grossSavings: number;
  netSavings: number;
  hoursPerYear: number;
  hoursOptimized: number;
  hoursSaved: number;
  totalOptimizationPct: number;
  roiPct: number;
  paybackMonths: number;
  activeFactors: OptimizationFactor[];
}

const OPTIMIZATION_MAP: Record<string, { pct: number; labelKey: string; color: string }> = {
  optZwilling: { pct: 0.75, labelKey: 'digitalTwinFactor', color: 'var(--color-accent)' },
  optAssets: { pct: 0.10, labelKey: 'assetsLinkedFactor', color: 'var(--color-info)' },
  optDoku: { pct: 0.05, labelKey: 'docFactor', color: 'var(--color-plum)' },
  optAuto: { pct: 0.10, labelKey: 'autoFactor', color: 'var(--color-gold)' },
};

export const DEFAULTS: CalculatorInputs = {
  daysPerYear: 250,
  incidentsPerDay: 30,
  minutesPerIncident: 48,
  hourlyRate: 85,
  costAI: 0,
  optZwilling: false,
  optAssets: false,
  optDoku: false,
  optAuto: false,
};

export function calculate(inputs: CalculatorInputs): CalculatorResults | null {
  const { daysPerYear, incidentsPerDay, minutesPerIncident, hourlyRate, costAI } = inputs;

  if (daysPerYear <= 0 || incidentsPerDay <= 0 || minutesPerIncident <= 0 || hourlyRate <= 0) {
    return null;
  }

  const hoursPerDay = (incidentsPerDay * minutesPerIncident) / 60;
  const hoursPerYear = hoursPerDay * daysPerYear;
  const costNow = hoursPerYear * hourlyRate;

  const activeFactors: OptimizationFactor[] = [];
  let totalPct = 0;

  for (const [key, config] of Object.entries(OPTIMIZATION_MAP)) {
    const active = inputs[key as keyof CalculatorInputs] as boolean;
    activeFactors.push({
      id: key,
      pct: config.pct,
      labelKey: config.labelKey,
      color: config.color,
      active,
    });
    if (active) {
      totalPct += config.pct;
    }
  }

  totalPct = Math.min(totalPct, 1);

  const grossSavings = costNow * totalPct;
  const netSavings = grossSavings - costAI;
  const costNew = costNow - netSavings;
  const hoursOptimized = hoursPerYear * (1 - totalPct);
  const hoursSaved = hoursPerYear - hoursOptimized;

  const roiPct = costAI > 0 ? (netSavings / costAI) * 100 : 0;
  const paybackMonths = costAI > 0 && grossSavings > 0
    ? Math.ceil((costAI / grossSavings) * 12)
    : 0;

  return {
    costNow,
    costNew,
    grossSavings,
    netSavings,
    hoursPerYear,
    hoursOptimized,
    hoursSaved,
    totalOptimizationPct: totalPct,
    roiPct,
    paybackMonths,
    activeFactors: activeFactors.filter(f => f.active),
  };
}

export function formatCHF(n: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('de-CH').format(Math.round(n));
}
