import type { TopicNode } from "@/data/types";

export const nodeCluster: TopicNode = {
  id: "node-cluster",
  title: "Scaling with the Cluster Module",
  iconName: "Network",
  theory: "Because Node.js is single-threaded, a single instance of Node.js runs in a single thread. To take advantage of multi-core systems, you must launch a cluster of Node.js processes to handle the load.",
  theoryDetail: {
    keyConcepts: [
      "Master Process: Orchestrates the cluster. It does not handle HTTP requests itself.",
      "Worker Processes: Spawned by the Master. These do the actual work.",
      "IPC (Inter-Process Communication): The channel through which the Master and Workers communicate.",
      "PM2: In the real world, developers rarely write raw cluster code; they use process managers like PM2 to handle this automatically."
    ],
    whyItMatters: "If you deploy a standard Node.js server on an 8-core AWS EC2 instance, you are wasting 7 cores (87.5% of your server capacity). Clustering ensures you utilize the full hardware.",
    commonPitfalls: [
      "Stateful Authentication: If User A logs in and the session is stored in memory on Worker 1, their next request might hit Worker 2, logging them out. ALWAYS use Redis for session storage when clustering.",
      "Zombie Processes: Failing to respawn workers when they crash."
    ],
    examples: [
      {
        title: "Basic Native Clustering",
        description: "How to manually scale Node.js across all CPU cores.",
        code: `import cluster from 'cluster';
import http from 'http';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Master \${process.pid} is running\`);

  // Fork workers for every CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Respawn workers if they die
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died. Restarting...\`);
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(\`Hello from Worker \${process.pid}\\n\`);
  }).listen(8000);

  console.log(\`Worker \${process.pid} started\`);
}`,
        language: "javascript"
      }
    ]
  },
  children: []
};
