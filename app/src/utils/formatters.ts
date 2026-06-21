export const fmt$ = (value: number, decimals = 1): string =>
  `$${value.toFixed(decimals)}M`;

export const fmtPct = (value: number): string => `${value.toFixed(1)}%`;

export const fmtDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const fmtShortDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
