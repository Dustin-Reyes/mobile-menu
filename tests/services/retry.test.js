import { delay, exponentialBackoffDelay } from 'services/retry';

describe('delay', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('resolves after the specified milliseconds', async () => {
    const resolved = jest.fn();
    delay(200).then(resolved);
    expect(resolved).not.toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    await Promise.resolve();
    expect(resolved).toHaveBeenCalled();
  });
});

describe('exponentialBackoffDelay', () => {
  it('returns baseDelay * factor^0 = baseDelay for attempt 0 (no jitter)', () => {
    expect(
      exponentialBackoffDelay(0, { baseDelay: 300, factor: 2, jitter: false }),
    ).toBe(300);
  });

  it('returns baseDelay * factor^1 for attempt 1 (no jitter)', () => {
    expect(
      exponentialBackoffDelay(1, { baseDelay: 300, factor: 2, jitter: false }),
    ).toBe(600);
  });

  it('returns baseDelay * factor^2 for attempt 2 (no jitter)', () => {
    expect(
      exponentialBackoffDelay(2, { baseDelay: 300, factor: 2, jitter: false }),
    ).toBe(1200);
  });

  it('caps result at maxDelay', () => {
    const result = exponentialBackoffDelay(10, {
      baseDelay: 300,
      maxDelay: 5000,
      factor: 2,
      jitter: false,
    });
    expect(result).toBe(5000);
  });

  it('applies jitter when jitter=true — results should not all be identical', () => {
    const results = Array.from({ length: 20 }, () =>
      exponentialBackoffDelay(2, {
        baseDelay: 300,
        factor: 2,
        maxDelay: 10000,
        jitter: true,
      }),
    );
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('jittered value is within [capped/2, capped] range', () => {
    for (let i = 0; i < 20; i++) {
      const result = exponentialBackoffDelay(1, {
        baseDelay: 300,
        factor: 2,
        maxDelay: 10000,
        jitter: true,
      });
      expect(result).toBeGreaterThanOrEqual(300);
      expect(result).toBeLessThanOrEqual(600);
    }
  });

  it('uses defaults (baseDelay=300, maxDelay=5000, factor=2) with no options', () => {
    const result = exponentialBackoffDelay(0, { jitter: false });
    expect(result).toBe(300);
  });
});
