/**
 * Priority keywords detection utility
 * Identifies priority level from text
 */

const PRIORITY_KEYWORDS = {
  CRITICAL: ['urgent', 'critical', 'asap', 'immediately', 'blocking', 'emergency'],
  HIGH: ['high priority', 'important', 'soon', 'today', 'this week', 'asap'],
  MEDIUM: ['medium', 'normal', 'standard'],
  LOW: ['low priority', 'can wait', 'whenever', 'later', 'someday', 'backlog'],
};

export function detectPriority(text: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const lowerText = text.toLowerCase();

  for (const priority of ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const) {
    const keywords = PRIORITY_KEYWORDS[priority];
    if (keywords.some((kw) => lowerText.includes(kw))) {
      return priority;
    }
  }

  return 'MEDIUM';
}

export function calculatePriorityConfidence(text: string, detectedPriority: string): number {
  const lowerText = text.toLowerCase();
  const keywords = PRIORITY_KEYWORDS[detectedPriority as keyof typeof PRIORITY_KEYWORDS] || [];

  if (keywords.length === 0) return 0.5;

  const matches = keywords.filter((kw) => lowerText.includes(kw)).length;
  return Math.min(1, matches / keywords.length);
}
