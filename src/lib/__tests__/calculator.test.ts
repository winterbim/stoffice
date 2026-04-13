import { describe, it, expect } from 'vitest';
import { calculate, formatCHF, formatNumber, DEFAULTS, type CalculatorInputs } from '../calculator';

describe('calculate', () => {
  it('returns null for zero/negative inputs', () => {
    expect(calculate({ ...DEFAULTS, daysPerYear: 0 })).toBeNull();
    expect(calculate({ ...DEFAULTS, incidentsPerDay: -1 })).toBeNull();
    expect(calculate({ ...DEFAULTS, minutesPerIncident: 0 })).toBeNull();
    expect(calculate({ ...DEFAULTS, hourlyRate: 0 })).toBeNull();
  });

  it('returns zero savings when no optimizations active', () => {
    const result = calculate(DEFAULTS);
    expect(result).not.toBeNull();
    expect(result!.activeFactors).toHaveLength(0);
    expect(result!.grossSavings).toBe(0);
    expect(result!.netSavings).toBe(0);
    expect(result!.totalOptimizationPct).toBe(0);
  });

  it('calculates costNow correctly', () => {
    const inputs: CalculatorInputs = {
      ...DEFAULTS,
      daysPerYear: 250,
      incidentsPerDay: 30,
      minutesPerIncident: 48,
      hourlyRate: 85,
    };
    const result = calculate(inputs)!;
    // 30 * 48 / 60 = 24 hours/day
    // 24 * 250 = 6000 hours/year
    // 6000 * 85 = 510'000
    expect(result.costNow).toBe(510000);
    expect(result.hoursPerYear).toBe(6000);
  });

  it('calculates single optimization factor', () => {
    const inputs: CalculatorInputs = {
      ...DEFAULTS,
      daysPerYear: 250,
      incidentsPerDay: 30,
      minutesPerIncident: 48,
      hourlyRate: 85,
      optZwilling: true,
    };
    const result = calculate(inputs)!;
    expect(result.totalOptimizationPct).toBe(0.75);
    expect(result.grossSavings).toBe(510000 * 0.75);
    expect(result.activeFactors).toHaveLength(1);
    expect(result.activeFactors[0].id).toBe('optZwilling');
  });

  it('calculates all optimizations combined', () => {
    const inputs: CalculatorInputs = {
      ...DEFAULTS,
      daysPerYear: 250,
      incidentsPerDay: 30,
      minutesPerIncident: 48,
      hourlyRate: 85,
      optZwilling: true,
      optAssets: true,
      optDoku: true,
      optAuto: true,
    };
    const result = calculate(inputs)!;
    // 0.75 + 0.10 + 0.05 + 0.10 = 1.0 (capped at 1)
    expect(result.totalOptimizationPct).toBe(1);
    expect(result.grossSavings).toBe(510000);
    expect(result.costNew).toBe(0);
    expect(result.activeFactors).toHaveLength(4);
  });

  it('calculates ROI and payback correctly', () => {
    const inputs: CalculatorInputs = {
      ...DEFAULTS,
      daysPerYear: 250,
      incidentsPerDay: 30,
      minutesPerIncident: 48,
      hourlyRate: 85,
      costAI: 50000,
      optZwilling: true,
    };
    const result = calculate(inputs)!;
    const grossSavings = 510000 * 0.75; // 382'500
    expect(result.grossSavings).toBe(grossSavings);
    expect(result.netSavings).toBe(grossSavings - 50000);
    expect(result.roiPct).toBeCloseTo((332500 / 50000) * 100, 1);
    // payback: ceil((50000 / 382500) * 12) = ceil(1.57) = 2
    expect(result.paybackMonths).toBe(2);
  });

  it('handles costAI=0 with zero ROI', () => {
    const result = calculate({ ...DEFAULTS, optZwilling: true })!;
    expect(result.roiPct).toBe(0);
    expect(result.paybackMonths).toBe(0);
  });

  it('returns correct hours saved', () => {
    const inputs: CalculatorInputs = {
      ...DEFAULTS,
      daysPerYear: 250,
      incidentsPerDay: 10,
      minutesPerIncident: 60,
      hourlyRate: 100,
      optAssets: true, // 10%
    };
    const result = calculate(inputs)!;
    // 10 * 60 / 60 = 10 hours/day, 10 * 250 = 2500 hours/year
    expect(result.hoursPerYear).toBe(2500);
    expect(result.hoursSaved).toBe(250); // 10% of 2500
    expect(result.hoursOptimized).toBe(2250);
  });
});

describe('formatCHF', () => {
  it('formats positive amounts', () => {
    expect(formatCHF(0)).toMatch(/CHF/);
    expect(formatCHF(1234)).toMatch(/1/);
  });

  it('formats large amounts without decimals', () => {
    const formatted = formatCHF(510000);
    expect(formatted).toContain('510');
    expect(formatted).not.toContain('.');
  });
});

describe('formatNumber', () => {
  it('rounds and formats numbers', () => {
    const result = formatNumber(1234.56);
    expect(result).toContain('1');
  });
});
