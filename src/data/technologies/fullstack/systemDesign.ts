import type { TopicNode } from "@/data/types";

export const fullstackSystemDesign: TopicNode = {
  id: "fullstack-system-design",
  title: "System Design Fundamentals",
  iconName: "LayoutDashboard",
  theory:
    "System design is the process of defining the architecture, components, and data flows of a system to meet functional and non-functional requirements. Key concerns are scalability (handling growth), reliability (staying up under failures), and fault tolerance (degrading gracefully).",
  theoryDetail: {
    keyConcepts: [
      "Scalability: vertical (bigger server) vs. horizontal (more servers) scaling",
      "Reliability: the system continues to work correctly even when things go wrong",
      "Fault tolerance: handle partial failures gracefully without a full outage",
      "CAP theorem: distributed systems can guarantee at most two of Consistency, Availability, Partition tolerance",
    ],
    whyItMatters:
      "System design skills separate junior from senior engineers. Good design decisions made early prevent costly rewrites later. Understanding these fundamentals helps you ask the right questions, spot bottlenecks, and make informed trade-offs.",
    commonPitfalls: [
      "Over-engineering for scale you don't have — start simple and evolve the architecture",
      "Single points of failure — every critical component should have redundancy",
      "Ignoring the fallacies of distributed computing: network is never fully reliable or consistent",
    ],
  },
  children: [
    {
      id: "fullstack-scalability",
      title: "Scalability & Reliability",
      iconName: "TrendingUp",
      link: "https://github.com/donnemartin/system-design-primer",
      theory:
        "Scalability is the ability to handle increased load by adding resources. Reliability is the probability that a system performs its intended function without failure. Both must be designed in from the start.",
      theoryDetail: {
        keyConcepts: [
          "Horizontal scaling (scale-out): add more instances behind a load balancer — stateless services required",
          "Vertical scaling (scale-up): upgrade the server — simpler but hits hardware limits",
          "Replication: keep copies of data on multiple servers — read replicas reduce DB load",
          "Sharding: split data across multiple databases by a key (user ID range) to scale writes",
          "Availability = uptime / (uptime + downtime) — 99.9% = 8.7 hours downtime/year",
        ],
        whyItMatters:
          "A system that works for 100 users may fall apart at 1 million. Planning for scalability means using stateless services, caching aggressively, and designing the database for your read/write ratio before hitting a wall in production.",
        commonPitfalls: [
          "Keeping session state in server memory — prevents horizontal scaling",
          "Not using async workers for slow operations — long-running tasks block request threads",
          "Hot spots: routing all requests for a popular item to one shard, overloading it",
        ],
      },
    },
    {
      id: "fullstack-fault-tolerance",
      title: "Fault Tolerance & Resilience",
      iconName: "Shield",
      link: "https://aws.amazon.com/builders-library/avoiding-fallback-in-distributed-systems/",
      theory:
        "Fault-tolerant systems continue operating (possibly in a degraded state) when components fail. Resilience patterns like retries, circuit breakers, timeouts, and bulkheads prevent a single failure from cascading into a full outage.",
      theoryDetail: {
        keyConcepts: [
          "Retry with exponential back-off and jitter: retry transient failures without overwhelming a recovering service",
          "Circuit breaker: open the circuit after N failures so you stop hitting a dead service",
          "Timeout: every network call must have a timeout — hanging connections exhaust thread pools",
          "Bulkhead: isolate failures — a pool of threads for service A, a separate pool for service B",
          "Graceful degradation: show cached or default data when a downstream service is unavailable",
        ],
        whyItMatters:
          "Distributed systems fail in partial, unexpected ways. A service that handles failure gracefully keeps the rest of the system running and provides a much better user experience than a 500 error page.",
        commonPitfalls: [
          "Infinite retries without back-off amplifying the load on an already struggling service",
          "No timeouts — one slow dependency hangs all threads, bringing down the entire service",
          "Not testing failure scenarios — use chaos engineering tools (Chaos Monkey) to find gaps",
        ],
        examples: [
          {
            title: "Retry with exponential back-off",
            description: "Safe retry pattern for transient network failures.",
            code: `async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxAttempts = 3,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res.json();
    } catch (err) {
      if (attempt === maxAttempts) throw err;

      // Exponential back-off with jitter: 200ms, 400ms, 800ms ± random
      const base = 100 * 2 ** attempt;
      const jitter = Math.random() * 100;
      await new Promise(r => setTimeout(r, base + jitter));
    }
  }
  throw new Error('unreachable');
}`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
