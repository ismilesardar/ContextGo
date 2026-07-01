export const DATE_RANGE_INTERVAL_PRESETS = [
  '24h',
  '7d',
  '30d',
  '90d',
  '1y',
  'mtd',
  'qtd',
  'ytd',
  'all'
] as const;

export const LINKS_ANALYTICS_INTERVAL = '24h';
export const PARTNERS_ANALYTICS_INTERVAL = '30d';

export const INTERVAL_DISPLAYS = [
  {
    display: 'Last 24 hours',
    value: '24h',
    shortcut: 'd'
  },
  {
    display: 'Last 7 days',
    value: '7d',
    shortcut: 'w'
  },
  {
    display: 'Last 30 days',
    value: '30d',
    shortcut: 't'
  },
  {
    display: 'Last 3 months',
    value: '90d',
    shortcut: '3'
  },
  {
    display: 'Last 12 months',
    value: '1y',
    shortcut: 'l'
  },
  {
    display: 'Month to Date',
    value: 'mtd',
    shortcut: 'm'
  },
  {
    display: 'Quarter to Date',
    value: 'qtd',
    shortcut: 'q'
  },
  {
    display: 'Year to Date',
    value: 'ytd',
    shortcut: 'y'
  },
  {
    display: 'All Time',
    value: 'all',
    shortcut: 'a'
  }
];
