import { parseDateFromTranscript, calculateDateConfidence } from '../utils/dateParser';

describe('dateParser', () => {
  describe('parseDateFromTranscript', () => {
    it('should parse "today"', () => {
      const result = parseDateFromTranscript('Do this today');
      expect(result).not.toBeNull();
    });

    it('should parse "tomorrow"', () => {
      const result = parseDateFromTranscript('Complete by tomorrow');
      expect(result).not.toBeNull();
    });

    it('should parse "next Monday"', () => {
      const result = parseDateFromTranscript('Due next Monday');
      expect(result).not.toBeNull();
    });

    it('should parse "in X days"', () => {
      const result = parseDateFromTranscript('Due in 5 days');
      expect(result).not.toBeNull();
    });

    it('should return null for no date', () => {
      const result = parseDateFromTranscript('Just a random task');
      expect(result).toBeNull();
    });
  });

  describe('calculateDateConfidence', () => {
    it('should return 0 for null date', () => {
      const confidence = calculateDateConfidence('Some text', null);
      expect(confidence).toBe(0);
    });

    it('should return high confidence for explicit keywords', () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const confidence = calculateDateConfidence('Due by tomorrow', date);
      expect(confidence).toBeGreaterThan(0.8);
    });
  });
});
