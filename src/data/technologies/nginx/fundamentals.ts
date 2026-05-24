import type { TopicNode } from "@/data/types";

export const nginxFundamentals: TopicNode = {
  id: "nginx-fundamentals",
  title: "Nginx as Reverse Proxy",
  iconName: "Server",
  link: "https://nginx.org/en/docs/",
  theory:
    "Nginx is a high-performance web server and reverse proxy. In fullstack deployments, Nginx typically sits in front of your application servers — it terminates SSL/TLS, routes requests to the right upstream, serves static files directly from disk, and rate-limits abusive clients. Understanding Nginx config is essential for any self-hosted or VPS deployment.",
  theoryDetail: {
    keyConcepts: [
      "Reverse proxy: Nginx accepts client connections and forwards them to one or more upstream servers (your Node/Python app) — the client never talks to the app directly",
      "Server block: the nginx equivalent of a virtual host — defines which domain/port to listen on and how to handle requests for that domain",
      "location block: matches URL paths and defines handling — proxy_pass to upstream, serve static files, return redirects",
      "upstream block: defines a pool of backend servers; enables load balancing and health checks",
      "SSL termination: Nginx decrypts HTTPS traffic and forwards plain HTTP to the backend — the app only handles HTTP internally",
      "proxy_pass: the core reverse proxy directive — forwards the request to the specified URL or upstream block",
      "Worker processes & connections: worker_processes auto; worker_connections 1024; — Nginx can handle 1024 concurrent connections per worker with very low overhead",
    ],
    whyItMatters:
      "Even when using cloud load balancers, understanding Nginx config is essential for debugging 502/504 errors, configuring WebSocket proxying, adding custom headers, and setting up SSL. It's a standard part of every VPS deployment and appears in Docker setups as the public-facing entry point.",
    commonPitfalls: [
      "Forgetting trailing slashes in proxy_pass — proxy_pass http://localhost:3000 vs proxy_pass http://localhost:3000/ behaves differently with location blocks",
      "Not increasing proxy timeouts for slow upstreams — default proxy_read_timeout is 60s; long-running API calls need higher values",
      "Missing proxy headers — without proxy_set_header Host $host; the upstream sees the wrong hostname; without X-Real-IP the app can't see the client IP",
      "Serving node_modules or .git directories — always deny access with location ~* /\\.(git|env) { deny all; }",
    ],
    examples: [
      {
        title: "Production Nginx config — HTTPS + WebSocket + static files",
        description:
          "A single-domain Nginx config that terminates SSL, proxies API + WebSocket requests, and serves a built React app from disk.",
        code: `# /etc/nginx/sites-available/myapp
upstream api {
    server 127.0.0.1:4000;       # Node.js/Express backend
    keepalive 16;                 # reuse upstream connections
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    # ── TLS (managed by Certbot / Let's Encrypt) ──────────
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # ── Security headers ───────────────────────────────────
    add_header X-Frame-Options       "SAMEORIGIN"   always;
    add_header X-Content-Type-Options "nosniff"     always;
    add_header Referrer-Policy        "strict-origin" always;

    # ── Static React build ─────────────────────────────────
    root /var/www/myapp/dist;
    index index.html;

    # Serve hashed assets with 1-year cache
    location ~* \\.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ── API proxy ──────────────────────────────────────────
    location /api/ {
        proxy_pass         http://api/;
        proxy_http_version 1.1;
        proxy_set_header   Host            $host;
        proxy_set_header   X-Real-IP       $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # ── WebSocket proxy ────────────────────────────────────
    location /ws/ {
        proxy_pass         http://api/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       $host;
        proxy_read_timeout 3600s;     # long timeout for persistent WS connections
    }

    # ── SPA fallback (React Router) ───────────────────────
    location / {
        try_files $uri $uri/ /index.html;
    }
}`,
        language: "nginx",
      },
    ],
  },
};
