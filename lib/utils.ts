import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diffInMs = now - timestamp * 1000; // Convert to milliseconds
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInHours > 24) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInHours >= 1) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Formatted string like "$3.10T", "$900.00B", "$25.00M" or "$999,999.99"
export function formatMarketCapValue(marketCapUsd: number): string {
  if (!Number.isFinite(marketCapUsd) || marketCapUsd <= 0) return 'N/A';

  if (marketCapUsd >= 1e12) return `$${(marketCapUsd / 1e12).toFixed(2)}T`; // Trillions
  if (marketCapUsd >= 1e9) return `$${(marketCapUsd / 1e9).toFixed(2)}B`; // Billions
  if (marketCapUsd >= 1e6) return `$${(marketCapUsd / 1e6).toFixed(2)}M`; // Millions
  return `$${marketCapUsd.toFixed(2)}`; // Below one million, show full USD amount
}

export const getDateRange = (days: number) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);
  return {
    to: toDate.toISOString().split('T')[0],
    from: fromDate.toISOString().split('T')[0],
  };
};

// Get today's date range (from today to today)
export const getTodayDateRange = () => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  return {
    to: todayString,
    from: todayString,
  };
};

// Calculate news per symbol based on watchlist size
export const calculateNewsDistribution = (symbolsCount: number) => {
  let itemsPerSymbol: number;
  let targetNewsCount = 6;

  if (symbolsCount < 3) {
    itemsPerSymbol = 3; // Fewer symbols, more news each
  } else if (symbolsCount === 3) {
    itemsPerSymbol = 2; // Exactly 3 symbols, 2 news each = 6 total
  } else {
    itemsPerSymbol = 1; // Many symbols, 1 news each
    targetNewsCount = 6; // Don't exceed 6 total
  }

  return { itemsPerSymbol, targetNewsCount };
};

// Check for required article fields
export const validateArticle = (article: RawNewsArticle) =>
    article.headline && article.summary && article.url && article.datetime;

// Get today's date string in YYYY-MM-DD format
export const getTodayString = () => new Date().toISOString().split('T')[0];

export const formatArticle = (
    article: RawNewsArticle,
    isCompanyNews: boolean,
    symbol?: string,
    index: number = 0
) => ({
  id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
  headline: article.headline!.trim(),
  summary:
      article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + '...',
  source: article.source || (isCompanyNews ? 'Company News' : 'Market News'),
  url: article.url!,
  datetime: article.datetime!,
  image: article.image || '',
  category: isCompanyNews ? 'company' : article.category || 'general',
  related: isCompanyNews ? symbol! : article.related || '',
});

export const formatChangePercent = (changePercent?: number) => {
  if (!changePercent) return '';
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

export const getChangeColorClass = (changePercent?: number) => {
  if (!changePercent) return 'text-gray-400';
  return changePercent > 0 ? 'text-green-500' : 'text-red-500';
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

export const formatDateToday = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});


export const getAlertText = (alert: Alert) => {
  const condition = alert.alertType === 'upper' ? '>' : '<';
  return `Price ${condition} ${formatPrice(alert.threshold)}`;
};

export const getFormattedTodayDate = () => new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

// Lightweight country to timezone mapping for common countries; defaults to UTC
const COUNTRY_TZ_MAP: Record<string, string> = {
  US: 'America/New_York',
  USA: 'America/New_York',
  UnitedStates: 'America/New_York',
  'United States': 'America/New_York',
  CA: 'America/Toronto',
  Canada: 'America/Toronto',
  GB: 'Europe/London',
  UK: 'Europe/London',
  'United Kingdom': 'Europe/London',
  DE: 'Europe/Berlin',
  Germany: 'Europe/Berlin',
  FR: 'Europe/Paris',
  France: 'Europe/Paris',
  ES: 'Europe/Madrid',
  Spain: 'Europe/Madrid',
  IT: 'Europe/Rome',
  Italy: 'Europe/Rome',
  IN: 'Asia/Kolkata',
  India: 'Asia/Kolkata',
  AU: 'Australia/Sydney',
  Australia: 'Australia/Sydney',
  NZ: 'Pacific/Auckland',
  Japan: 'Asia/Tokyo',
  JP: 'Asia/Tokyo',
  CN: 'Asia/Shanghai',
  China: 'Asia/Shanghai',
  SG: 'Asia/Singapore',
  Singapore: 'Asia/Singapore'
};

export function pickTimezoneFromCountry(country?: string): string {
  if (!country || typeof country !== 'string') return 'UTC';
  const key = country.trim();
  // Try direct
  if (COUNTRY_TZ_MAP[key]) return COUNTRY_TZ_MAP[key];
  // Try uppercase code
  const up = key.toUpperCase();
  if (COUNTRY_TZ_MAP[up]) return COUNTRY_TZ_MAP[up];
  // Try removing spaces
  const nospace = key.replace(/\s+/g, '');
  if (COUNTRY_TZ_MAP[nospace]) return COUNTRY_TZ_MAP[nospace];
  return 'UTC';
}

export function getHourInTimeZone(tz: string): number {
  try {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: tz,
    });
    const parts = fmt.formatToParts(now);
    const hourStr = parts.find((p) => p.type === 'hour')?.value || '0';
    return Number(hourStr);
  } catch {
    return new Date().getUTCHours();
  }
}

export function getMinuteInTimeZone(tz: string): number {
  try {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-GB', {
      minute: '2-digit',
      hour12: false,
      timeZone: tz,
    });
    const parts = fmt.formatToParts(now);
    const minStr = parts.find((p) => p.type === 'minute')?.value || '0';
    return Number(minStr);
  } catch {
    return new Date().getUTCMinutes();
  }
}

export function getFormattedDateInTimeZone(tz: string): string {
  try {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tz,
    });
  } catch {
    return getFormattedTodayDate();
  }
}