import { addDays, addWeeks, parseISO, isAfter, startOfDay } from 'date-fns';

/**
 * Parse natural language date expressions from text
 * Returns parsed date or null if no date found
 */

const RELATIVE_DATE_REGEX = {
  today: /\btoday\b/i,
  tomorrow: /\btomorrow\b/i,
  nextDay: /\b(?:next\s+)?(\w+day)\b/i,
  inXDays: /\bin\s+(\d+)\s+days?\b/i,
  inXWeeks: /\bin\s+(\d+)\s+weeks?\b/i,
  byDate: /\b(?:by|before|on)\s+(.+?)(?:\s|$)/i,
};

const DAYS_OF_WEEK = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

export function parseDateFromTranscript(transcript: string, _timezone = 'UTC'): Date | null {
  const now = new Date();
  const today = startOfDay(now);

  if (RELATIVE_DATE_REGEX.today.test(transcript)) {
    return today;
  }

  if (RELATIVE_DATE_REGEX.tomorrow.test(transcript)) {
    return addDays(today, 1);
  }

  const dayMatch = transcript.match(RELATIVE_DATE_REGEX.nextDay);
  if (dayMatch) {
    const dayName = dayMatch[1].toLowerCase();
    const targetDay = DAYS_OF_WEEK[dayName as keyof typeof DAYS_OF_WEEK];
    if (targetDay !== undefined) {
      const currentDay = now.getDay();
      let daysAhead = targetDay - currentDay;
      if (daysAhead <= 0) daysAhead += 7;
      return addDays(today, daysAhead);
    }
  }

  const inDaysMatch = transcript.match(RELATIVE_DATE_REGEX.inXDays);
  if (inDaysMatch) {
    return addDays(today, parseInt(inDaysMatch[1], 10));
  }

  const inWeeksMatch = transcript.match(RELATIVE_DATE_REGEX.inXWeeks);
  if (inWeeksMatch) {
    return addWeeks(today, parseInt(inWeeksMatch[1], 10));
  }

  const datePatterns = [
    /(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})?/i,
    /(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})?/i,
    /(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/i,
  ];

  for (const pattern of datePatterns) {
    const match = transcript.match(pattern);
    if (match) {
      try {
        const dateStr = match[0];
        const parsed = parseISO(dateStr);
        if (isAfter(parsed, now)) {
          return parsed;
        }
      } catch {
      }
    }
  }

  return null;
}

export function calculateDateConfidence(transcript: string, detectedDate: Date | null): number {
  if (!detectedDate) return 0;

  const explicitDateKeywords = ['by', 'before', 'on', 'until', 'due'];
  const hasExplicitKeyword = explicitDateKeywords.some((kw) => transcript.toLowerCase().includes(kw));

  if (hasExplicitKeyword) return 0.9;
  return 0.7;
}
