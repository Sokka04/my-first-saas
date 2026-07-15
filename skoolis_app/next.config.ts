import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// En dev, les assets _next/static sont servis directement depuis le port 3001
// pour éviter les conflits quand skoolis_landing proxifie les pages sur le port 3000.
const nextConfig: NextConfig = {
  assetPrefix: isDev ? "http://localhost:3001" : undefined,
  async headers() {
    const appSecurityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Content-Security-Policy",
        value:
          `default-src 'self'; script-src 'self' 'unsafe-inline'${
            isDev ? " 'unsafe-eval'" : ""
          }; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self' https://status.skoolis.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
      },
    ];

    return [
      // CORS sur _next/static pour que le proxy skoolis_landing puisse charger les assets
      {
        source: "/_next/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
        ],
      },
      {
        source: "/app",
        headers: appSecurityHeaders,
      },
      {
        source: "/app/:path*",
        headers: appSecurityHeaders,
      },
      {
        source: "/skolis/assets/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Cache-Control",
            value: isDev
              ? "no-store"
              : "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
