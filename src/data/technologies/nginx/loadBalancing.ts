import type { TopicNode } from "@/data/types";

export const nginxLoadBalancing: TopicNode = {
  id: "nginx-load-balancing",
  title: "Load Balancing & Performance",
  iconName: "GitBranch",
  link: "https://nginx.org/en/docs/http/load_balancing.html",
  theory:
    "Nginx can distribute traffic across multiple backend instances using several load balancing algorithms. Combined with response caching, Gzip compression, and connection pooling, Nginx can serve a large application with a fraction of the backend resources compared to forwarding every request naively.",
  theoryDetail: {
    keyConcepts: [
      "Round robin (default): each request goes to the next server in the list in sequence — simple and effective for stateless backends",
      "least_conn: routes each request to the backend with fewest active connections — better for backends with variable response times",
      "ip_hash: routes each client IP to the same backend consistently — needed for sticky sessions when using in-memory session stores",
      "health_check: Nginx Plus feature; in open-source nginx use fail_timeout and max_fails to remove unhealthy upstreams automatically",
      "proxy_cache: cache upstream responses in a shared memory zone — dramatically reduces backend load for cacheable API responses",
      "gzip compression: compress text responses (JSON, HTML, CSS, JS) before sending — reduces bandwidth by 60-80%",
      "Rate limiting: limit_req_zone + limit_req — limit requests per IP at the Nginx layer before they reach the application",
    ],
    whyItMatters:
      "Nginx load balancing is how you scale a Node.js app horizontally — spin up N instances behind Nginx. Caching and compression are configuration-only performance wins that require zero application code changes. Rate limiting at the proxy layer stops DDoS/brute-force attacks before they consume application resources.",
    commonPitfalls: [
      "Using ip_hash with a load balancer in front of Nginx — all clients appear to come from the LB IP, defeating the hash; use $http_x_forwarded_for instead",
      "Caching responses that should not be cached — POST responses, authenticated responses, or anything with Set-Cookie must be excluded from the cache",
      "Not tuning worker_connections — default 1024 per worker; multiply by worker_processes to get total concurrent connections; increase for high-traffic sites",
    ],
    examples: [
      {
        title: "Load balancing, caching, gzip, and rate limiting",
        description:
          "A complete Nginx performance config for a high-traffic Node.js API.",
        code: `# Rate limit zone — 10 req/s per IP
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# Proxy cache zone — 100 MB on disk
proxy_cache_path /var/cache/nginx levels=1:2
                 keys_zone=api_cache:10m
                 max_size=100m inactive=60m;

# Backend pool
upstream api {
    least_conn;                              # fewest active connections
    server 127.0.0.1:4001;
    server 127.0.0.1:4002;
    server 127.0.0.1:4003;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    # ── Gzip ──────────────────────────────────────────────
    gzip on;
    gzip_types application/json text/plain text/css application/javascript;
    gzip_min_length 1024;
    gzip_comp_level 6;

    # ── Rate limiting ──────────────────────────────────────
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;   # burst allows short spikes
        limit_req_status 429;

        # ── Caching for GET requests ──────────────────────
        proxy_cache         api_cache;
        proxy_cache_valid   200 1m;        # cache 200 responses for 1 minute
        proxy_cache_methods GET HEAD;
        proxy_cache_bypass  $http_authorization;  # skip cache for auth'd requests
        add_header          X-Cache-Status $upstream_cache_status;

        proxy_pass         http://api/;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
    }
}`,
        language: "nginx",
      },
    ],
  },
};
