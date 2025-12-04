import { parseVoiceTranscript } from '../utils/voiceParser';

describe('voiceParser', () => {
  it('should extract title from transcript', () => {
    const result = parseVoiceTranscript('Create a high priority task to review the pull request by tomorrow');
    expect(result.parsed.title).toBeTruthy();
    expect(result.parsed.title.length).toBeGreaterThan(0);
  });

  it('should detect priority', () => {
    const result = parseVoiceTranscript('Create a high priority task');
    expect(result.parsed.priority).toBe('HIGH');
  });

  it('should parse date', () => {
    const result = parseVoiceTranscript('Do this tomorrow');
    expect(result.parsed.dueDate).not.toBeNull();
  });

  it('should return confidence scores', () => {
    const result = parseVoiceTranscript('Review PR by tomorrow, high priority');
    expect(result.confidence.overall).toBeGreaterThan(0);
    expect(result.confidence.overall).toBeLessThanOrEqual(1);
    expect(result.confidence.title).toBeGreaterThan(0);
    expect(result.confidence.priority).toBeGreaterThan(0);
  });

  it('should default status to TODO', () => {
    const result = parseVoiceTranscript('Create a task');
    expect(result.parsed.status).toBe('TODO');
  });
});
