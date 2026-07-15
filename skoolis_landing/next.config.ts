import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const SKOOLIS_APP_URL = process.env.SKOOLIS_APP_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy toutes les routes de l'app d'administration vers skoolis_app
      {
        source: "/login-app",
        destination: `${SKOOLIS_APP_URL}/login-app`,
      },
      {
        source: "/login-app/:path*",
        destination: `${SKOOLIS_APP_URL}/login-app/:path*`,
      },
      {
        source: "/register-app",
        destination: `${SKOOLIS_APP_URL}/register-app`,
      },
      {
        source: "/dashboard",
        destination: `${SKOOLIS_APP_URL}/dashboard`,
      },
      {
        source: "/dashboard/:path*",
        destination: `${SKOOLIS_APP_URL}/dashboard/:path*`,
      },
    ];
  },

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

