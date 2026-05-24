import type { TopicNode } from "@/data/types";

export const viteConfiguration: TopicNode = {
  id: "vite-configuration",
  title: "Configuration & Env Vars",
  iconName: "Settings",
  link: "https://vite.dev/config/",
  theory:
    "vite.config.ts is the single configuration file for both the dev server and production build. Key concerns are path aliases, proxy rules for API calls during development, environment variable exposure, and build output tuning.",
  theoryDetail: {
    keyConcepts: [
      "defineConfig: the typed config helper — provides full TypeScript autocomplete on all options",
      "resolve.alias: map short import paths (e.g. @/components) to filesystem paths — eliminates ../../ relative imports",
      "server.proxy: proxy API requests to a backend during development to avoid CORS issues — /api/* → http://localhost:4000",
      "import.meta.env: Vite's mechanism for environment variables — VITE_-prefixed vars are available client-side; others are stripped",
      ".env files: Vite loads .env, .env.local, .env.[mode], .env.[mode].local — local files are gitignored by convention",
      "build.rollupOptions: customise chunk splitting, external packages, output formats — most useful for library mode",
      "base: the public URL base for all assets — set to '/subpath/' for apps deployed at a path other than the domain root",
    ],
    whyItMatters:
      "A well-configured vite.config.ts makes the whole team's development experience consistent — no more relative import chains, no CORS errors against the API, and no accidentally shipping server secrets to the browser.",
    commonPitfalls: [
      "Using @/ alias without configuring both vite.config.ts AND tsconfig.json paths — TypeScript and Vite are separate; both need the alias defined",
      "Exposing secrets via VITE_ prefix — any VITE_ variable is baked into the client bundle; never prefix DATABASE_URL or API keys",
      "Not setting server.host: true in Docker — by default Vite binds to 127.0.0.1 inside the container, making it unreachable from the host",
    ],
    examples: [
      {
        title: "Production-ready vite.config.ts",
        description: "Aliases, dev proxy, and manual chunk splitting in one config.",
        code: `import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env vars for the current mode (development | production | test)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    // ── Path aliases ────────────────────────────────────
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
      },
    },

    // ── Dev server ──────────────────────────────────────
    server: {
      port: 3000,
      host: true,              // bind to 0.0.0.0 (needed inside Docker)
      proxy: {
        // Proxy /api/* to the Express backend
        "/api": {
          target: env.VITE_API_URL ?? "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\\/api/, ""),
        },
      },
    },

    // ── Production build ────────────────────────────────
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      rollupOptions: {
        output: {
          // Split large vendors into separate chunks for better caching
          manualChunks: {
            react:  ["react", "react-dom"],
            router: ["react-router-dom"],
            query:  ["@tanstack/react-query"],
          },
        },
      },
    },
  };
});`,
        language: "typescript",
      },
      {
        title: "tsconfig.json path aliases to match Vite",
        description:
          "TypeScript needs its own paths config — Vite's alias and tsconfig paths must mirror each other.",
        code: `// tsconfig.json — paths must mirror vite.config.ts resolve.alias
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*":           ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*":      ["./src/hooks/*"]
    }
  }
}`,
        language: "json",
      },
    ],
  },
};
