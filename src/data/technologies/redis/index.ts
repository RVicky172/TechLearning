import type { Technology } from "@/data/types";
import { redisFundamentals } from "@/data/technologies/redis/fundamentals";
import { redisDataStructures } from "@/data/technologies/redis/dataStructures";
import { redisCaching } from "@/data/technologies/redis/caching";
import { redisPubSub } from "@/data/technologies/redis/pubsub";

const redis: Technology = {
  id: "redis",
  name: "Redis",
  description:
    "In-memory data store for caching, sessions, rate limiting, pub/sub, and real-time leaderboards.",
  color: "bg-red-600",
  iconName: "Database",
  deviconClass: "devicon-redis-plain colored",
  tree: [redisFundamentals, redisDataStructures, redisCaching, redisPubSub],
};

export default redis;
