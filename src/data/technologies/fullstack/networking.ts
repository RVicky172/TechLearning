import type { TopicNode } from "@/data/types";

export const fullstackNetworking: TopicNode = {
  id: "fullstack-networking",
  title: "Networking Basics",
  iconName: "Network",
  theory:
    "Every web application communicates over a network. Understanding how devices are addressed, how domain names resolve, how proxies route traffic, and how HTTP transfers data is foundational knowledge every web developer needs.",
  theoryDetail: {
    keyConcepts: [
      "IP addresses uniquely identify every device on a network",
      "DNS translates human-readable domain names into machine-readable IP addresses",
      "Proxies and reverse proxies sit between clients and servers to route, protect, cache, or inspect traffic",
      "HTTP defines how clients and servers exchange messages on the web",
    ],
    whyItMatters:
      "Debugging network issues, understanding latency, and configuring deployments all require solid networking fundamentals. Without them, common problems like DNS propagation delays, reverse proxy misconfiguration, or CORS errors become black boxes.",
    commonPitfalls: [
      "Confusing IPv4 and IPv6 address formats when configuring firewall rules or server bindings",
      "Ignoring DNS TTLs during deployments — changes may not propagate instantly to all clients",
      "Not understanding whether a bug is happening at the app server, load balancer, CDN, or reverse proxy layer",
      "Not understanding the difference between HTTP/1.1, HTTP/2, and HTTP/3 and their performance implications",
    ],
  },
  children: [
    {
      id: "fullstack-ip-addresses",
      title: "IP Addresses",
      iconName: "MapPin",
      link: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work",
      theory:
        "An IP (Internet Protocol) address is a unique numerical label assigned to every device connected to a network. IPv4 uses 32-bit addresses (e.g. 192.168.1.1); IPv6 uses 128-bit addresses to accommodate exponential device growth.",
      theoryDetail: {
        keyConcepts: [
          "IPv4: 32-bit addresses written as four octets (0–255) separated by dots — ~4.3 billion unique addresses",
          "IPv6: 128-bit addresses written in hexadecimal — virtually unlimited address space",
          "Private IP ranges (10.x.x.x, 172.16–31.x.x, 192.168.x.x) are used inside local networks; NAT maps them to a public IP",
          "localhost (127.0.0.1) always refers to the current machine",
        ],
        whyItMatters:
          "Frontend developers encounter IP addresses when configuring dev servers, setting up CORS allowed origins, diagnosing deployment issues, or reading server logs. Knowing the difference between public, private, and loopback addresses prevents misconfigurations.",
        commonPitfalls: [
          "Binding a server to 127.0.0.1 (loopback only) instead of 0.0.0.0 (all interfaces) making it unreachable from outside",
          "Hardcoding IP addresses instead of DNS names — IPs change; hostnames don't (or change less often)",
          "Not accounting for IPv6 in firewall rules when deploying to modern cloud infrastructure",
        ],
        examples: [
          {
            title: "Checking your IP address",
            description: "Common commands to inspect IP addresses in different environments.",
            code: `# Your public IP (what the internet sees)
curl https://api.ipify.org

# Local network interfaces
ip addr show          # Linux
ipconfig              # Windows
ifconfig              # macOS/Linux

# Resolve a hostname to its IP
nslookup example.com
dig example.com`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "fullstack-dns",
      title: "DNS (Domain Name System)",
      iconName: "Globe",
      link: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name",
      theory:
        "DNS is the internet's phone book — it translates human-friendly domain names (example.com) into the IP addresses computers use to route traffic. A full DNS lookup involves recursive resolvers, root servers, TLD servers, and authoritative name servers.",
      theoryDetail: {
        keyConcepts: [
          "DNS resolution order: browser cache → OS cache → recursive resolver → root → TLD → authoritative NS",
          "Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification), NS (name server)",
          "TTL (Time to Live) controls how long resolvers cache a record — lower TTL = faster propagation but more queries",
          "DNS propagation can take seconds to 48 hours depending on TTL and resolver caches",
        ],
        whyItMatters:
          "Every web request starts with a DNS lookup. Understanding DNS lets you configure custom domains, debug propagation delays, set up email verification records, and implement DNS-based load balancing strategies like GeoDNS.",
        commonPitfalls: [
          "Setting TTL too high before a planned IP change — reduce TTL to 300 seconds 24 hours before migrating",
          "Confusing CNAME and A records — a CNAME cannot be set at the zone apex (naked domain)",
          "Forgetting to add SPF/DKIM TXT records after configuring a custom domain for email",
        ],
        examples: [
          {
            title: "DNS record types",
            description: "Common DNS records and their purpose.",
            code: `# A record — maps domain to IPv4
example.com.  300  IN  A  93.184.216.34

# AAAA record — maps domain to IPv6
example.com.  300  IN  AAAA  2606:2800:220:1:248:1893:25c8:1946

# CNAME record — alias one name to another
www.example.com.  300  IN  CNAME  example.com.

# TXT record — arbitrary text, used for verification
example.com.  300  IN  TXT  "v=spf1 include:_spf.google.com ~all"

# Query DNS records
dig A example.com
dig CNAME www.example.com
dig TXT example.com`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "fullstack-http",
      title: "HTTP Protocol",
      iconName: "ArrowLeftRight",
      link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
      theory:
        "HTTP (HyperText Transfer Protocol) is the stateless, text-based protocol that powers the web. A client sends a request (method + headers + optional body) and a server responds with a status code, headers, and a body.",
      theoryDetail: {
        keyConcepts: [
          "Methods: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove), OPTIONS (preflight)",
          "Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error",
          "Headers control caching (Cache-Control), content type (Content-Type), auth (Authorization), CORS, and more",
          "HTTP/2 multiplexes multiple requests over one connection; HTTP/3 uses QUIC (UDP) for lower latency",
        ],
        whyItMatters:
          "Every API call, page load, and asset fetch uses HTTP. Understanding request/response cycles, status codes, and headers is essential for debugging network issues, implementing caching, handling CORS, and designing APIs.",
        commonPitfalls: [
          "Using GET for state-changing operations — GET must be idempotent and safe",
          "Returning 200 OK for error responses with an error field in the body — use the correct status code",
          "Not setting Content-Type headers correctly causing parsers to fail silently",
          "Ignoring HTTPS — always use TLS in production; HTTP sends data in plain text",
        ],
        examples: [
          {
            title: "HTTP request and response anatomy",
            description: "Structure of an HTTP request and the corresponding response.",
            code: `# HTTP Request
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>

{"name": "Alice", "email": "alice@example.com"}

# HTTP Response
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/42

{"id": 42, "name": "Alice", "email": "alice@example.com"}`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "fullstack-proxies",
      title: "Proxies and Their Types",
      iconName: "Waypoints",
      link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling",
      theory:
        "A proxy is an intermediary that forwards network traffic between two parties. In real systems, proxies are used for security, caching, load balancing, observability, TLS termination, and hiding internal services from direct public access.",
      theoryDetail: {
        keyConcepts: [
          "Forward proxy sits in front of clients and is commonly used in corporate networks for filtering, logging, or outbound access control.",
          "Reverse proxy sits in front of servers and is common in production systems for TLS termination, routing, load balancing, caching, and rate limiting.",
          "Transparent proxies intercept traffic without explicit client configuration, while explicit proxies require the client to send traffic through them intentionally.",
          "CDNs and API gateways are specialized proxy layers with additional caching, security, and policy features.",
        ],
        whyItMatters:
          "Most real deployments include at least one proxy layer such as Nginx, Cloudflare, AWS ALB, Vercel edge, or an API gateway. Understanding proxies is necessary for debugging headers, IP forwarding, HTTPS termination, cookies, WebSocket behavior, and deployment routing.",
        commonPitfalls: [
          "Trusting the X-Forwarded-For header from untrusted sources instead of only from known proxy layers.",
          "Forgetting to configure proxy-aware secure cookies or HTTPS redirects when TLS terminates before the app server.",
          "Breaking uploads or WebSockets because the reverse proxy timeout, buffer, or upgrade settings are wrong.",
        ],
        comparisons: [
          {
            title: "Common proxy types",
            summary: "The main difference is which side the proxy represents and what problem it solves.",
            points: [
              "Forward proxy: represents the client for outbound traffic",
              "Reverse proxy: represents backend servers for inbound traffic",
              "Load balancer: distributes traffic across many healthy instances",
              "CDN: caches static or edge-computable content close to users",
              "API gateway: centralizes auth, rate limits, routing, and policy enforcement for APIs",
            ],
          },
        ],
        examples: [
          {
            title: "Typical reverse proxy flow",
            description: "A common path for a production web request.",
            code: `Browser
  -> CDN / WAF
  -> Load balancer or reverse proxy
  -> application service
  -> database

Reverse proxy jobs:
- terminate TLS
- add X-Forwarded-* headers
- route /api and /assets differently
- enforce request size and timeout limits
- retry or fail over upstreams`,
            language: "text",
          },
        ],
      },
    },
  ],
};
