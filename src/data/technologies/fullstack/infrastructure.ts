import type { TopicNode } from "@/data/types";

export const fullstackInfrastructure: TopicNode = {
  id: "fullstack-infrastructure",
  title: "Infrastructure & Delivery",
  iconName: "Server",
  theory:
    "Modern web applications rely on global infrastructure to serve content fast and handle traffic spikes. CDNs cache content close to users; load balancers distribute requests across multiple servers for reliability and scale.",
  theoryDetail: {
    keyConcepts: [
      "CDNs cache static assets (JS, CSS, images) at edge locations near users, reducing latency",
      "Load balancers distribute traffic across server instances to prevent any single point of failure",
      "Edge computing moves logic closer to users — reducing round-trip time for dynamic responses",
    ],
    whyItMatters:
      "Infrastructure decisions directly impact user experience (page load time, availability) and cost. Frontend developers who understand CDNs and load balancing configure deployments better and diagnose production issues faster.",
    commonPitfalls: [
      "Not setting correct Cache-Control headers — CDNs cache responses you intended to be dynamic",
      "Storing session state on individual servers — a load balancer will route requests to different instances",
      "Ignoring geographic distribution — a single-region deployment adds 200+ ms latency for distant users",
    ],
  },
  children: [
    {
      id: "fullstack-cdn",
      title: "CDNs (Content Delivery Networks)",
      iconName: "Globe",
      link: "https://developer.mozilla.org/en-US/docs/Glossary/CDN",
      theory:
        "A CDN is a globally distributed network of servers that caches and serves content from the location closest to the user. This reduces latency, offloads traffic from origin servers, and improves resilience.",
      theoryDetail: {
        keyConcepts: [
          "Edge PoPs (Points of Presence) are CDN nodes distributed worldwide — users connect to the nearest one",
          "Cache-Control and Surrogate-Control headers tell CDNs how long to cache a response",
          "Cache invalidation / purge APIs let you clear stale content instantly after deployments",
          "Popular CDNs: Cloudflare, AWS CloudFront, Fastly, Vercel Edge Network, Akamai",
        ],
        whyItMatters:
          "Without a CDN, every request travels to your origin server. With a CDN, JS bundles, images, and fonts are served from PoPs milliseconds away. This is often the highest-impact performance improvement for global users.",
        commonPitfalls: [
          "Setting Cache-Control: no-cache on static assets — CDNs can't cache them, losing all the benefit",
          "Not versioning asset filenames (content hashing) — stale cached files are served after a deploy",
          "Caching API responses that include user-specific data — the same cached response is served to all users",
        ],
        examples: [
          {
            title: "Cache-Control headers for CDN",
            description: "Setting appropriate caching headers for static assets and dynamic API responses.",
            code: `# Static assets with content hash in filename
# (e.g. /static/main.a3f9b2.js) — cache forever
Cache-Control: public, max-age=31536000, immutable

# HTML pages — revalidate on every request
Cache-Control: public, max-age=0, must-revalidate

# API responses — short cache, revalidate in background
Cache-Control: public, s-maxage=60, stale-while-revalidate=300

# Private user data — never cache on CDN
Cache-Control: private, no-store`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "fullstack-load-balancing",
      title: "Load Balancing",
      iconName: "GitFork",
      link: "https://www.nginx.com/resources/glossary/load-balancing/",
      theory:
        "A load balancer distributes incoming traffic across multiple server instances. This prevents any single server from becoming a bottleneck, enables zero-downtime deployments, and provides automatic failover when a server goes down.",
      theoryDetail: {
        keyConcepts: [
          "Algorithms: Round Robin (default), Least Connections, IP Hash (sticky sessions), Weighted",
          "Health checks: load balancers probe /healthz endpoints and remove unhealthy instances from rotation",
          "Layer 4 (TCP) vs Layer 7 (HTTP) load balancing — L7 can route based on URL, headers, or cookies",
          "Tools: AWS ALB/NLB, NGINX, HAProxy, Traefik, Cloudflare Load Balancing",
        ],
        whyItMatters:
          "Without a load balancer, one server handles all traffic. Load balancing enables horizontal scaling (add more servers under load), rolling deployments (update instances one at a time), and high availability (auto-route around failures).",
        commonPitfalls: [
          "Storing session in server memory — a user routed to a different instance loses their session; use Redis",
          "Not exposing a /healthz endpoint — load balancers can't detect unhealthy instances without it",
          "Configuring sticky sessions as a permanent fix for stateful apps instead of externalizing state",
        ],
        examples: [
          {
            title: "NGINX load balancer config",
            description: "Distributing traffic across three upstream Node.js servers.",
            code: `# /etc/nginx/nginx.conf
upstream api_servers {
  least_conn;  # route to server with fewest active connections
  server app1:3000;
  server app2:3000;
  server app3:3000;

  keepalive 32;  # reuse connections
}

server {
  listen 80;

  location /api/ {
    proxy_pass http://api_servers;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /healthz {
    return 200 "OK";
    add_header Content-Type text/plain;
  }
}`,
            language: "nginx",
          },
        ],
      },
    },
  ],
};
