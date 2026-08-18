import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard/models", destination: "/models", permanent: false },
      { source: "/dashboard/models/:path*", destination: "/models/:path*", permanent: false },
      { source: "/dashboard/api-keys", destination: "/api-keys", permanent: false },
      { source: "/dashboard/api-keys/:path*", destination: "/api-keys/:path*", permanent: false },
      { source: "/dashboard/billing/:path*", destination: "/billing/:path*", permanent: false },
      { source: "/dashboard/docs", destination: "/docs", permanent: false },
      { source: "/dashboard/docs/:path*", destination: "/docs/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
