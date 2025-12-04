import { detectPriority, calculatePriorityConfidence } from '../utils/priorityDetector';

describe('priorityDetector', () => {
  describe('detectPriority', () => {
    it('should detect CRITICAL priority', () => {
      expect(detectPriority('This is urgent')).toBe('CRITICAL');
      expect(detectPriority('Critical issue that needs immediate attention')).toBe('CRITICAL');
    });

    it('should detect HIGH priority', () => {
      expect(detectPriority('High priority task for today')).toBe('HIGH');
      expect(detectPriority('Important review needed soon')).toBe('HIGH');
    });

    it('should detect LOW priority', () => {
      expect(detectPriority('Low priority task, can wait')).toBe('LOW');
      expect(detectPriority('This can happen whenever')).toBe('LOW');
    });

    it('should default to MEDIUM', () => {
      expect(detectPriority('Regular task')).toBe('MEDIUM');
      expect(detectPriority('Some random task')).toBe('MEDIUM');
    });
  });

  describe('calculatePriorityConfidence', () => {
    it('should return high confidence for critical keywords', () => {
      const confidence = calculatePriorityConfidence('This is urgent and critical', 'CRITICAL');
      expect(confidence).toBeGreaterThan(0.5);
    });

    it('should return low confidence for no keywords', () => {
      const confidence = calculatePriorityConfidence('Random task', 'MEDIUM');
      expect(confidence).toBeLessThan(0.8);
    });
  });
});
