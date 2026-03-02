export const THROTTLE_CONFIG = {
  DEFAULT: { ttl: Number(process.env.THROTTLE_DEFAULT_TTL ?? 60), limit: Number(process.env.DEFAULT_LIMIT ?? 100) },
};