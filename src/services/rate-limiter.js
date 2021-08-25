const { RateLimiterMemory } = require("rate-limiter-flexible");

const maxWrongAttemptsByIPPerDay = 25;
const maxConsecutiveFailsByIP = 5;

const limiterSlowBrute = new RateLimiterMemory({
  keyPrefix: "auth_fail_ip_per_day",
  points: maxWrongAttemptsByIPPerDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24,
});

const limiterConsecutiveFails = new RateLimiterMemory({
  keyPrefix: "auth_fail_consecutive_ip",
  points: maxConsecutiveFailsByIP,
  duration: 60 * 60 * 24 * 20,
  blockDuration: 60 * 60,
});

async function isWithinLimits(ipAddr) {
  const [resConsecutiveIP, resSlowIP] = await Promise.all([
    limiterConsecutiveFails.get(ipAddr),
    limiterSlowBrute.get(ipAddr),
  ]);

  let retrySecs = 0;
  if (
    resSlowIP !== null &&
    resSlowIP.consumedPoints > maxWrongAttemptsByIPPerDay
  ) {
    retrySecs = Math.round(resSlowIP.msBeforeNext / 1000) || 1;
  } else if (
    resConsecutiveIP !== null &&
    resConsecutiveIP.consumedPoints > maxConsecutiveFailsByIP
  ) {
    retrySecs = Math.round(resConsecutiveIP.msBeforeNext / 1000) || 1;
  }

  return retrySecs <= 0;
}

async function resetLimitForIP(ipAddr) {
  const resConsecutiveIP = await limiterConsecutiveFails.get(ipAddr);
  const resSlowIP = await limiterSlowBrute.get(ipAddr);

  if (resConsecutiveIP !== null && resConsecutiveIP.consumedPoints > 0) {
    await limiterConsecutiveFails.delete(ipAddr);
  }

  if (resSlowIP !== null && resSlowIP.consumedPoints > 0) {
    await limiterConsecutiveFails.delete(ipAddr);
  }
}

async function incFailedAttempts(ipAddr) {
  try {
    const promises = [
      limiterSlowBrute.consume(ipAddr),
      limiterConsecutiveFails.consume(ipAddr),
    ];

    await Promise.all(promises);
  } catch (rlRejected) {
    if (rlRejected instanceof Error) {
      throw rlRejected;
    }
  }
}

module.exports = {
  isWithinLimits: isWithinLimits,
  resetLimitForIP: resetLimitForIP,
  incFailedAttempts: incFailedAttempts,
};
