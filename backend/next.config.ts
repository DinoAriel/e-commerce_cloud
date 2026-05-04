import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Konfigurasi CORS headers agar React frontend bisa akses API.
   * Ini berlaku untuk semua route /api/*
   */
  async headers() {
    return [
      {
        // Terapkan CORS ke semua API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
