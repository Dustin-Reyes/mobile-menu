export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
