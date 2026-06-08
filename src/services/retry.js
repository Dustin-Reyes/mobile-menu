/**
 * Retry utility helpers used by `ApiClient`.
 *
 * @module services/retry
 */

/**
 * Returns a Promise that resolves after `ms` milliseconds.
 *
 * @param {number} ms - Delay duration in milliseconds.
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Calculates an exponential back-off delay with optional full-jitter.
 *
 * @param {number} attempt - Zero-based attempt index.
 * @param {{ baseDelay?: number, maxDelay?: number, factor?: number, jitter?: boolean }} [options]
 * @param {number} [options.baseDelay=300] - Base delay in milliseconds.
 * @param {number} [options.maxDelay=5000] - Maximum delay cap in milliseconds.
 * @param {number} [options.factor=2] - Exponential growth factor.
 * @param {boolean} [options.jitter=true] - When `true`, applies full jitter to reduce thundering-herd.
 * @returns {number} Computed delay in milliseconds.
 */
export function exponentialBackoffDelay(attempt, options = {}) {
  const {
    baseDelay = 300,
    maxDelay = 5000,
    factor = 2,
    jitter = true,
  } = options;

  const exponential = baseDelay * Math.pow(factor, attempt);
  const capped = Math.min(exponential, maxDelay);

  if (!jitter) {
    return capped;
  }

  const random = Math.random();
  return Math.round(capped / 2 + random * (capped / 2));
}
