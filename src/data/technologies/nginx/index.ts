import type { Technology } from "@/data/types";
import { nginxFundamentals } from "@/data/technologies/nginx/fundamentals";
import { nginxLoadBalancing } from "@/data/technologies/nginx/loadBalancing";

const nginx: Technology = {
  id: "nginx",
  name: "Nginx",
  description:
    "High-performance reverse proxy and web server — SSL termination, load balancing, caching, and rate limiting.",
  color: "bg-green-700",
  iconName: "Server",
  deviconClass: "devicon-nginx-original colored",
  tree: [nginxFundamentals, nginxLoadBalancing],
};

export default nginx;
