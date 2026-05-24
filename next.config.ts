import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Automatically memoises components and hooks — eliminates manual
  // useMemo / useCallback / React.memo in most cases.
  reactCompiler: true,
};

export default nextConfig;
