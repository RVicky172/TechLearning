import type { TopicNode } from "@/data/types";

export const redisPubSub: TopicNode = {
  id: "redis-pubsub",
  title: "Pub/Sub & Sessions",
  iconName: "Radio",
  link: "https://redis.io/docs/latest/develop/interact/pubsub/",
  theory:
    "Redis Pub/Sub enables real-time messaging where publishers send messages to channels and subscribers receive them instantly — without polling. Session storage in Redis is the standard approach for stateless, horizontally scalable APIs where session data must be shared across server instances.",
  theoryDetail: {
    keyConcepts: [
      "Publish/Subscribe: a messaging pattern where publishers send to named channels; all current subscribers receive the message immediately",
      "PUBLISH / SUBSCRIBE / PSUBSCRIBE: core commands — PSUBSCRIBE supports glob-pattern channel matching (e.g. notifications:*)",
      "Fire-and-forget: Pub/Sub does not persist messages — if no subscriber is listening when a message is published, it is lost",
      "Redis Streams vs Pub/Sub: use Streams (XADD/XREADGROUP) when you need message persistence, replay, or consumer groups with at-least-once delivery",
      "Session storage: store session data as a Hash or JSON string keyed by session ID; set a TTL matching the session lifetime",
      "connect-redis: Express session middleware that uses Redis as the session store — swaps in-memory store for distributed Redis store",
      "Horizontal scaling: because session data lives in Redis (not in process memory), any number of API server instances can serve any user's request",
    ],
    whyItMatters:
      "Pub/Sub powers real-time features like live notifications, chat indicators, and dashboard updates without WebSocket servers needing to manage state themselves. Session storage in Redis is the prerequisite for scaling a stateful Express or Next.js app beyond one process.",
    commonPitfalls: [
      "Using Pub/Sub for guaranteed delivery — messages are lost if no subscriber is active; use Streams or a proper queue (BullMQ) for reliability",
      "One Redis client for both Pub/Sub and commands — a client in SUBSCRIBE mode can only run Pub/Sub commands; maintain separate client instances",
      "Not setting session TTLs — sessions accumulate in Redis forever; always set maxAge in the session config so connect-redis sets the key TTL",
    ],
    examples: [
      {
        title: "Pub/Sub — real-time notifications",
        description:
          "A separate Redis client subscribes to a channel while the main client continues to publish.",
        code: `import Redis from "ioredis";

// ⚠️ Pub/Sub clients are dedicated — create separate instances
const publisher  = new Redis(process.env.REDIS_URL!);
const subscriber = new Redis(process.env.REDIS_URL!);

// Subscribe to a channel
await subscriber.subscribe("notifications:global");

subscriber.on("message", (channel, message) => {
  const payload = JSON.parse(message);
  console.log(\`[\${channel}]\`, payload);
  // Push to connected WebSocket clients, SSE streams, etc.
});

// Pattern subscribe — match multiple channels
await subscriber.psubscribe("notifications:user:*");

subscriber.on("pmessage", (pattern, channel, message) => {
  // pattern:  "notifications:user:*"
  // channel:  "notifications:user:42"
  const userId = channel.split(":").at(-1);
  sendToUser(userId!, JSON.parse(message));
});

// Publish from anywhere in the app
async function notifyUser(userId: string, payload: object) {
  await publisher.publish(
    \`notifications:user:\${userId}\`,
    JSON.stringify(payload),
  );
}`,
        language: "typescript",
      },
      {
        title: "Session storage with connect-redis (Express)",
        description:
          "Using Redis as the session store makes Express stateless and horizontally scalable.",
        code: `import express from "express";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const app = express();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET!,   // long random string
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
      httpOnly: true,                                  // no JS access
      maxAge: 24 * 60 * 60 * 1000,                    // 1 day
      sameSite: "lax",
    },
  }),
);

// Session is now stored in Redis under "sess:<sessionId>"
app.post("/login", (req, res) => {
  req.session.userId = 42;
  res.json({ ok: true });
});

app.get("/me", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
  res.json({ userId: req.session.userId });
});`,
        language: "typescript",
      },
    ],
  },
};
