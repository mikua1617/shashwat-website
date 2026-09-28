import { Redis } from "@upstash/redis"

// Shared Upstash Redis client, reading the env var names Vercel's own
// "Storage -> Upstash for Redis" integration provisions (KV_REST_API_URL/
// TOKEN) - not the UPSTASH_REDIS_REST_URL/TOKEN names Upstash's standalone
// docs show. Null when not configured, so callers degrade gracefully
// instead of throwing.
export const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null
