const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.APP_ENV === "dev",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
  },
};

module.exports = withPWA(nextConfig);
